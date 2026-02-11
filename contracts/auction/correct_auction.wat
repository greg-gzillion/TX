(module
  ;; Memory - 1 page (64KB)
  (memory $memory 1)
  (export "memory" (memory $memory))
  
  ;; ===== REQUIRED COSMWASM EXPORTS =====
  ;; These must match CosmWasm expectations
  
  ;; instantiate(env_ptr: i32, info_ptr: i32, msg_ptr: i32) -> i32
  (func $instantiate (export "instantiate")
    (param i32 i32 i32)  ;; env_ptr, info_ptr, msg_ptr
    (result i32)         ;; Result pointer
    ;; Always succeed - return 0
    i32.const 0
  )
  
  ;; execute(env_ptr: i32, info_ptr: i32, msg_ptr: i32) -> i32
  (func $execute (export "execute")
    (param i32 i32 i32)  ;; env_ptr, info_ptr, msg_ptr
    (result i32)         ;; Result pointer
    ;; Always succeed - return 0
    i32.const 0
  )
  
  ;; query(env_ptr: i32, msg_ptr: i32) -> i32
  (func $query (export "query")
    (param i32 i32)      ;; env_ptr, msg_ptr
    (result i32)         ;; Result pointer
    ;; Always return empty response
    i32.const 0
  )
  
  ;; allocate(size: i32) -> i32
  (func $allocate (export "allocate")
    (param i32)          ;; Size to allocate
    (result i32)         ;; Pointer to allocated memory
    ;; Simple allocator: just return a fixed address
    i32.const 1024
  )
  
  ;; deallocate(pointer: i32) -> void
  (func $deallocate (export "deallocate")
    (param i32)          ;; Pointer to deallocate
    ;; Do nothing - simple implementation
    nop
  )
  
  ;; Required by CosmWasm
  (func $interface_version_8 (export "interface_version_8"))
  
  ;; Optional but recommended
  (func $migrate (export "migrate")
    (param i32 i32)      ;; env_ptr, msg_ptr
    (result i32)         ;; Result pointer
    i32.const 0
  )
  
  ;; ===== ACTUAL AUCTION LOGIC =====
  ;; Simple storage in memory
  (global $highest_bid (mut i32) (i32.const 0))
  
  ;; Public function to place a bid
  (func $place_bid (export "place_bid")
    (param $amount i32)
    (result i32)  ;; 1 = success, 0 = fail
    (local $current i32)
    
    ;; Get current highest bid
    global.get $highest_bid
    local.set $current
    
    ;; Check if new bid is higher
    local.get $amount
    local.get $current
    i32.gt_u
    if
      ;; Update highest bid
      local.get $amount
      global.set $highest_bid
      i32.const 1  ;; Success
      return
    end
    
    i32.const 0  ;; Bid too low
  )
  
  ;; Public function to get highest bid
  (func $get_highest_bid (export "get_highest_bid")
    (result i32)
    global.get $highest_bid
  )
  
  ;; Test function: add two numbers
  (func $add (export "add")
    (param $a i32) (param $b i32)
    (result i32)
    local.get $a
    local.get $b
    i32.add
  )
  
  ;; ===== DATA SECTION =====
  ;; Store some initial data
  (data (i32.const 1024) "Phoenix Auction v1.0")
  (data (i32.const 1080) "{\"name\":\"Phoenix Auction\"}")
  
  ;; ===== INITIALIZATION =====
  ;; Optional start function
  (func $init
    ;; Initialize any global state
    i32.const 0
    global.set $highest_bid
  )
  
  ;; Set initialization function (runs on load)
  (start $init)
  
  ;; Heap base for memory allocation
  (global $heap_base (mut i32) (i32.const 2048))
  (export "__heap_base" (global $heap_base))
)
