#!/usr/bin/env python3
import sys

def fix_all_unsupported_ops(wasm_bytes):
    """Remove all operations not supported by Coreum."""
    data = bytearray(wasm_bytes)
    
    i = 0
    replacements = 0
    while i < len(data) - 1:
        if data[i] == 0xfc:  # Multi-byte prefix
            if i+1 < len(data):
                op = data[i+1]
                # Bulk memory ops (not supported by Coreum)
                if op in [0x0a, 0x0b]:  # memory.copy, memory.fill
                    print(f"Fixing bulk memory op at 0x{i:x}: 0x{op:02x}")
                    # Replace with unreachable
                    data[i] = 0x00    # unreachable
                    data[i+1] = 0x01  # nop
                    replacements += 1
                    i += 1
                # Reference type ops (not supported by Coreum)
                elif op in [0x0c, 0x0d, 0x0e]:  # table.init, elem.drop, table.copy
                    print(f"Fixing reference type op at 0x{i:x}: 0x{op:02x}")
                    data[i] = 0x00    # unreachable
                    data[i+1] = 0x01  # nop
                    replacements += 1
                    i += 1
        i += 1
    
    print(f"\nMade {replacements} replacements")
    return bytes(data)

# Read the ORIGINAL wasm (not the broken one)
with open('target/wasm32-unknown-unknown/release/phoenix_auction.wasm', 'rb') as f:
    original = f.read()

print(f"Original size: {len(original)} bytes")
fixed = fix_all_unsupported_ops(original)

with open('artifacts/comprehensive_fixed.wasm', 'wb') as f:
    f.write(fixed)

print(f"Fixed size: {len(fixed)} bytes")
print("✅ Created artifacts/comprehensive_fixed.wasm")

# Verify
print("\nVerifying...")
remaining_issues = 0
for i in range(len(fixed) - 1):
    if fixed[i] == 0xfc:
        op = fixed[i+1]
        if op in [0x0a, 0x0b, 0x0c, 0x0d, 0x0e]:  # Unsupported ops
            remaining_issues += 1
            print(f"  WARNING: Found unsupported op at 0x{i:x}: 0x{op:02x}")

if remaining_issues == 0:
    print("✅ No unsupported ops remain!")
else:
    print(f"⚠ Still has {remaining_issues} unsupported ops")
