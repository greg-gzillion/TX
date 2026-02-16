# Security Patterns & Best Practices

**Document Status:** Living Document  
**Last Updated:** February 15, 2026  
**Owner:** Greg (@greg-gzillion)  
**Review Cycle:** Monthly

## Executive Summary

This document outlines the security patterns, best practices, and defensive programming techniques used throughout PhoenixPME's smart contracts. Following these patterns reduces the risk of common vulnerabilities like reentrancy, overflow, and access control bypasses.

**Target Audience:** Developers, auditors, security researchers

---

## Table of Contents

1. [Reentrancy Protection](#reentrancy-protection)
2. [Checks-Effects-Interactions](#checks-effects-interactions)
3. [Access Control](#access-control)
4. [Input Validation](#input-validation)
5. [Safe Math](#safe-math)
6. [Emergency Controls](#emergency-controls)
7. [Upgrade Patterns](#upgrade-patterns)

---

## Reentrancy Protection

### What Is Reentrancy?

A reentrancy attack occurs when an external contract calls back into your contract before the first invocation is complete, potentially:
- Withdrawing funds multiple times
- Bypassing state checks
- Breaking invariants

**Famous Example:** The DAO hack ($60M stolen)

### Our Protection Strategy

#### 1. State Updates Before External Calls

```rust
// ❌ VULNERABLE - State updated after external call
pub fn withdraw(deps: DepsMut, info: MessageInfo, amount: Uint128) -> Result<Response> {
    // External call FIRST (dangerous!)
    send_tokens(info.sender.clone(), amount)?;
    
    // State update AFTER (too late!)
    USER_BALANCES.update(deps.storage, &info.sender, |bal| {
        Ok(bal - amount)
    })?;
    
    Ok(Response::new())
}

// ✅ SAFE - State updated before external call
pub fn withdraw(deps: DepsMut, info: MessageInfo, amount: Uint128) -> Result<Response> {
    // State update FIRST
    USER_BALANCES.update(deps.storage, &info.sender, |bal| {
        bal.checked_sub(amount).ok_or(ContractError::InsufficientFunds)
    })?;
    
    // External call AFTER (safe - state already updated)
    let msg = BankMsg::Send {
        to_address: info.sender.to_string(),
        amount: vec![Coin { denom: "utestusd".to_string(), amount }],
    };
    
    Ok(Response::new().add_message(msg))
}
```

**Why This Works:** Even if the external call reenters, the balance is already reduced, preventing double-withdrawal.

#### 2. Reentrancy Guards (When Needed)

For complex functions with multiple external calls:

```rust
// Reentrancy guard state
const LOCKED: Item<bool> = Item::new("locked");

fn nonReentrant<F>(deps: DepsMut, f: F) -> Result<Response>
where
    F: FnOnce(DepsMut) -> Result<Response>,
{
    // Check if already locked
    let is_locked = LOCKED.may_load(deps.storage)?.unwrap_or(false);
    if is_locked {
        return Err(ContractError::ReentrantCall);
    }
    
    // Lock
    LOCKED.save(deps.storage, &true)?;
    
    // Execute function
    let result = f(deps);
    
    // Unlock
    LOCKED.save(deps.storage, &false)?;
    
    result
}

// Usage
pub fn complex_withdraw(deps: DepsMut, info: MessageInfo) -> Result<Response> {
    nonReentrant(deps, |deps| {
        // Multiple external calls here
        // Protected from reentrancy
        Ok(Response::new())
    })
}
```

#### 3. CosmWasm's Built-in Protection

**Good news:** CosmWasm is safer than Solidity by default:
- No fallback functions (reentrancy is harder)
- Messages execute atomically
- Cross-contract calls don't share state

**Still need protection for:**
- Callbacks from external contracts
- Multi-step transactions
- Complex state transitions

---

## Checks-Effects-Interactions

### The Pattern

All functions should follow this order:

1. **Checks:** Validate inputs and permissions
2. **Effects:** Update state
3. **Interactions:** Call external contracts

### Example: Auction Settlement

```rust
pub fn settle_auction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response> {
    // ========== CHECKS ==========
    
    // Check auction exists
    let mut auction = AUCTIONS.load(deps.storage, auction_id)?;
    
    // Check auction has ended
    if env.block.time < auction.end_time {
        return Err(ContractError::AuctionStillActive);
    }
    
    // Check auction not already settled
    if auction.settled {
        return Err(ContractError::AlreadySettled);
    }
    
    // Check caller is authorized (oracle or admin)
    if !is_authorized(&info.sender) {
        return Err(ContractError::Unauthorized);
    }
    
    // Check high bidder exists
    let high_bidder = auction.high_bidder
        .ok_or(ContractError::NoBids)?;
    
    // ========== EFFECTS ==========
    
    // Mark auction as settled
    auction.settled = true;
    AUCTIONS.save(deps.storage, auction_id, &auction)?;
    
    // Calculate fees (1.1%)
    let fee = auction.high_bid.multiply_ratio(11u128, 1000u128);
    let seller_amount = auction.high_bid.checked_sub(fee)?;
    
    // Update insurance pool
    let mut pool = INSURANCE_POOL.load(deps.storage)?;
    pool.balance = pool.balance.checked_add(fee)?;
    INSURANCE_POOL.save(deps.storage, &pool)?;
    
    // ========== INTERACTIONS ==========
    
    // Send funds to seller
    let seller_msg = BankMsg::Send {
        to_address: auction.seller.to_string(),
        amount: vec![Coin {
            denom: "utestusd".to_string(),
            amount: seller_amount,
        }],
    };
    
    // Send fee to insurance pool
    let fee_msg = BankMsg::Send {
        to_address: pool.address.to_string(),
        amount: vec![Coin {
            denom: "utestusd".to_string(),
            amount: fee,
        }],
    };
    
    Ok(Response::new()
        .add_message(seller_msg)
        .add_message(fee_msg)
        .add_attribute("action", "settle_auction")
        .add_attribute("auction_id", auction_id.to_string())
        .add_attribute("seller_amount", seller_amount.to_string())
        .add_attribute("fee", fee.to_string()))
}
```

**Why This Matters:**
- All state updates happen before external calls
- If external call fails, state is still consistent
- Impossible to exploit race conditions

---

## Access Control

### Role-Based Access Control (RBAC)

```rust
// Define roles
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub enum Role {
    Admin,
    Oracle,
    Pauser,
}

// Store roles
const ROLES: Map<&Addr, Vec<Role>> = Map::new("roles");

// Check if address has role
pub fn has_role(storage: &dyn Storage, addr: &Addr, role: Role) -> bool {
    ROLES
        .may_load(storage, addr)
        .unwrap_or(None)
        .map(|roles| roles.contains(&role))
        .unwrap_or(false)
}

// Modifier-style function
pub fn require_role(storage: &dyn Storage, addr: &Addr, role: Role) -> Result<()> {
    if !has_role(storage, addr, role) {
        return Err(ContractError::Unauthorized);
    }
    Ok(())
}

// Usage in functions
pub fn pause_contract(deps: DepsMut, info: MessageInfo) -> Result<Response> {
    // Only pausers can pause
    require_role(deps.storage, &info.sender, Role::Pauser)?;
    
    // Pause logic...
    Ok(Response::new())
}

pub fn confirm_delivery(
    deps: DepsMut,
    info: MessageInfo,
    auction_id: u64,
) -> Result<Response> {
    // Only oracles can confirm delivery
    require_role(deps.storage, &info.sender, Role::Oracle)?;
    
    // Confirmation logic...
    Ok(Response::new())
}
```

### Admin Functions

```rust
// Grant role (admin only)
pub fn grant_role(
    deps: DepsMut,
    info: MessageInfo,
    target: Addr,
    role: Role,
) -> Result<Response> {
    // Only admins can grant roles
    require_role(deps.storage, &info.sender, Role::Admin)?;
    
    // Add role
    ROLES.update(deps.storage, &target, |roles| {
        let mut roles = roles.unwrap_or_default();
        if !roles.contains(&role) {
            roles.push(role.clone());
        }
        Ok::<_, StdError>(roles)
    })?;
    
    Ok(Response::new()
        .add_attribute("action", "grant_role")
        .add_attribute("target", target.to_string())
        .add_attribute("role", format!("{:?}", role)))
}

// Revoke role (admin only)
pub fn revoke_role(
    deps: DepsMut,
    info: MessageInfo,
    target: Addr,
    role: Role,
) -> Result<Response> {
    require_role(deps.storage, &info.sender, Role::Admin)?;
    
    ROLES.update(deps.storage, &target, |roles| {
        let mut roles = roles.unwrap_or_default();
        roles.retain(|r| r != &role);
        Ok::<_, StdError>(roles)
    })?;
    
    Ok(Response::new()
        .add_attribute("action", "revoke_role")
        .add_attribute("target", target.to_string())
        .add_attribute("role", format!("{:?}", role)))
}
```

### Time-Locked Admin Actions

For critical admin functions, add time locks:

```rust
const PENDING_ADMIN_CHANGE: Item<(Addr, Timestamp)> = Item::new("pending_admin");

pub fn propose_admin_change(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    new_admin: Addr,
) -> Result<Response> {
    require_role(deps.storage, &info.sender, Role::Admin)?;
    
    // Save proposal with 48-hour delay
    let execute_time = env.block.time.plus_seconds(48 * 60 * 60);
    PENDING_ADMIN_CHANGE.save(deps.storage, &(new_admin.clone(), execute_time))?;
    
    Ok(Response::new()
        .add_attribute("action", "propose_admin_change")
        .add_attribute("new_admin", new_admin.to_string())
        .add_attribute("execute_time", execute_time.to_string()))
}

pub fn execute_admin_change(deps: DepsMut, env: Env) -> Result<Response> {
    let (new_admin, execute_time) = PENDING_ADMIN_CHANGE.load(deps.storage)?;
    
    // Check time lock has passed
    if env.block.time < execute_time {
        return Err(ContractError::TimeLockNotExpired);
    }
    
    // Execute change
    // ... (grant admin role to new_admin, revoke from old)
    
    // Clear pending change
    PENDING_ADMIN_CHANGE.remove(deps.storage);
    
    Ok(Response::new())
}
```

---

## Input Validation

### Always Validate

```rust
pub fn create_auction(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    title: String,
    starting_price: Uint128,
    duration: u64,
) -> Result<Response> {
    // Validate title
    if title.is_empty() || title.len() > 200 {
        return Err(ContractError::InvalidTitle);
    }
    
    // Validate price
    if starting_price.is_zero() {
        return Err(ContractError::InvalidPrice);
    }
    
    // Maximum price check (prevent overflow in fee calculations)
    let max_price = Uint128::from(1_000_000_000_000u128); // 1 trillion
    if starting_price > max_price {
        return Err(ContractError::PriceTooHigh);
    }
    
    // Validate duration (1 hour to 30 days)
    if duration < 3600 || duration > 2_592_000 {
        return Err(ContractError::InvalidDuration);
    }
    
    // Validate sender has funds
    let fee = calculate_listing_fee(&starting_price);
    // ... check balance
    
    // All validations passed, proceed...
    Ok(Response::new())
}
```

### Address Validation

```rust
// Validate address format
pub fn validate_address(deps: &DepsMut, addr: &str) -> Result<Addr> {
    deps.api.addr_validate(addr)
        .map_err(|_| ContractError::InvalidAddress)
}

// Check address is not zero/empty
pub fn require_valid_address(addr: &Addr) -> Result<()> {
    if addr.as_str().is_empty() {
        return Err(ContractError::InvalidAddress);
    }
    Ok(())
}
```

---

## Safe Math

### Use Checked Arithmetic

```rust
// ❌ DANGEROUS - Can overflow/underflow
let total = amount1 + amount2;
let result = price * quantity;

// ✅ SAFE - Returns error on overflow
let total = amount1.checked_add(amount2)
    .ok_or(ContractError::Overflow)?;
    
let result = price.checked_mul(quantity)
    .ok_or(ContractError::Overflow)?;
```

### Uint128 Operations

```rust
use cosmwasm_std::Uint128;

// Addition
let sum = a.checked_add(b)?;

// Subtraction
let diff = a.checked_sub(b)?;

// Multiplication
let product = a.checked_mul(b)?;

// Division
let quotient = a.checked_div(b)?;

// Percentage calculation (safe)
let fee = amount.multiply_ratio(11u128, 1000u128); // 1.1%
```

### Comparison and Ordering

```rust
// Don't use: a > b (might not work as expected)
// Use:
if a.gt(&b) { }
if a.lt(&b) { }
if a.is_zero() { }

// Safe comparison
let max = a.max(b);
let min = a.min(b);
```

---

## Emergency Controls

### Pause Mechanism

```rust
const PAUSED: Item<bool> = Item::new("paused");

// Modifier to check if paused
pub fn require_not_paused(storage: &dyn Storage) -> Result<()> {
    if PAUSED.load(storage)? {
        return Err(ContractError::ContractPaused);
    }
    Ok(())
}

// Pause function
pub fn pause(deps: DepsMut, info: MessageInfo) -> Result<Response> {
    require_role(deps.storage, &info.sender, Role::Pauser)?;
    
    PAUSED.save(deps.storage, &true)?;
    
    Ok(Response::new()
        .add_attribute("action", "pause"))
}

// Unpause function
pub fn unpause(deps: DepsMut, info: MessageInfo) -> Result<Response> {
    require_role(deps.storage, &info.sender, Role::Admin)?;
    
    PAUSED.save(deps.storage, &false)?;
    
    Ok(Response::new()
        .add_attribute("action", "unpause"))
}

// Use in critical functions
pub fn place_bid(deps: DepsMut, info: MessageInfo, auction_id: u64) -> Result<Response> {
    // Check if paused
    require_not_paused(deps.storage)?;
    
    // Bid logic...
    Ok(Response::new())
}
```

### Circuit Breaker

For rate-limiting critical operations:

```rust
const WITHDRAWAL_LIMIT: Item<WithdrawalLimit> = Item::new("withdrawal_limit");

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct WithdrawalLimit {
    pub amount: Uint128,
    pub reset_time: Timestamp,
}

pub fn withdraw(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    amount: Uint128,
) -> Result<Response> {
    // Check daily withdrawal limit
    let mut limit = WITHDRAWAL_LIMIT.load(deps.storage)?;
    
    // Reset if 24 hours passed
    if env.block.time >= limit.reset_time {
        limit.amount = Uint128::zero();
        limit.reset_time = env.block.time.plus_seconds(86400);
    }
    
    // Check if amount exceeds daily limit
    let daily_limit = Uint128::from(1_000_000u128);
    if limit.amount.checked_add(amount)? > daily_limit {
        return Err(ContractError::DailyLimitExceeded);
    }
    
    // Update limit
    limit.amount = limit.amount.checked_add(amount)?;
    WITHDRAWAL_LIMIT.save(deps.storage, &limit)?;
    
    // Proceed with withdrawal...
    Ok(Response::new())
}
```

---

## Upgrade Patterns

### Migrations

```rust
#[cfg_attr(not(feature = "library"), entry_point)]
pub fn migrate(deps: DepsMut, _env: Env, _msg: MigrateMsg) -> Result<Response> {
    // Get current version
    let current_version = cw2::get_contract_version(deps.storage)?;
    
    // Check we're upgrading from correct version
    if current_version.contract != CONTRACT_NAME {
        return Err(ContractError::InvalidMigration);
    }
    
    // Version-specific migrations
    match current_version.version.as_str() {
        "0.1.0" => {
            // Migrate from 0.1.0 to 0.2.0
            migrate_0_1_to_0_2(deps.storage)?;
        }
        "0.2.0" => {
            // Already on latest version
        }
        _ => {
            return Err(ContractError::UnknownVersion);
        }
    }
    
    // Update version
    cw2::set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;
    
    Ok(Response::new()
        .add_attribute("action", "migrate")
        .add_attribute("from_version", current_version.version)
        .add_attribute("to_version", CONTRACT_VERSION))
}

fn migrate_0_1_to_0_2(storage: &mut dyn Storage) -> Result<()> {
    // Perform data migrations
    // Example: Rename keys, transform data structures, etc.
    Ok(())
}
```

---

## Testing Security Patterns

### Unit Tests

```rust
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_reentrancy_protection() {
        let mut deps = mock_dependencies();
        
        // Setup: User has 100 tokens
        setup_user_balance(&mut deps, "user1", 100);
        
        // First withdrawal: OK
        let msg = ExecuteMsg::Withdraw { amount: 50 };
        let res = execute(deps.as_mut(), mock_env(), mock_info("user1", &[]), msg);
        assert!(res.is_ok());
        
        // Try to withdraw again in same block: Should fail
        let msg = ExecuteMsg::Withdraw { amount: 50 };
        let res = execute(deps.as_mut(), mock_env(), mock_info("user1", &[]), msg);
        assert_eq!(res, Err(ContractError::InsufficientFunds));
    }
    
    #[test]
    fn test_overflow_protection() {
        let a = Uint128::MAX;
        let b = Uint128::from(1u128);
        
        // Should return error, not wrap around
        assert!(a.checked_add(b).is_none());
    }
    
    #[test]
    fn test_access_control() {
        let mut deps = mock_dependencies();
        
        // Non-admin tries to pause: Should fail
        let msg = ExecuteMsg::Pause {};
        let res = execute(deps.as_mut(), mock_env(), mock_info("user1", &[]), msg);
        assert_eq!(res, Err(ContractError::Unauthorized));
        
        // Admin pauses: OK
        let msg = ExecuteMsg::Pause {};
        let res = execute(deps.as_mut(), mock_env(), mock_info("admin", &[]), msg);
        assert!(res.is_ok());
    }
}
```

---

## Security Checklist

Before deploying any contract, verify:

### Reentrancy
- [ ] All state updates happen before external calls
- [ ] Reentrancy guards used where needed
- [ ] No reliance on contract balance

### Access Control
- [ ] All admin functions have role checks
- [ ] Critical functions have time locks
- [ ] Role management functions exist

### Input Validation
- [ ] All inputs validated (length, range, format)
- [ ] Addresses validated
- [ ] Amounts checked for zero/overflow

### Math
- [ ] All arithmetic uses checked operations
- [ ] Division by zero handled
- [ ] Percentage calculations use multiply_ratio

### Emergency
- [ ] Pause mechanism implemented
- [ ] Circuit breakers for critical operations
- [ ] Admin can upgrade/migrate contract

### Testing
- [ ] Unit tests for all functions
- [ ] Integration tests for user flows
- [ ] Fuzz tests for math operations
- [ ] Edge cases tested

---

## Related Documentation

- [Bridge Security](./BRIDGE_SECURITY.md) - Cross-chain security
- [Oracle Design](./ORACLE_DESIGN.md) - Oracle security considerations
- [Testing Guide](../development/TESTING_GUIDE.md) - Comprehensive testing

---

## References

- [CosmWasm Security Best Practices](https://docs.cosmwasm.com/docs/1.0/smart-contracts/best-practices/)
- [Solidity Security Patterns](https://consensys.github.io/smart-contract-best-practices/)
- [DASP Top 10](https://dasp.co/) - Decentralized Application Security Project

---

## Changelog

- **2026-02-15:** Initial version

---

## Feedback

Found a security issue? Please report responsibly:
- Security vulnerabilities: security@phoenixpme.com (private disclosure)
- General questions: gjf20842@gmail.com
- GitHub issues: https://github.com/greg-gzillion/TX/issues
