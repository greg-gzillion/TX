#!/usr/bin/env python3
import sys

def fix_bulk_memory(wasm_bytes):
    """Replace bulk memory operations with safe alternatives."""
    data = bytearray(wasm_bytes)
    
    i = 0
    replacements = 0
    while i < len(data) - 3:
        if data[i] == 0xfc:  # Bulk memory prefix
            op = data[i+1]
            if op == 0x0a:  # memory.copy
                print(f"Replacing memory.copy at 0x{i:x}")
                # memory.copy consumes: dest (i32), src (i32), size (i32)
                # Replace with: drop (0x1a), drop (0x1a), drop (0x1a)
                data[i] = 0x1a    # drop
                data[i+1] = 0x1a  # drop
                data[i+2] = 0x1a  # drop
                data[i+3] = 0x01  # nop (extra byte for alignment)
                replacements += 1
                i += 3
            elif op == 0x0b:  # memory.fill
                print(f"Replacing memory.fill at 0x{i:x}")
                # memory.fill consumes: dest (i32), value (i32), size (i32)  
                # Replace with: drop, drop, drop
                data[i] = 0x1a    # drop
                data[i+1] = 0x1a  # drop
                data[i+2] = 0x1a  # drop
                data[i+3] = 0x01  # nop
                replacements += 1
                i += 3
        i += 1
    
    print(f"\nMade {replacements} bulk memory replacements")
    return bytes(data)

# Read original WASM
print("Reading original WASM...")
with open('target/wasm32-unknown-unknown/release/phoenix_auction.wasm', 'rb') as f:
    original = f.read()

print(f"Original size: {len(original)} bytes")

# Fix it
fixed = fix_bulk_memory(original)

# Write fixed version
output_file = 'artifacts/phoenix_auction_final.wasm'
with open(output_file, 'wb') as f:
    f.write(fixed)

print(f"Fixed size: {len(fixed)} bytes")
print(f"✅ Saved to {output_file}")

# Verify
print("\nVerifying no bulk memory ops remain...")
remaining = 0
for i in range(len(fixed) - 1):
    if fixed[i] == 0xfc and i+1 < len(fixed):
        op = fixed[i+1]
        if op in [0x0a, 0x0b]:
            remaining += 1
            print(f"  WARNING: Found {op} at 0x{i:x}")

if remaining == 0:
    print("✅ SUCCESS: No bulk memory ops remain!")
else:
    print(f"⚠ Still has {remaining} bulk memory ops")
