// Compile directly with rustc, no dependencies
#![no_std]
#![no_main]

#[no_mangle]
pub extern "C" fn instantiate() -> i32 { 0 }
#[no_mangle]
pub extern "C" fn execute() -> i32 { 0 }
#[no_mangle]
pub extern "C" fn query() -> i32 { 0 }

#[panic_handler]
fn panic(_: &core::panic::PanicInfo) -> ! { loop {} }
