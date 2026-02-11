(module
  ;; ===== MEMORY =====
  ;; Only set minimum, NOT maximum (Coreum requirement)
  (memory (export "memory") 1)
  
  ;; ===== REQUIRED COSMWASM EXPORTS =====
  (func (export "instantiate") 
    (param i32 i32 i32) 
    (result i32)
    i32.const 0  ;; Success
  )
  
  (func (export "execute") 
    (param i32 i32 i32) 
    (result i32)
    i32.const 0  ;; Success
  )
  
  (func (export "query") 
    (param i32 i32) 
    (result i32)
    i32.const 1024  ;; Pointer to response
  )
  
  (func (export "allocate") 
    (param i32) 
    (result i32)
    i32.const 2048  ;; Simple allocation
  )
  
  (func (export "deallocate") 
    (param i32)
    nop
  )
  
  (func (export "interface_version_8"))
  
  (func (export "migrate") 
    (param i32 i32) 
    (result i32)
    i32.const 0
  )
  
  ;; ===== AUCTION FUNCTIONS =====
  (func (export "place_bid") 
    (result i32)
    i32.const 1  ;; Success
  )
  
  (func (export "get_highest_bid") 
    (result i32)
    i32.const 1080  ;; Pointer to bid response
  )
  
  (func (export "add") 
    (param i32 i32) 
    (result i32)
    local.get 0
    local.get 1
    i32.add
  )
  
  ;; ===== DATA SECTION =====
  ;; Query response
  (data (i32.const 1024) "{\"result\":\"success\"}")
  
  ;; Bid response
  (data (i32.const 1080) "{\"amount\":\"0\",\"bidder\":\"none\"}")
  
  ;; Add response
  (data (i32.const 1120) "{\"sum\":\"\"}")  ;; Will be filled
  
  ;; ===== MEMORY MARKERS =====
  (global $heap_base i32 (i32.const 4096))
  (export "__heap_base" (global $heap_base))
)
