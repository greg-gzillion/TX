#!/usr/bin/env python3
"""
Remove ALL 0xfc bytes from WASM file.
This is a nuclear option - might break the contract!
"""
import sys

def remove_fc_bytes(wasm_bytes):
    """Replace all 0xfc bytes with nop (0x01)."""
    data = bytearray(wasm_bytes)
    
    changes = 0
    for i in range(len(data)):
        if data[i] == 0xfc:
            data[i] = 0x01  # nop
            changes += 1
    
    print(f"Replaced {changes} 0xfc bytes with nop")
    return bytes(data)

# Read and fix
with open('target/wasm32-unknown-unknown/release/phoenix_auction.wasm', 'rb') as f:
    original = f.read()

print(f"Original size: {len(original)} bytes")
fixed = remove_fc_bytes(original)

with open('artifacts/no_fc_at_all.wasm', 'wb') as f:
    f.write(fixed)

print(f"Fixed size: {len(fixed)} bytes")

# Verify
fc_count = sum(1 for b in fixed if b == 0xfc)
print(f"\n0xfc bytes remaining: {fc_count}")

if fc_count == 0:
    print("✅ Successfully removed ALL 0xfc bytes!")
else:
    print("⚠ Still has 0xfc bytes")
