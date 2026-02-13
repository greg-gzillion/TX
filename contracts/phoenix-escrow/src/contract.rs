use cosmwasm_std::{
    entry_point, Binary, Deps, DepsMut, Env, MessageInfo, 
    Response, StdResult, Uint128, Addr, to_json_binary, BankMsg, coins
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{
    ExecuteMsg, InstantiateMsg, QueryMsg, ConfigResponse, 
    AuctionResponse
};
use crate::state::{
    Config, Auction, Bid, AuctionStatus, 
    CONFIG, AUCTIONS, AUCTION_COUNT, COMPLETED_AUCTIONS, KYC_VERIFIED
};

const CONTRACT_NAME: &str = "crates.io:phoenix-escrow";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[entry_point]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    let admin = deps.api.addr_validate(&msg.admin)?;
    let fee_address = deps.api.addr_validate(&msg.fee_address)?;
    
    let config = Config {
        admin: admin.clone(),
        fee_percentage: msg.fee_percentage,
        fee_address,
        require_kyc: msg.require_kyc.unwrap_or(false),
    };
    
    CONFIG.save(deps.storage, &config)?;
    AUCTION_COUNT.save(deps.storage, &0u64)?;

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("admin", admin))
}

#[entry_point]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreateAuction {
            item_id,
            starting_price,
            reserve_price,
            buy_now_price,
            duration_hours,
        } => execute_create_auction(
            deps, env, info, 
            item_id, starting_price, reserve_price, buy_now_price, 
            duration_hours,
        ),
        ExecuteMsg::PlaceBid { auction_id } => {
            // Check KYC if required
            let config = CONFIG.load(deps.storage)?;
            if config.require_kyc {
                let is_verified = KYC_VERIFIED.may_load(deps.storage, &info.sender)?
                    .unwrap_or(false);
                if !is_verified {
                    return Err(ContractError::KycRequired {});
                }
            }
            execute_place_bid(deps, env, info, auction_id)
        },
        ExecuteMsg::BuyNow { auction_id } => execute_buy_now(deps, env, info, auction_id),
        ExecuteMsg::EndAuction { auction_id } => execute_end_auction(deps, env, info, auction_id),
        ExecuteMsg::CancelAuction { auction_id } => execute_cancel_auction(deps, env, info, auction_id),
        ExecuteMsg::ReleaseFunds { auction_id } => execute_release_funds(deps, env, info, auction_id),
        
        // KYC functions
        ExecuteMsg::VerifyUser { address } => {
            let addr = deps.api.addr_validate(&address)?;
            execute_verify_user(deps, info, addr)
        },
        ExecuteMsg::RevokeVerification { address } => {
            let addr = deps.api.addr_validate(&address)?;
            execute_revoke_verification(deps, info, addr)
        },
    }
}

// ============================================================
// BID FUNCTIONS
// ============================================================

fn execute_place_bid(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    // Load the auction
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Validate auction is active
    if auction.status != AuctionStatus::Active {
        return Err(ContractError::AuctionNotActive {});
    }
    
    // Check if auction has ended
    if env.block.time.seconds() > auction.ends_at {
        auction.status = AuctionStatus::Ended;
        AUCTIONS.save(deps.storage, auction_id, &auction)?;
        return Err(ContractError::AuctionEnded {});
    }
    
    // Validate funds were sent
    if info.funds.is_empty() {
        return Err(ContractError::NoFunds {});
    }
    
    let bid_amount = info.funds[0].amount;
    
    // Check minimum bid
    if bid_amount < auction.starting_price {
        return Err(ContractError::BidTooLow {});
    }
    
    // Check if higher than current highest bid
    if let Some(highest_bid) = &auction.highest_bid {
        if bid_amount <= highest_bid.amount {
            return Err(ContractError::BidTooLow {});
        }
    }
    
    // Create bid record
    let bid = Bid {
        bidder: info.sender.clone(),
        amount: bid_amount,
        timestamp: env.block.time.seconds(),
    };
    
    // Add to bids list
    auction.bids.push(bid.clone());
    auction.highest_bid = Some(bid);
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("action", "place_bid")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("bidder", info.sender.to_string())
        .add_attribute("amount", bid_amount.to_string()))
}

// ============================================================
// BUY NOW FUNCTIONS
// ============================================================

fn execute_buy_now(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Validate auction is active
    if auction.status != AuctionStatus::Active {
        return Err(ContractError::AuctionNotActive {});
    }
    
    // Check if auction has ended
    if env.block.time.seconds() > auction.ends_at {
        auction.status = AuctionStatus::Ended;
        AUCTIONS.save(deps.storage, auction_id, &auction)?;
        return Err(ContractError::AuctionEnded {});
    }
    
    // Check if buy now price exists
    let buy_now_price = auction.buy_now_price
        .ok_or(ContractError::NoBuyNowPrice {})?;
    
    // Validate funds
    if info.funds.is_empty() || info.funds[0].amount < buy_now_price {
        return Err(ContractError::InsufficientFunds {});
    }
    
    // Create bid record
    let bid = Bid {
        bidder: info.sender.clone(),
        amount: buy_now_price,
        timestamp: env.block.time.seconds(),
    };
    
    // Complete the auction
    auction.bids.push(bid.clone());
    auction.highest_bid = Some(bid);
    auction.status = AuctionStatus::Sold;
    
    // Save to auctions
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    // Also save to completed auctions
    COMPLETED_AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("action", "buy_now")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("buyer", info.sender.to_string())
        .add_attribute("amount", buy_now_price.to_string()))
}

