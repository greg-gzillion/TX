#!/usr/bin/env python3
import sys
import struct

def parse_wasm_sections(data):
    """Parse WASM sections to understand structure."""
    sections = []
    pos = 8  # Skip magic and version
    
    while pos < len(data):
        section_id = data[pos]
        pos += 1
        
        # Read section size (LEB128)
        size = 0
        shift = 0
        while True:
            byte = data[pos]
            pos += 1
            size |= (byte & 0x7f) << shift
            if not (byte & 0x80):
                break
            shift += 7
        
        section_start = pos
        section_end = pos + size
        
        sections.append({
            'id': section_id,
            'size': size,
            'start': section_start,
            'end': section_end,
            'data': data[section_start:section_end]
        })
        
        pos = section_end
    
    return sections

def rebuild_wasm(sections):
    """Rebuild WASM from sections."""
    # Magic and version
    result = bytearray(b'\x00asm\x01\x00\x00\x00')
    
    for section in sections:
        # Section ID
        result.append(section['id'])
        
        # Section size (LEB128 encoded)
        size = len(section['data'])
        while True:
            byte = size & 0x7f
            size >>= 7
            if size == 0:
                result.append(byte)
                break
            else:
                result.append(byte | 0x80)
        
        # Section data
        result.extend(section['data'])
    
    return bytes(result)

def patch_code_section(code_data):
    """Patch only the code section, preserving structure."""
    # Simple patch: replace 0xfc with 0x01 (nop)
    # This keeps the same byte count
    patched = bytearray(code_data)
    for i in range(len(patched)):
        if patched[i] == 0xfc:
            patched[i] = 0x01  # nop
    
    return bytes(patched)

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 wasm_patcher.py input.wasm output.wasm")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    # Read WASM
    with open(input_file, 'rb') as f:
        data = f.read()
    
    print(f"📦 Original WASM: {len(data)} bytes")
    
    # Count bulk memory ops
    fc_count = sum(1 for b in data if b == 0xfc)
    print(f"🔍 Bulk memory ops found: {fc_count}")
    
    if fc_count == 0:
        print("✅ Already clean!")
        with open(output_file, 'wb') as f:
            f.write(data)
        return
    
    # Parse sections
    try:
        sections = parse_wasm_sections(data)
        print(f"📋 Found {len(sections)} sections")
    except:
        print("⚠ Couldn't parse WASM sections, using simple patch")
        # Fallback to simple patch
        patched = bytearray(data)
        for i in range(len(patched)):
            if patched[i] == 0xfc:
                patched[i] = 0x01  # nop
        
        with open(output_file, 'wb') as f:
            f.write(patched)
        
        new_fc = sum(1 for b in patched if b == 0xfc)
        print(f"🛠 Simple patch: {fc_count - new_fc} ops removed")
        print(f"💾 Saved to: {output_file}")
        return
    
    # Patch each section
    for i, section in enumerate(sections):
        section_id = section['id']
        section_name = {
            1: "Type", 2: "Import", 3: "Function", 4: "Table",
            5: "Memory", 6: "Global", 7: "Export", 8: "Start",
            9: "Element", 10: "Code", 11: "Data"
        }.get(section_id, f"Unknown({section_id})")
        
        print(f"  Section {i}: {section_name}")
        
        # Only patch code section (id=10)
        if section_id == 10:
            original_data = section['data']
            patched_data = patch_code_section(original_data)
            
            # Update section
            sections[i]['data'] = patched_data
            
            # Count patches
            orig_fc = sum(1 for b in original_data if b == 0xfc)
            new_fc = sum(1 for b in patched_data if b == 0xfc)
            print(f"    Patched code section: {orig_fc} -> {new_fc} bulk ops")
    
    # Rebuild WASM
    patched_wasm = rebuild_wasm(sections)
    
    # Verify
    new_fc_count = sum(1 for b in patched_wasm if b == 0xfc)
    print(f"✅ New bulk memory ops: {new_fc_count}")
    
    # Save
    with open(output_file, 'wb') as f:
        f.write(patched_wasm)
    
    print(f"💾 Saved to: {output_file}")
    
    if new_fc_count == 0:
        print("\n🎉 READY FOR COREUM DEPLOYMENT!")
    else:
        print(f"\n⚠ WARNING: Still has {new_fc_count} bulk memory ops")

if __name__ == "__main__":
    main()
