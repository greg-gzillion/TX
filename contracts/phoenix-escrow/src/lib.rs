// Make all modules public
pub mod contract;
pub mod error;
pub mod helpers;
pub mod msg;
pub mod state;

// Re-export commonly used items for easier imports
pub use crate::contract::{execute, instantiate, query};
pub use crate::error::ContractError;
pub use crate::msg::{
    ExecuteMsg, InstantiateMsg, QueryMsg,
    AuctionResponse, ConfigResponse,
};
pub use crate::state::{Auction, AuctionStatus};