// ============================================================
// END AUCTION FUNCTIONS
// ============================================================

fn execute_end_auction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Check if auction has ended
    if env.block.time.seconds() <= auction.ends_at {
        return Err(ContractError::AuctionNotActive {});
    }
    
    // Can only end active auctions
    if auction.status != AuctionStatus::Active {
        return Err(ContractError::AuctionEnded {});
    }
    
    // Mark as ended
    auction.status = AuctionStatus::Ended;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("action", "end_auction")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("ended_by", info.sender.to_string()))
}

// ============================================================
// CANCEL AUCTION FUNCTIONS
// ============================================================

fn execute_cancel_auction(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Only creator can cancel
    if info.sender != auction.creator {
        return Err(ContractError::NotCreator {});
    }
    
    // Can only cancel active auctions
    if auction.status != AuctionStatus::Active {
        return Err(ContractError::AuctionNotActive {});
    }
    
    // Can't cancel if there are bids
    if !auction.bids.is_empty() {
        return Err(ContractError::AuctionHasBids {});
    }
    
    // Cancel the auction
    auction.status = AuctionStatus::Cancelled;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    Ok(Response::new()
        .add_attribute("action", "cancel_auction")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("cancelled_by", info.sender.to_string()))
}

// ============================================================
// RELEASE FUNDS FUNCTIONS
// ============================================================

fn execute_release_funds(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response, ContractError> {
    let auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Only creator can release funds
    if info.sender != auction.creator {
        return Err(ContractError::NotCreator {});
    }
    
    // Auction must be sold
    if auction.status != AuctionStatus::Sold {
        return Err(ContractError::AuctionNotActive {});
    }
    
    // Get highest bid
    let highest_bid = auction.highest_bid
        .ok_or(ContractError::NoFundsToRelease {})?;
    
    let amount = highest_bid.amount;
    
    Ok(Response::new()
        .add_attribute("action", "release_funds")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("amount", amount.to_string())
        .add_message(BankMsg::Send {
            to_address: auction.creator.to_string(),
            amount: coins(amount.u128(), "utestcore"),
        }))
}

// KYC functions
fn execute_verify_user(
    deps: DepsMut,
    info: MessageInfo,
    address: Addr,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    if info.sender != config.admin {
        return Err(ContractError::Unauthorized {});
    }
    
    KYC_VERIFIED.save(deps.storage, &address, &true)?;
    
    Ok(Response::new()
        .add_attribute("action", "verify_user")
        .add_attribute("address", address)
        .add_attribute("verified_by", info.sender))
}

fn execute_revoke_verification(
    deps: DepsMut,
    info: MessageInfo,
    address: Addr,
) -> Result<Response, ContractError> {
    let config = CONFIG.load(deps.storage)?;
    if info.sender != config.admin {
        return Err(ContractError::Unauthorized {});
    }
    
    KYC_VERIFIED.remove(deps.storage, &address);
    
    Ok(Response::new()
        .add_attribute("action", "revoke_verification")
        .add_attribute("address", address)
        .add_attribute("revoked_by", info.sender))
}

// Existing auction functions (simplified)
fn execute_create_auction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    item_id: String,
    starting_price: Uint128,
    reserve_price: Option<Uint128>,
    buy_now_price: Option<Uint128>,
    duration_hours: u64,
) -> Result<Response, ContractError> {
    // Check KYC if required
    let config = CONFIG.load(deps.storage)?;
    if config.require_kyc {
        let is_verified = KYC_VERIFIED.may_load(deps.storage, &info.sender)?
            .unwrap_or(false);
        if !is_verified {
            return Err(ContractError::KycRequired {});
        }
    }
    
    let ends_at = env.block.time.seconds() + duration_hours * 3600;
    
    let auction = Auction {
        creator: info.sender.clone(),
        item_id,
        starting_price,
        reserve_price,
        buy_now_price,
        ends_at,
        bids: vec![],
        highest_bid: None,
        status: AuctionStatus::Active,
        created_at: env.block.time.seconds(),
    };
    
    let auction_id = AUCTION_COUNT.load(deps.storage)?;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    AUCTION_COUNT.save(deps.storage, &(auction_id + 1))?;
    
    Ok(Response::new()
        .add_attribute("action", "create_auction")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("creator", info.sender))
}

// ... (other auction functions would go here, simplified for now)

#[entry_point]
pub fn query(
    deps: Deps,
    _env: Env,
    msg: QueryMsg,
) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => {
            let config = CONFIG.load(deps.storage)?;
            let resp = ConfigResponse {
                admin: config.admin,
                fee_percentage: config.fee_percentage,
                fee_address: config.fee_address,
                require_kyc: config.require_kyc,
            };
            to_json_binary(&resp)
        }
        QueryMsg::Auction { id } => {
            let auction = AUCTIONS.load(deps.storage, id)?;
            let resp = AuctionResponse {
                id,
                auction,
            };
            to_json_binary(&resp)
        }
        QueryMsg::IsVerified { address } => {
            let addr = deps.api.addr_validate(&address)?;
            let is_verified = KYC_VERIFIED.may_load(deps.storage, &addr)?
                .unwrap_or(false);
            to_json_binary(&is_verified)
        }
        // ... (other queries)
        _ => unimplemented!(),
    }
}

