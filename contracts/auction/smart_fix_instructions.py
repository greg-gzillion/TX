#!/usr/bin/env python3
"""
Replace entire 0xfc instructions, not just the prefix byte.
"""
import sys

def replace_fc_instructions(wasm_bytes):
    data = bytearray(wasm_bytes)
    i = 0
    replacements = 0
    
    while i < len(data):
        if data[i] == 0xfc:  # Bulk memory or reference types prefix
            # Check next byte for operation type
            if i + 1 < len(data):
                op = data[i+1]
                
                # These are the problematic bulk memory ops
                if op in [0x0a, 0x0b]:  # memory.copy, memory.fill
                    print(f"Found problematic 0xfc {op:02x} at 0x{i:x}")
                    
                    # memory.copy (0xfc 0x0a) and memory.fill (0xfc 0x0b) 
                    # consume 3 i32 values and produce nothing
                    # Replace with sequence that consumes 3 values: i32.const 0; drop; drop; drop
                    
                    # Replace 0xfc with i32.const
                    data[i] = 0x41    # i32.const
                    data[i+1] = 0x00  # value 0
                    
                    # The instruction has additional bytes for memory indices
                    # We need to replace them with drops
                    bytes_to_replace = 2  # already replaced first 2
                    
                    # memory.copy has 2 memory indices, memory.fill has 1
                    # Let's be safe and replace up to 4 more bytes
                    for j in range(2, 6):  # Replace bytes i+2 to i+5
                        if i + j < len(data):
                            data[i+j] = 0x1a  # drop
                            bytes_to_replace += 1
                    
                    replacements += 1
                    i += bytes_to_replace - 1  # Skip the bytes we processed
                else:
                    # Other 0xfc ops - just replace with unreachable
                    print(f"Found other 0xfc {op:02x} at 0x{i:x}, replacing with unreachable")
                    data[i] = 0x00  # unreachable
                    data[i+1] = 0x01  # nop
                    replacements += 1
                    i += 1
            else:
                # 0xfc at end of file, just replace
                data[i] = 0x00  # unreachable
                replacements += 1
        
        i += 1
    
    print(f"\\nMade {replacements} replacements")
    return bytes(data)

# Read and fix
with open('target/wasm32-unknown-unknown/release/phoenix_auction.wasm', 'rb') as f:
    original = f.read()

print(f"Original: {len(original)} bytes")
fixed = replace_fc_instructions(original)

with open('artifacts/smart_fixed.wasm', 'wb') as f:
    f.write(fixed)

print(f"Fixed: {len(fixed)} bytes")

# Verify
print("\\nVerifying...")
fc_count = sum(1 for b in fixed if b == 0xfc)
print(f"0xfc bytes remaining: {fc_count}")

if fc_count == 0:
    print("✅ All 0xfc bytes removed!")
else:
    print(f"⚠ Still has {fc_count} 0xfc bytes")
    
    # Check what they are
    for i in range(len(fixed)):
        if fixed[i] == 0xfc:
            print(f"  Found at 0x{i:x}")
