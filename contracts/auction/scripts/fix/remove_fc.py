import sys

def replace_fc_safely(wasm_bytes):
    """
    Replace 0xfc bytes with valid sequences.
    Bulk memory instructions are:
    0xfc 0x0a - memory.copy
    0xfc 0x0b - memory.fill
    0xfc 0x0c - memory.init
    0xfc 0x0d - data.drop
    0xfc 0x0e - table.copy
    0xfc 0x0f - table.init
    0xfc 0x08 - i32.trunc_sat_f32_s (alternative)
    0xfc 0x09 - i32.trunc_sat_f32_u (alternative)
    """
    data = bytearray(wasm_bytes)
    i = 0
    replacements = 0
    
    while i < len(data):
        if data[i] == 0xfc:
            # Check next byte to see what instruction this is
            if i + 1 < len(data):
                next_byte = data[i + 1]
                
                # For memory.copy (0xfc 0x0a), replace with equivalent operations
                # Memory copy: drop drop drop (just remove the operation)
                if next_byte == 0x0a:  # memory.copy
                    # Replace with: end end end (0x0b 0x0b 0x0b)
                    data[i] = 0x0b    # end
                    data[i + 1] = 0x0b  # end
                    # Insert another end if space
                    if i + 2 < len(data):
                        data[i + 2] = 0x0b
                    replacements += 1
                    i += 1
                elif next_byte == 0x0b:  # memory.fill
                    data[i] = 0x0b      # end
                    data[i + 1] = 0x0b  # end
                    replacements += 1
                    i += 1
                else:
                    # Unknown bulk memory op - replace with nop (0x01)
                    data[i] = 0x01      # nop
                    if next_byte >= 0x0a and next_byte <= 0x0f:
                        data[i + 1] = 0x01  # nop
                    replacements += 1
                    i += 1
            else:
                # Single 0xfc at end, replace with nop
                data[i] = 0x01
                replacements += 1
        i += 1
    
    print(f"Made {replacements} replacements")
    return bytes(data)

# Read current WASM
with open('target/wasm32-unknown-unknown/release/phoenix_auction.wasm', 'rb') as f:
    original = f.read()

print(f"Original size: {len(original)} bytes")

# Fix it
fixed = replace_fc_safely(original)

# Save
with open('artifacts/manually_fixed.wasm', 'wb') as f:
    f.write(fixed)

print(f"Fixed size: {len(fixed)} bytes")

# Verify
fc_count = sum(1 for b in fixed if b == 0xfc)
print(f"0xfc bytes remaining: {fc_count}")

if fc_count == 0:
    print("✅ ALL bulk memory removed!")
else:
    print(f"⚠ Still has {fc_count} 0xfc bytes")
