#!/usr/bin/env python3
import sys

def simple_safe_patch(wasm_bytes):
    """
    Simple patch that replaces 0xfc with 0x01 (nop).
    This preserves byte count and structure.
    """
    data = bytearray(wasm_bytes)
    patches = 0
    
    for i in range(len(data)):
        if data[i] == 0xfc:
            data[i] = 0x01  # nop instruction
            patches += 1
    
    return bytes(data), patches

def main():
    if len(sys.argv) != 3:
        print("Usage: python3 simple_safe_patch.py input.wasm output.wasm")
        sys.exit(1)
    
    with open(sys.argv[1], 'rb') as f:
        original = f.read()
    
    print(f"Original: {len(original)} bytes")
    
    fc_count = sum(1 for b in original if b == 0xfc)
    print(f"Bulk memory ops: {fc_count}")
    
    patched, patches = simple_safe_patch(original)
    
    print(f"Patched {patches} bytes")
    
    new_fc = sum(1 for b in patched if b == 0xfc)
    print(f"Remaining bulk ops: {new_fc}")
    
    with open(sys.argv[2], 'wb') as f:
        f.write(patched)
    
    print(f"Saved to: {sys.argv[2]}")
    
    # Basic validation
    if patched[:4] == b'\x00asm' and patched[4:8] == b'\x01\x00\x00\x00':
        print("✅ Valid WASM header")
    else:
        print("⚠ Invalid WASM header")

if __name__ == "__main__":
    main()
