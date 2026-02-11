// Minimal C contract compiled to WASM without bulk memory

// Required exports for CosmWasm
__attribute__((export_name("instantiate")))
int instantiate() { return 0; }

__attribute__((export_name("execute")))
int execute() { return 0; }

__attribute__((export_name("query")))
int query() { return 0; }

__attribute__((export_name("allocate")))
int allocate(int size) { return 0; }

__attribute__((export_name("deallocate")))
void deallocate(int ptr) { }

__attribute__((export_name("interface_version_8")))
void interface_version_8() { }

// Memory
__attribute__((export_name("__heap_base")))
unsigned char heap_base[1024];

__attribute__((export_name("memory")))
unsigned char memory[65536];
