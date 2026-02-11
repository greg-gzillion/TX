(module
  ;; Memory
  (memory 1)
  (export "memory" (memory 0))
  
  ;; Required CosmWasm exports
  (func $instantiate (export "instantiate") 
    (result i32)
    i32.const 0)
  
  (func $execute (export "execute") 
    (result i32)
    i32.const 0)
  
  (func $query (export "query") 
    (result i32)
    i32.const 0)
  
  (func $allocate (export "allocate") 
    (param i32) 
    (result i32)
    i32.const 0)
  
  (func $deallocate (export "deallocate") 
    (param i32))
  
  ;; Required interface_version exports
  (func $interface_version_8 (export "interface_version_8"))
  
  ;; Entry points for migration (optional but good to have)
  (func $migrate (export "migrate") 
    (result i32)
    i32.const 0)
)
