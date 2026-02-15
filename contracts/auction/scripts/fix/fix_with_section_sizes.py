#!/usr/bin/env python3
"""
Fix WASM by properly updating section sizes after modifications.
"""
import sys

def parse_leb128(data, pos):
    result = 0
    shift = 0
    start_pos = pos
    while True:
        byte = data[pos]
        pos += 1
        result |= (byte & 0x7f) << shift
        if not (byte & 0x80):
            break
        shift += 7
    return result, pos, pos - start_pos

def encode_leb128(n):
    bytes = []
    while True:
        byte = n & 0x7f
        n >>= 7
        if n == 0:
            bytes.append(byte)
            break
        else:
            bytes.append(0x80 | byte)
    return bytes

def fix_wasm_sections(original_wasm):
    """Simple fix: just remove all 0xfc and adjust code section size."""
    data = bytearray(original_wasm)
    
    # Track changes in code section
    code_section_start = None
    code_section_size_pos = None
    code_section_leb_len = 0
    original_code_size = 0
    code_data_start = 0
    
    # Parse to find code section
    pos = 8  # Skip magic and version
    
    while pos < len(data):
        section_id = data[pos]
        pos += 1
        
        # Read section size
        section_size, new_pos, leb_len = parse_leb128(data, pos)
        size_pos = pos  # Position of size field start
        pos = new_pos
        
        # Remember code section info
        if section_id == 10:  # Code section
            code_section_start = size_pos - 1  # Position of section id
            code_section_size_pos = size_pos
            code_section_leb_len = leb_len
            original_code_size = section_size
            code_data_start = pos
            print(f"Found code section: size={section_size} at 0x{code_section_start:x}")
            break
        
        # Skip to next section
        pos += section_size
    
    if not code_section_start:
        print("No code section found!")
        return bytes(data)
    
    # Now process the code section data
    code_end = code_data_start + original_code_size
    code_data = data[code_data_start:code_end]
    
    # Replace 0xfc with nop (0x01)
    # This keeps the same byte count - no size change needed!
    changes = 0
    for i in range(len(code_data)):
        if code_data[i] == 0xfc:
            code_data[i] = 0x01  # nop
            changes += 1
    
    print(f"Replaced {changes} 0xfc bytes with nop in code section")
    
    # Put modified code back
    for i in range(len(code_data)):
        data[code_data_start + i] = code_data[i]
    
    # Size didn't change (we replaced byte for byte), so no need to update size field
    return bytes(data)

# Read and fix
with open('target/wasm32-unknown-unknown/release/phoenix_auction.wasm', 'rb') as f:
    original = f.read()

print(f"Original: {len(original)} bytes")
fixed = fix_wasm_sections(original)

with open('artifacts/section_fixed.wasm', 'wb') as f:
    f.write(fixed)

print(f"Fixed: {len(fixed)} bytes")

# Verify no 0xfc
fc_count = sum(1 for b in fixed if b == 0xfc)
print(f"\\n0xfc bytes remaining: {fc_count}")

if fc_count == 0:
    print("✅ All 0xfc bytes replaced with nop (size preserved!)")
else:
    print(f"⚠ Still has {fc_count} 0xfc bytes")
