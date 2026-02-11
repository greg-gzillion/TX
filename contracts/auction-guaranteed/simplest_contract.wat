(module
  ;; Minimal valid CosmWasm contract
  (memory 1)
  (export "memory" (memory 0))
  
  ;; CosmWasm required exports
  (func (export "instantiate") (param i32 i32 i32) (result i32)
    i32.const 0  ;; Always succeed
  )
  (func (export "execute") (param i32 i32 i32) (result i32)
    i32.const 0  ;; Always succeed
  )
  (func (export "query") (param i32 i32) (result i32)
    i32.const 0  ;; Always succeed
  )
  (func (export "allocate") (param i32) (result i32)
    i32.const 1024  ;; Fixed allocation address
  )
  (func (export "deallocate") (param i32)
    ;; Do nothing
    nop
  )
  (func (export "migrate") (param i32 i32) (result i32)
    i32.const 0  ;; Always succeed
  )
  (func (export "interface_version_8")
    ;; Required by CosmWasm
    nop
  )
  
  ;; Optional: simple function to test
  (func (export "test") (result i32)
    i32.const 42  ;; Return meaning of life
  )
  
  ;; Data section for string responses
  (data (i32.const 1024) "{\"result\":\"success\"}")
  
  ;; Heap base
  (global (mut i32) (i32.const 2048))
  (export "__heap_base" (global 0))
)
