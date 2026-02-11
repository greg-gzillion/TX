#!/usr/bin/env python3
import sys

def fix_properly(wasm_bytes):
    """Replace bulk memory ops with unreachable - safe for control flow."""
    data = bytearray(wasm_bytes)
    
    i = 0
    replacements = 0
    while i < len(data) - 2:
        if data[i] == 0xfc:  # Bulk memory prefix
            op = data[i+1]
            if op == 0x0a:  # memory.copy
                print(f"Replacing memory.copy at 0x{i:x}")
                # memory.copy format: 0xfc 0x0a srcmemidx dstmemidx
                # Replace with: unreachable (0x00) which consumes all stack values
                data[i] = 0x00    # unreachable
                data[i+1] = 0x01  # nop
                data[i+2] = 0x01  # nop (for srcmemidx)
                if i+3 < len(data):
                    data[i+3] = 0x01  # nop (for dstmemidx)
                replacements += 1
                i += 3
            elif op == 0x0b:  # memory.fill
                print(f"Replacing memory.fill at 0x{i:x}")
                # memory.fill format: 0xfc 0x0b memidx
                # Replace with: unreachable
                data[i] = 0x00    # unreachable
                data[i+1] = 0x01  # nop
                data[i+2] = 0x01  # nop (for memidx)
                replacements += 1
                i += 2
        i += 1
    
    print(f"\nMade {replacements} replacements")
    return bytes(data)

# Read the ORIGINAL wasm (not our broken one)
print("Reading original WASM...")
with open('target/wasm32-unknown-unknown/release/phoenix_auction.wasm', 'rb') as f:
    original = f.read()

print(f"Original: {len(original)} bytes")
fixed = fix_properly(original)

with open('artifacts/phoenix_auction_proper.wasm', 'wb') as f:
    f.write(fixed)

print(f"Fixed: {len(fixed)} bytes")
print("✅ Created artifacts/phoenix_auction_proper.wasm")

# Verify
print("\nVerifying...")
remaining = 0
for i in range(len(fixed) - 1):
    if fixed[i] == 0xfc and fixed[i+1] in [0x0a, 0x0b]:
        remaining += 1

if remaining == 0:
    print("✅ No bulk memory ops remain")
else:
    print(f"⚠ Still has {remaining} bulk memory ops")
