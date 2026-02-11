use cosmwasm_std::{
    BankMsg, Coin, CosmosMsg, DepsMut, Env, MessageInfo, Response, StdResult,
};

use crate::msg::AuctionStatus;
use crate::state::{AUCTIONS, CONFIG};

pub fn execute_settle_auction(
    deps: DepsMut,
    env: Env,
    _info: MessageInfo,  // Added underscore to suppress warning
    auction_id: String,
) -> StdResult<Response> {
    let mut auction = AUCTIONS.load(deps.storage, &auction_id)?;
    
    // Check if auction is already settled or sold
    if auction.status == AuctionStatus::Settled || auction.status == AuctionStatus::Sold {
        return Err(cosmwasm_std::StdError::generic_err("Auction already settled or sold"));
    }
    
    // Check if auction is still active and not expired
    if auction.status == AuctionStatus::Active && env.block.time.seconds() <= auction.end_time {
        return Err(cosmwasm_std::StdError::generic_err("Auction still active"));
    }
    
    let config = CONFIG.load(deps.storage)?;
    
    // Mark as settled
    auction.status = AuctionStatus::Settled;
    AUCTIONS.save(deps.storage, &auction_id, &auction)?;
    
    let mut response = Response::new()
        .add_attribute("action", "settle_auction")
        .add_attribute("auction_id", auction_id)
        .add_attribute("seller", auction.seller.to_string());
    
    // If there was a highest bid, distribute funds
    if let (Some(highest_bid), Some(highest_bidder)) = (auction.highest_bid, auction.highest_bidder) {
        // Calculate fees (1.1%)
        let fee_amount = highest_bid.multiply_ratio(11u64, 1000u64); // 1.1% = 11/1000
        
        // Calculate seller amount (highest_bid - fee)
        let seller_amount = highest_bid.checked_sub(fee_amount)?;
        
        // Send fee to insurance pool
        if !fee_amount.is_zero() {
            let fee_msg = BankMsg::Send {
                to_address: config.insurance_pool.clone(),
                amount: vec![Coin {
                    denom: config.token_denom.clone(),
                    amount: fee_amount,
                }],
            };
            response = response.add_message(CosmosMsg::Bank(fee_msg));
        }
        
        // Send remaining to seller
        if !seller_amount.is_zero() {
            let seller_msg = BankMsg::Send {
                to_address: auction.seller.to_string(),
                amount: vec![Coin {
                    denom: config.token_denom.clone(),
                    amount: seller_amount,
                }],
            };
            response = response.add_message(CosmosMsg::Bank(seller_msg));
        }
        
        response = response
            .add_attribute("winner", highest_bidder.to_string())
            .add_attribute("final_price", highest_bid.to_string())
            .add_attribute("fee_amount", fee_amount.to_string())
            .add_attribute("seller_amount", seller_amount.to_string());
    }
    
    Ok(response)
}
