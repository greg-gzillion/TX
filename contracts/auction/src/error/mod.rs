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

    #[error("Invalid amount")]
    InvalidAmount,
    
    #[error("Insufficient funds")]
    InsufficientFunds,
    
    #[error("Auction expired")]
    AuctionExpired,
    
    #[error("Invalid denom")]
    InvalidDenom,
    
    #[error("No funds sent")]
    NoFunds,
    
    #[error("Auction already closed")]
    AuctionAlreadyClosed,
    
    #[error("Auction not closed")]
    AuctionNotClosed,
    
    #[error("No winner")]
    NoWinner,
    
    #[error("Reserve not met")]
    ReserveNotMet,
    
    #[error("Invalid reserve price")]
    InvalidReservePrice,
    
    #[error("Invalid buy it now price")]
    InvalidBuyItNowPrice,
    
    #[error("Buy it now not available")]
    BuyItNowNotAvailable,
    
    #[error("Use buy it now")]
    UseBuyItNow,
    
    #[error("Insufficient collateral")]
    InsufficientCollateral,
    
    #[error("No collateral sent")]
    NoCollateralSent,
}