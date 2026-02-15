#!/usr/bin/env python3
import sys

with open('target/wasm32-unknown-unknown/release/phoenix_auction.wasm', 'rb') as f:
    data = bytearray(f.read())

print(f"Original: {len(data)} bytes")

# Simple replacement: if we find 0xfc 0x0a or 0xfc 0x0b, replace with NOPs
replacements = 0
for i in range(len(data) - 1):
    if data[i] == 0xfc:
        if data[i+1] == 0x0a or data[i+1] == 0x0b:
            # Replace with unreachable (0x00) followed by NOPs
            data[i] = 0x00  # unreachable
            data[i+1] = 0x01  # nop
            replacements += 1

print(f"Made {replacements} replacements")

with open('artifacts/simple_fixed.wasm', 'wb') as f:
    f.write(data)

print(f"Fixed: {len(data)} bytes")
print("✅ Created artifacts/simple_fixed.wasm")
