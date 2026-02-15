use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug, PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized,

    #[error("Auction not found")]
    AuctionNotFound,

    #[error("Auction not active")]
    AuctionNotActive,

    #[error("Bid too low")]
    BidTooLow,

    #[error("Invalid amount format")]
    InvalidAmount,
    
    #[error("Insufficient funds")]
    InsufficientFunds,
}