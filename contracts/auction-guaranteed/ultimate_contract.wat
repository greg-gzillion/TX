(module
  (memory 1)
  (export "memory" (memory 0))
  
  (func $instantiate (export "instantiate") 
    (param i32 i32 i32) 
    (result i32)
    i32.const 0)
  
  (func $execute (export "execute") 
    (param i32 i32 i32) 
    (result i32)
    i32.const 0)
  
  (func $query (export "query") 
    (param i32 i32) 
    (result i32)
    i32.const 0)
  
  (func $allocate (export "allocate") 
    (param i32) 
    (result i32)
    i32.const 1024)
  
  (func $deallocate (export "deallocate") 
    (param i32)
    nop)
  
  (func $interface_version_8 (export "interface_version_8"))
  
  ;; Phoenix Auction functions
  (func $place_bid (export "place_bid")
    (result i32)
    i32.const 1)  ;; Success
  
  (func $get_highest_bid (export "get_highest_bid")
    (result i32)
    i32.const 0)  ;; Returns 0
  
  (func $add (export "add")
    (param i32 i32)
    (result i32)
    local.get 0
    local.get 1
    i32.add)
  
  (data (i32.const 1024) "Phoenix Auction")
)
