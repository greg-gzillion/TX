(module
  ;; ===== MEMORY =====
  (memory (export "memory") 1 1)
  
  ;; ===== REQUIRED COSMWASM EXPORTS =====
  ;; instantiate(env_ptr: i32, info_ptr: i32, msg_ptr: i32) -> i32
  (func (export "instantiate") 
    (param $env i32) 
    (param $info i32) 
    (param $msg i32) 
    (result i32)
    ;; Always succeed - return 0 (null pointer in CosmWasm means success)
    i32.const 0
  )
  
  ;; execute(env_ptr: i32, info_ptr: i32, msg_ptr: i32) -> i32
  (func (export "execute") 
    (param $env i32) 
    (param $info i32) 
    (param $msg i32) 
    (result i32)
    i32.const 0  ;; Success
  )
  
  ;; query(env_ptr: i32, msg_ptr: i32) -> i32
  (func (export "query") 
    (param $env i32) 
    (param $msg i32) 
    (result i32)
    ;; Return pointer to JSON response: {"result": "success"}
    i32.const 1024
  )
  
  ;; allocate(size: i32) -> i32
  (func (export "allocate") 
    (param $size i32) 
    (result i32)
    ;; Simple allocator: return fixed address
    i32.const 2048
  )
  
  ;; deallocate(ptr: i32) -> void
  (func (export "deallocate") 
    (param $ptr i32)
    ;; No-op for simple contract
    nop
  )
  
  ;; Required interface version
  (func (export "interface_version_8"))
  
  ;; Optional migrate function
  (func (export "migrate") 
    (param i32 i32) 
    (result i32)
    i32.const 0
  )
  
  ;; ===== AUCTION FUNCTIONS =====
  ;; place_bid() -> i32 (returns 1 for success)
  (func (export "place_bid") 
    (result i32)
    i32.const 1
  )
  
  ;; get_highest_bid() -> i32 (returns pointer to JSON)
  (func (export "get_highest_bid") 
    (result i32)
    ;; Return pointer to: {"amount": "0", "bidder": "none"}
    i32.const 1080
  )
  
  ;; add(a: i32, b: i32) -> i32
  (func (export "add") 
    (param $a i32) 
    (param $b i32) 
    (result i32)
    local.get $a
    local.get $b
    i32.add
  )
  
  ;; ===== DATA SECTION (JSON responses) =====
  ;; Query response
  (data (i32.const 1024) "{\"result\":\"success\"}")
  
  ;; Bid response
  (data (i32.const 1080) "{\"amount\":\"0\",\"bidder\":\"none\"}")
  
  ;; Add response template
  (data (i32.const 1120) "{\"result\":\"")  ;; Will be filled with number
  
  ;; ===== MEMORY CONFIGURATION =====
  ;; Heap base for dynamic allocation
  (global $heap_base (mut i32) (i32.const 4096))
  (export "__heap_base" (global $heap_base))
  
  ;; Data end marker
  (global $data_end i32 (i32.const 1200))
  (export "__data_end" (global $data_end))
)
