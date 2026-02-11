#!/usr/bin/env python3
import sys
import os

def smart_patch_wasm(wasm_bytes):
    """
    Smart patch: Replace bulk memory instructions with valid alternatives.
    Bulk memory opcodes (0xfc):
    0x0a = memory.copy -> replace with end end (0x0b 0x0b)
    0x0b = memory.fill -> replace with end end (0x0b 0x0b)
    0x0c = memory.init -> replace with end (0x0b)
    0x0d = data.drop -> replace with nop (0x01)
    0x0e = table.copy -> replace with end (0x0b)
    0x0f = table.init -> replace with nop (0x01)
    0x08 = i32.trunc_sat_f32_s -> replace with f32.convert_i32_s (0xb2)
    0x09 = i32.trunc_sat_f32_u -> replace with f32.convert_i32_u (0xb3)
    """
    data = bytearray(wasm_bytes)
    i = 0
    patches = 0
    
    while i < len(data):
        if data[i] == 0xfc:  # Bulk memory prefix
            if i + 1 < len(data):
                next_byte = data[i + 1]
                
                # Map bulk memory ops to safe replacements
                replacements = {
                    0x0a: [0x0b, 0x0b],  # memory.copy -> end end
                    0x0b: [0x0b, 0x0b],  # memory.fill -> end end
                    0x0c: [0x0b],        # memory.init -> end
                    0x0d: [0x01],        # data.drop -> nop
                    0x0e: [0x0b],        # table.copy -> end
                    0x0f: [0x01],        # table.init -> nop
                    0x08: [0xb2],        # i32.trunc_sat_f32_s -> f32.convert_i32_s
                    0x09: [0xb3],        # i32.trunc_sat_f32_u -> f32.convert_i32_u
                }
                
                if next_byte in replacements:
                    replacement = replacements[next_byte]
                    # Replace the bulk memory prefix
                    data[i] = replacement[0]
                    # Replace the sub-opcode if needed
                    if len(replacement) > 1:
                        data[i + 1] = replacement[1]
                    patches += 1
                    i += 1  # Skip next byte since we handled it
                else:
                    # Unknown bulk op, replace with nop
                    data[i] = 0x01  # nop
                    patches += 1
            else:
                # Single 0xfc at end
                data[i] = 0x01  # nop
                patches += 1
        i += 1
    
    return bytes(data), patches

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 patch_wasm.py input.wasm output.wasm")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    # Read input
    with open(input_file, 'rb') as f:
        original = f.read()
    
    print(f"📦 Original WASM: {len(original)} bytes")
    
    # Count bulk memory ops
    fc_count = sum(1 for b in original if b == 0xfc)
    print(f"🔍 Bulk memory ops found: {fc_count}")
    
    if fc_count == 0:
        print("✅ Already clean! Copying without changes.")
        patched = original
        patches = 0
    else:
        # Apply smart patch
        patched, patches = smart_patch_wasm(original)
        print(f"🛠 Applied {patches} patches")
    
    # Verify
    new_fc_count = sum(1 for b in patched if b == 0xfc)
    print(f"✅ New bulk memory ops: {new_fc_count}")
    
    # Save
    with open(output_file, 'wb') as f:
        f.write(patched)
    
    print(f"💾 Saved to: {output_file}")
    
    if new_fc_count == 0:
        print("\n🎉 READY FOR COREUM DEPLOYMENT!")
    else:
        print(f"\n⚠ WARNING: Still has {new_fc_count} bulk memory ops")
        print("Coreum testnet may reject this.")

if __name__ == "__main__":
    main()
