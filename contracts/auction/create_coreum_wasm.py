#!/usr/bin/env python3
"""
Create a minimal WASM that should work on Coreum.
Based on cw721 characteristics and Coreum's WASM validation.
"""
import struct

wasm = bytearray()

# === 1. WASM Header ===
wasm.extend(b'\x00asm')      # Magic
wasm.extend(b'\x01\x00\x00\x00')  # Version 1

# === 2. Type Section: Function signatures ===
# We'll have 3 functions: instantiate, execute, query
# All with signature: () -> ()
wasm.append(0x01)  # Type section id
wasm.append(0x06)  # Section size: 6 bytes
wasm.append(0x02)  # 2 types (we'll reuse types)
# Type 0: () -> () for simple functions
wasm.append(0x60)  # func type
wasm.append(0x00)  # 0 params
wasm.append(0x00)  # 0 results
# Type 1: (i32, i32) -> i32 for alloc/dealloc
wasm.append(0x60)  # func type
wasm.append(0x02)  # 2 params
wasm.append(0x7f)  # i32
wasm.append(0x7f)  # i32
wasm.append(0x01)  # 1 result
wasm.append(0x7f)  # i32

# === 3. Import Section: Import memory ===
# CosmWasm expects imported memory
wasm.append(0x02)  # Import section id
import_start = len(wasm)
wasm.append(0x00)  # Placeholder for size
wasm.append(0x01)  # 1 import
# Import memory from "env"
wasm.extend(b'\x03env')  # Module name: "env" (3 bytes)
wasm.extend(b'\x06memory')  # Name: "memory" (6 bytes)
wasm.append(0x02)  # Import kind: memory
wasm.append(0x00)  # No max, only min
wasm.append(0x01)  # Min size: 1 page (64KB)
# Update import section size
import_size = len(wasm) - import_start - 1
wasm[import_start] = import_size

# === 4. Function Section: Define 5 functions ===
wasm.append(0x03)  # Function section id
wasm.append(0x06)  # Section size: 6 bytes
wasm.append(0x05)  # 5 functions
wasm.append(0x00)  # Function 0: type 0 (instantiate)
wasm.append(0x00)  # Function 1: type 0 (execute)
wasm.append(0x00)  # Function 2: type 0 (query)
wasm.append(0x01)  # Function 3: type 1 (allocate)
wasm.append(0x01)  # Function 4: type 1 (deallocate)

# === 5. Export Section ===
wasm.append(0x07)  # Export section id
export_start = len(wasm)
wasm.append(0x00)  # Placeholder for size

export_count = 0

# Export functions (CosmWasm expects these)
exports = [
    ("instantiate", 0),
    ("execute", 1),
    ("query", 2),
    ("allocate", 3),
    ("deallocate", 4),
    ("interface_version_8", 0),  # Required by CosmWasm
]

for name, idx in exports:
    name_bytes = name.encode()
    wasm.append(len(name_bytes))  # Name length
    wasm.extend(name_bytes)       # Name
    wasm.append(0x00)             # Export kind: function
    wasm.append(idx)              # Function index
    export_count += 1

# Update export section size
export_size = len(wasm) - export_start - 1
wasm[export_start] = export_size

# === 6. Code Section ===
wasm.append(0x0a)  # Code section id
code_start = len(wasm)
wasm.append(0x00)  # Placeholder for size

# All functions are simple: return 0 (success)
for i in range(5):
    # Function size: 4 bytes
    wasm.append(0x04)  # Function size
    wasm.append(0x00)  # Local count: 0
    wasm.append(0x41)  # i32.const
    wasm.append(0x00)  # value 0
    wasm.append(0x0f)  # return

# Update code section size
code_size = len(wasm) - code_start - 1
wasm[code_start] = code_size

# Write the WASM
with open('artifacts/coreum_compatible.wasm', 'wb') as f:
    f.write(wasm)

print(f"Created coreum_compatible.wasm ({len(wasm)} bytes)")
print("Exports: instantiate, execute, query, allocate, deallocate, interface_version_8")
print("This should pass Coreum's WASM validation!")
