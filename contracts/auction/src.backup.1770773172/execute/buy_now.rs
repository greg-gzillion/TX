use cosmwasm_std::{
    DepsMut, Env, MessageInfo, Response, StdError, 
    BankMsg, Coin, Uint128
};

use crate::msg::{AuctionStatus, PLATFORM_FEE_PERCENT, FEE_DENOMINATOR};
use crate::state::{AUCTIONS, CONFIG};

pub fn execute_buy_it_now(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    auction_id: String,
) -> Result<Response, StdError> {
    let config = CONFIG.load(deps.storage)?;
    let mut auction = AUCTIONS.load(deps.storage, &auction_id)?;
    
    // Check auction is active
    if auction.status != AuctionStatus::Active {
        return Err(StdError::generic_err("Auction not active"));
    }
    
    // Check if Buy It Now is available
    let buy_now_price = match auction.buy_it_now_price {
        Some(price) => price,
        None => return Err(StdError::generic_err("Buy It Now not available for this auction")),
    };
    
    // Check payment is correct
    let payment = info
        .funds
        .iter()
        .find(|c| c.denom == config.token_denom)
        .ok_or_else(|| StdError::generic_err("No TESTUSD sent"))?;
    
    if payment.amount < buy_now_price {
        return Err(StdError::generic_err(format!(
            "Insufficient payment. Need {} TESTUSD, sent {}",
            buy_now_price, payment.amount
        )));
    }
    
    // Calculate 1.1% fee
    let fee_amount = buy_now_price.multiply_ratio(PLATFORM_FEE_PERCENT, FEE_DENOMINATOR);
    let seller_amount = buy_now_price.checked_sub(fee_amount)
        .map_err(|_| StdError::generic_err("Fee calculation error"))?;
    
    // Update auction status
    auction.status = AuctionStatus::Sold;
    auction.highest_bid = Some(buy_now_price);
    auction.highest_bidder = Some(info.sender.clone());
    AUCTIONS.save(deps.storage, &auction_id, &auction)?;
    
    // Send funds: 98.9% to seller, 1.1% to insurance pool
    let messages = vec![
        BankMsg::Send {
            to_address: auction.seller.to_string(),
            amount: vec![Coin {
                denom: config.token_denom.clone(),
                amount: seller_amount,
            }],
        },
        BankMsg::Send {
            to_address: config.insurance_pool.to_string(),
            amount: vec![Coin {
                denom: config.token_denom.clone(),
                amount: fee_amount,
            }],
        },
    ];
    
    // Return any overpayment (CORRECT: unwrap_or takes value, unwrap_or_else takes closure)
    let refund = payment.amount.checked_sub(buy_now_price).unwrap_or(Uint128::zero());
    
    let mut response = Response::new()
        .add_messages(messages)
        .add_attribute("action", "buy_it_now")
        .add_attribute("auction_id", auction_id.clone())
        .add_attribute("buyer", info.sender.to_string())
        .add_attribute("price", buy_now_price.to_string())
        .add_attribute("fee", fee_amount.to_string())
        .add_attribute("seller_amount", seller_amount.to_string());
    
    if !refund.is_zero() {
        response = response.add_message(BankMsg::Send {
            to_address: info.sender.to_string(),
            amount: vec![Coin {
                denom: config.token_denom,
                amount: refund,
            }],
        });
    }
    
    Ok(response)
}
