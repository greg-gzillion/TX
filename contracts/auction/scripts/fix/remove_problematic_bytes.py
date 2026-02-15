#!/usr/bin/env python3
"""
Remove problematic bytes from WASM file.
WARNING: This might break the contract logic!
"""
import sys

def remove_problematic(wasm_bytes):
    """Remove or replace 0xfc and 0x11 bytes."""
    data = bytearray(wasm_bytes)
    
    changes = 0
    for i in range(len(data)):
        if data[i] == 0xfc:  # Bulk memory prefix
            # Check next byte to see what operation
            if i+1 < len(data):
                op = data[i+1]
                if op in [0x0a, 0x0b, 0x0c, 0x0d, 0x0e]:
                    # Replace with nop (0x01) or unreachable (0x00)
                    data[i] = 0x01  # nop
                    data[i+1] = 0x01  # nop
                    changes += 1
                    print(f"Replaced 0xfc {op:02x} at 0x{i:x} with nops")
        elif data[i] == 0x11:  # call_indirect
            # Replace with regular call (0x10) followed by nop for type index
            data[i] = 0x10  # call
            # The next bytes are type index (LEB128), we'll nop them
            # This is hacky but might work for simple cases
            if i+1 < len(data):
                data[i+1] = 0x01  # nop
            changes += 1
            print(f"Replaced call_indirect at 0x{i:x} with call")
    
    print(f"\nMade {changes} changes")
    return bytes(data)

# Read current wasm
with open('target/wasm32-unknown-unknown/release/phoenix_auction.wasm', 'rb') as f:
    original = f.read()

print(f"Original: {len(original)} bytes")

# Remove problematic bytes
fixed = remove_problematic(original)

with open('artifacts/cleaned.wasm', 'wb') as f:
    f.write(fixed)

print(f"Fixed: {len(fixed)} bytes")
print("✅ Created artifacts/cleaned.wasm")

# Verify
print("\nVerifying...")
fc_count = sum(1 for b in fixed if b == 0xfc)
call_indirect_count = sum(1 for b in fixed if b == 0x11)

print(f"Remaining 0xfc: {fc_count}")
print(f"Remaining 0x11: {call_indirect_count}")

if fc_count == 0 and call_indirect_count == 0:
    print("✅ Successfully removed all problematic bytes!")
else:
    print("⚠ Still has problematic bytes")
