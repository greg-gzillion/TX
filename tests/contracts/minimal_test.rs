// Compile with: rustc --target=wasm32-unknown-unknown -C opt-level=z -C panic=abort --crate-type=cdylib minimal_test.rs -o minimal.wasm
#![no_std]

#[no_mangle]
pub extern "C" fn instantiate() -> i32 { 0 }

#[no_mangle]
pub extern "C" fn execute() -> i32 { 0 }

#[no_mangle]
pub extern "C" fn query() -> i32 { 0 }

#[panic_handler]
fn panic(_info: &core::panic::PanicInfo) -> ! {
    loop {}
}
