use cosmwasm_std::{
    BankMsg, Coin, CosmosMsg, DepsMut, Env, MessageInfo, Response, StdResult,
};

use crate::msg::{AuctionStatus, Bid};
use crate::state::{AUCTIONS, BIDS, CONFIG};

pub fn execute_place_bid(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: String,
) -> StdResult<Response> {
    let mut auction = AUCTIONS.load(deps.storage, &auction_id)?;
    
    // Check auction status
    if auction.status != AuctionStatus::Active {
        return Err(cosmwasm_std::StdError::generic_err("Auction not active"));
    }
    
    // Check auction hasn't ended
    if env.block.time.seconds() > auction.end_time {
        auction.status = AuctionStatus::Ended;
        AUCTIONS.save(deps.storage, &auction_id, &auction)?;
        return Err(cosmwasm_std::StdError::generic_err("Auction has ended"));
    }
    
    let config = CONFIG.load(deps.storage)?;
    
    // Validate payment
    let payment = info
        .funds
        .iter()
        .find(|c| c.denom == config.token_denom)
        .ok_or_else(|| cosmwasm_std::StdError::generic_err("No payment in correct denom"))?;
    
    let bid_amount = payment.amount;
    
    // Check bid is higher than current highest bid
    if let Some(highest_bid) = auction.highest_bid {
        if bid_amount <= highest_bid {
            return Err(cosmwasm_std::StdError::generic_err("Bid must be higher than current highest bid"));
        }
        
        // Refund previous highest bidder
        if let Some(prev_bidder) = auction.highest_bidder {
            let _refund_msg = BankMsg::Send {
                to_address: prev_bidder.to_string(),
                amount: vec![Coin {
                    denom: config.token_denom.clone(),
                    amount: highest_bid,
                }],
            };
            // We'll add this message later
        }
    }
    
    // Check if bid meets reserve price
    if bid_amount < auction.reserve_price {
        return Err(cosmwasm_std::StdError::generic_err("Bid must meet reserve price"));
    }
    
    // Update auction with new bid
    auction.highest_bid = Some(bid_amount);
    auction.highest_bidder = Some(info.sender.clone());
    AUCTIONS.save(deps.storage, &auction_id, &auction)?;
    
    // Save bid record
    let bid = Bid {
        bidder: info.sender.clone(),
        amount: bid_amount,
        timestamp: env.block.time.seconds(),
    };
    BIDS.save(deps.storage, (&auction_id, info.sender.as_str()), &bid)?;
    
    // Prepare response
    let mut response = Response::new()
        .add_attribute("action", "place_bid")
        .add_attribute("auction_id", auction_id.clone())
        .add_attribute("bidder", info.sender.to_string())
        .add_attribute("bid_amount", bid_amount.to_string());
    
    // Refund previous bidder if exists
    if let (Some(prev_highest_bid), Some(prev_bidder)) = (auction.highest_bid, auction.highest_bidder) {
        if !prev_highest_bid.is_zero() && prev_bidder != info.sender {
            let refund_msg = BankMsg::Send {
                to_address: prev_bidder.to_string(),
                amount: vec![Coin {
                    denom: config.token_denom.clone(),
                    amount: prev_highest_bid,
                }],
            };
            response = response.add_message(CosmosMsg::Bank(refund_msg));
        }
    }
    
    Ok(response)
}
