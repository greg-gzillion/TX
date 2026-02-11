#!/usr/bin/env python3
# Create minimal valid WASM
import struct

# WASM binary format
wasm = bytearray()

# Magic and version
wasm.extend(b'\\x00asm')  # Magic
wasm.extend(b'\\x01\\x00\\x00\\x00')  # Version 1

# Type section (1 function type: [] -> [])
wasm.append(0x01)  # Type section id
wasm.append(0x04)  # Section size: 4 bytes
wasm.append(0x01)  # 1 type
wasm.append(0x60)  # func type
wasm.append(0x00)  # 0 params
wasm.append(0x00)  # 0 results

# Function section (1 function, type 0)
wasm.append(0x03)  # Function section id
wasm.append(0x02)  # Section size: 2 bytes
wasm.append(0x01)  # 1 function
wasm.append(0x00)  # Type index 0

# Export section (export memory if needed)
wasm.append(0x07)  # Export section id
wasm.append(0x07)  # Section size: 7 bytes
wasm.append(0x01)  # 1 export
wasm.extend(b'\\x04memory')  # Export name "memory" (4 bytes + string)
wasm.append(0x02)  # Export kind: memory
wasm.append(0x00)  # Memory index 0

# Code section
wasm.append(0x0a)  # Code section id
wasm.append(0x04)  # Section size: 4 bytes
wasm.append(0x01)  # 1 function
wasm.append(0x02)  # Function size: 2 bytes
wasm.append(0x00)  # Local count: 0
wasm.append(0x0b)  # end

with open('artifacts/minimal.wasm', 'wb') as f:
    f.write(wasm)

print(f"Created minimal.wasm ({len(wasm)} bytes)")
