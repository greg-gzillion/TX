pub mod contract;
pub mod msg;
pub mod state;
pub mod error;

// Re-export key types for easier access
pub use crate::error::ContractError;
pub use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
#[cfg(test)]
mod tests;
