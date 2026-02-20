use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized,

    #[error("Auction not found")]
    AuctionNotFound,

    #[error("Auction already ended")]
    AuctionEnded,

    #[error("Bid too low")]
    BidTooLow,

    #[error("Invalid collateral")]
    InvalidCollateral,

    #[error("Already confirmed")]
    AlreadyConfirmed,

    #[error("Blacklisted")]
    Blacklisted,

    #[error("KYC expired")]
    KycExpired,

    #[error("Insufficient KYC level")]
    InsufficientKycLevel,
}
