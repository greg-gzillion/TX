# Oracle Design & Delivery Verification

**Document Status:** Living Document  
**Last Updated:** February 15, 2026  
**Owner:** Greg (@greg-gzillion)  
**Review Cycle:** Monthly

## Executive Summary

PhoenixPME faces a unique challenge: verifying **physical delivery** of precious metals in a blockchain auction system. This requires oracles to bridge off-chain events (USPS delivery) to on-chain state (Coreum smart contracts).

This document outlines our oracle architecture, current implementation, planned improvements, and dispute resolution mechanisms.

**Current Status:** ⚠️ Single Oracle (Testnet) → Multi-Oracle Consensus (Production)

---

## Table of Contents

1. [The Oracle Problem](#the-oracle-problem)
2. [Current Implementation](#current-implementation)
3. [Multi-Oracle Architecture](#multi-oracle-architecture)
4. [Delivery Verification](#delivery-verification)
5. [Dispute Resolution](#dispute-resolution)
6. [Oracle Incentives](#oracle-incentives)

---

## The Oracle Problem

### What We Need to Know

For each auction, we need verifiable answers to:

1. **Did the buyer pay?** (XRPL payment verification)
2. **Did the seller ship?** (Tracking number verification)
3. **Was it delivered?** (Delivery confirmation)
4. **Did the buyer receive it?** (Recipient confirmation)

### Why This Is Hard

**The Blockchain Oracle Problem:**
- Blockchains can't access external data (USPS, FedEx, etc.)
- External APIs can lie, go down, or be manipulated
- Trust is needed, but trust defeats the purpose of blockchain

**Physical Goods Complications:**
- Package could be delivered to wrong address
- Package could be empty or contain wrong items
- Tracking shows "delivered" but buyer claims non-receipt
- Seller could ship fake tracking number

---

## Current Implementation (Testnet)

### Architecture

```
Seller ships → USPS tracking # → Oracle Service → Coreum Contract
                                         ↓
                                  USPS API Check
                                         ↓
                                "Delivered" Status
                                         ↓
                                Funds Released
```

### How It Works

1. **Seller provides tracking number** when auction ends
2. **Oracle polls USPS API** every 6 hours
3. **Status checked:** "In Transit" → "Out for Delivery" → "Delivered"
4. **On "Delivered":** Oracle submits transaction to Coreum
5. **Smart contract releases funds** to seller and fees to insurance pool

### Current Oracle Implementation

```javascript
// Simplified oracle logic (testnet)
async function checkDelivery(trackingNumber) {
  const uspsResponse = await usps.track(trackingNumber);
  
  if (uspsResponse.status === "Delivered") {
    const tx = await coreumContract.confirmDelivery(
      auctionId,
      trackingNumber,
      uspsResponse.timestamp,
      uspsResponse.signature
    );
    return tx;
  }
  
  return null; // Not delivered yet
}
```

### Limitations (Why This Isn't Production-Ready)

| Issue | Impact | Example |
|-------|--------|---------|
| **Single Point of Failure** | USPS API down = bridge down | USPS maintenance → all auctions halted |
| **Single Source of Truth** | USPS could be wrong | Delivered to wrong apartment |
| **No Dispute Mechanism** | Buyer claims non-receipt | Who decides? |
| **Oracle Centralization** | Must trust me (Greg) | I could confirm fake deliveries |
| **API Changes** | USPS changes API → code breaks | No notification, silent failure |

---

## Multi-Oracle Architecture (Production)

### Design Goals

1. **No single point of failure:** 5+ independent oracles
2. **Consensus required:** 4/5 oracles must agree
3. **Economic security:** Oracles stake value, slashed if dishonest
4. **Multiple data sources:** USPS + FedEx + buyer confirmation
5. **Dispute resolution:** 3-party arbitration for contested deliveries

### Architecture Overview

```
┌─────────────┐
│   Seller    │
│   Ships     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│   Tracking Info Submitted       │
│   (USPS #, FedEx #, etc.)      │
└──────────┬──────────────────────┘
           │
     ┌─────┴─────────────┐
     │                   │
     ▼                   ▼
┌──────────┐      ┌──────────┐      ┌──────────┐
│ Oracle 1 │      │ Oracle 2 │  ... │ Oracle 5 │
│  USPS    │      │  FedEx   │      │  Buyer   │
└────┬─────┘      └────┬─────┘      └────┬─────┘
     │                 │                  │
     └─────────┬───────┴──────────────────┘
               │
               ▼
      ┌────────────────┐
      │  Consensus     │
      │  (4/5 agree)   │
      └────────┬───────┘
               │
               ▼
      ┌────────────────┐
      │  Coreum Smart  │
      │   Contract     │
      └────────────────┘
```

### Oracle Nodes

#### Oracle 1-3: Carrier APIs
- **Oracle 1:** USPS tracking verification
- **Oracle 2:** FedEx tracking verification (if used)
- **Oracle 3:** UPS tracking verification (if used)

**Role:** Poll carrier APIs for delivery status

**Operated By:** Independent node operators (geographically distributed)

**Stake Required:** 10,000 TESTUSD per oracle

#### Oracle 4: Buyer Confirmation
- **Role:** Buyer signs message confirming receipt
- **Implementation:** Wallet signature required within 72 hours of "delivered"
- **Fallback:** If buyer doesn't sign within 72 hours, assume confirmed

**Why This Matters:** Prevents "delivered to wrong address" attacks

#### Oracle 5: Physical Verification (Optional)
- **Role:** Third-party inspection service
- **Use Case:** High-value items (>$10,000)
- **Implementation:** Inspector photographs item + buyer signature

### Consensus Mechanism

```rust
// Simplified consensus logic
fn check_delivery_consensus(auction_id: u64) -> DeliveryStatus {
    let oracle_reports = collect_oracle_reports(auction_id);
    
    // Count votes
    let delivered_votes = oracle_reports
        .iter()
        .filter(|r| r.status == "Delivered")
        .count();
    
    // Require 4/5 consensus
    if delivered_votes >= 4 {
        return DeliveryStatus::Confirmed;
    } else if delivered_votes == 0 {
        return DeliveryStatus::NotDelivered;
    } else {
        return DeliveryStatus::Disputed; // Oracles disagree
    }
}
```

### Oracle Slashing

**If Oracle is Dishonest:**

1. **Evidence collected** (conflicting reports, proven false data)
2. **Arbitration panel reviews** (3 randomly selected community members)
3. **If found guilty:** Oracle's stake is slashed
   - 50% burned (removed from supply)
   - 50% to reporter (whistleblower reward)
4. **Oracle removed** from approved list

**This creates economic incentive for honesty.**

---

## Delivery Verification

### Multi-Source Verification

Rather than trust a single source (USPS), we verify across multiple:

```typescript
interface DeliveryProof {
  // Carrier tracking
  usps_tracking: TrackingStatus;
  fedex_tracking?: TrackingStatus;
  ups_tracking?: TrackingStatus;
  
  // Buyer confirmation
  buyer_signature: string; // Wallet signature
  buyer_timestamp: number;
  
  // Metadata
  delivery_address: string;
  delivery_timestamp: number;
  photo_evidence?: string; // IPFS hash
  
  // Dispute window
  dispute_period_end: number; // 72 hours after delivery
}
```

### Delivery States

```
Pending → Shipped → In Transit → Out for Delivery → Delivered → Confirmed
                                                         ↓
                                                    [72 hour dispute window]
                                                         ↓
                                                  Finalized (funds released)
```

### Timeline

1. **T+0:** Seller ships, provides tracking
2. **T+3 days:** Package delivered (avg)
3. **T+3 days + 72 hours:** Dispute window closes
4. **T+6 days:** Funds released (if no dispute)

---

## Dispute Resolution

### When Disputes Arise

**Common scenarios:**
- Buyer claims: "Package delivered to wrong apartment"
- Buyer claims: "Package was empty"
- Seller claims: "Buyer lying to get free item"
- Carrier claims: "Delivered" but buyer has no package

### Dispute Process

#### Phase 1: Automatic Halt (Immediate)

```rust
fn raise_dispute(auction_id: u64, reason: String) {
    // Freeze funds
    auction.status = AuctionStatus::Disputed;
    
    // Notify parties
    notify(buyer, "Dispute raised");
    notify(seller, "Dispute raised");
    
    // Start arbitration
    select_arbitrators(auction_id);
}
```

**Impact:**
- Funds frozen (not released to seller)
- Both parties notified
- 72-hour evidence collection period

#### Phase 2: Evidence Collection (72 hours)

**Buyer Provides:**
- Delivery photos (if available)
- Communication with carrier
- Neighbor confirmation (if applicable)
- Other evidence

**Seller Provides:**
- Packing photos (showing item in box)
- Weight/dimensions documentation
- Carrier receipt
- Communication history

**Oracle Provides:**
- Tracking history
- Delivery photo (if available from carrier)
- GPS coordinates (if available)

#### Phase 3: Arbitration (3-5 days)

**Arbitration Panel:**
- 3 randomly selected community members
- Must have:
  - Account age >6 months
  - Completed >10 transactions
  - Staked 1,000 TESTUSD
- Cannot be buyer, seller, or related party

**Voting:**
- Each arbitrator reviews evidence
- Votes: "Buyer Wins" or "Seller Wins"
- 2/3 majority required
- Arbitrators paid 10 TESTUSD from insurance pool

**Outcomes:**

| Vote | Funds Go To | Fee Handling | Notes |
|------|-------------|--------------|-------|
| Buyer Wins | Buyer refunded | Seller pays 1.1% | Seller may be flagged |
| Seller Wins | Seller paid | Buyer pays 1.1% | Buyer may be flagged |
| Tie (rare) | 50/50 split | Both pay 0.55% | Insurance covers gap |

#### Phase 4: Appeal (Optional)

If either party believes arbitration was unfair:
- Can appeal within 24 hours
- Costs 100 TESTUSD (refunded if appeal wins)
- New panel of 5 arbitrators
- Final decision (no further appeals)

---

## Oracle Incentives

### Why Run an Oracle?

**Revenue Streams:**

1. **Transaction Fees:** 0.01% of each confirmed delivery
   - Example: $10,000 auction → $1 to oracle
   - 1,000 auctions/month → $1,000/month per oracle

2. **Staking Rewards:** Annual yield on staked TESTUSD
   - 5% APY on 10,000 TESTUSD stake
   - $500/year passive income

3. **Slashing Rewards:** 50% of slashed malicious oracles
   - If you catch a dishonest oracle → Earn their stake

**Total Potential:** $1,000-$2,000/month per oracle (at scale)

### Oracle Requirements

**Technical:**
- Server with 99.5% uptime
- API access to USPS/FedEx/UPS
- Coreum node or RPC access
- Monitoring and alerting

**Economic:**
- 10,000 TESTUSD stake (locked)
- Slashable if dishonest

**Operational:**
- Respond to queries within 60 seconds
- Update delivery status every 6 hours
- Maintain audit logs

---

## Oracle Selection Criteria

### How We Choose Oracles

**Application Process:**
1. Submit application with technical details
2. Demonstrate uptime (30-day trial)
3. Stake 10,000 TESTUSD
4. Community vote (DAO-style, future)

**Criteria:**
- ✅ Technical competence (proven uptime)
- ✅ Geographic diversity (no more than 2 oracles in same region)
- ✅ Reputation (existing community members preferred)
- ✅ Independence (no conflicts of interest)

**Disqualifying Factors:**
- ❌ Previous slashing history
- ❌ Related to PhoenixPME team
- ❌ Running other oracles in same data center

---

## Edge Cases

### What If Tracking Number Is Fake?

**Detection:**
- Oracle queries carrier API
- Invalid tracking # returns error
- Oracle reports "Invalid Tracking"

**Outcome:**
- Funds held in escrow
- Seller notified: "Provide valid tracking within 48 hours"
- If no valid tracking: Buyer refunded, seller flagged

### What If Carrier Loses Package?

**Detection:**
- Tracking shows "Lost in Transit"
- After 30 days, carrier confirms loss

**Outcome:**
- **Seller's responsibility** to insure package
- Buyer refunded (from escrow)
- Seller must file claim with carrier
- Seller flagged if happens repeatedly (>3 times)

### What If Package Is Damaged?

**Detection:**
- Buyer reports damage immediately
- Photos required within 24 hours of delivery

**Outcome:**
- Arbitration panel reviews photos
- If damaged in transit: Seller refunded, buyer compensated from seller's carrier insurance
- If damage appears intentional/pre-existing: Seller wins

### What If Buyer Refuses Delivery?

**Detection:**
- Carrier tracking: "Delivery Attempted - Refused"

**Outcome:**
- Treated as buyer cancellation
- Buyer pays return shipping + 1.1% fee
- Seller receives item back

---

## Privacy Considerations

### Data We Collect

- Tracking numbers
- Delivery addresses (encrypted)
- Delivery photos (if available)
- Oracle votes

### Data We DON'T Collect

- Buyer/seller real names (unless KYC required)
- Contents of packages (seller-provided description only)
- Carrier GPS coordinates (not stored)

### Data Retention

- Tracking info: 90 days after delivery
- Dispute evidence: 1 year
- Oracle votes: Permanent (on-chain)

---

## Future Improvements

### Phase 1 (Q2 2026): Multi-Oracle MVP
- [ ] Deploy 5 independent oracles
- [ ] Implement 4/5 consensus
- [ ] Test with small transactions (<$1,000)

### Phase 2 (Q3 2026): Advanced Verification
- [ ] Photo verification (computer vision)
- [ ] Weight validation (carrier scale data)
- [ ] IoT integration (smart package tracking)

### Phase 3 (Q4 2026): Decentralized Arbitration
- [ ] DAO governance for oracle selection
- [ ] Automated dispute resolution (small claims)
- [ ] Machine learning for fraud detection

---

## Metrics

### Oracle Performance

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Uptime | >99.5% | <98% |
| Response time | <60 seconds | >120 seconds |
| Consensus rate | >95% | <90% |
| False positives | <1% | >5% |

### Delivery Success

| Metric | Target | Notes |
|--------|--------|-------|
| Successful deliveries | >95% | Carrier dependent |
| Disputed deliveries | <5% | Industry standard |
| Arbitration time | <5 days | From dispute to resolution |
| Buyer satisfaction | >4.5/5 | Post-delivery survey |

---

## Comparison to Alternatives

### Why Not Use Existing Oracle Networks?

**Chainlink, Band Protocol, etc.**

**Pros:**
- Battle-tested
- Large node operator network
- Proven track record

**Cons:**
- Not designed for physical delivery verification
- Expensive (0.1-0.5% per query)
- Generalized (we need specialized logic)

**Decision:** Build custom oracles for delivery, may use Chainlink for price feeds

---

## Conclusion

Our oracle design evolves from **centralized simplicity** (testnet) to **decentralized robustness** (production). The path forward:

1. **Testnet:** Single oracle, learn the problem space
2. **Phase 1:** Multi-oracle consensus, reduce single points of failure
3. **Phase 2:** Advanced verification, improve accuracy
4. **Phase 3:** Full decentralization, community governance

**Timeline:** 9-12 months from single oracle to production-ready multi-oracle system.

---

## Related Documentation

- [Bridge Security](./BRIDGE_SECURITY.md) - Cross-chain security architecture
- [Security Patterns](./SECURITY_PATTERNS.md) - Smart contract best practices
- [Economic Model](../business/ECONOMIC_MODEL.md) - Insurance pool incentives
- [Dispute Resolution Guide](../operations/DISPUTE_GUIDE.md) - User-facing dispute process

---

## Changelog

- **2026-02-15:** Initial version (single oracle design documented)
- **TBD:** Multi-oracle implementation update
- **TBD:** Advanced verification features

---

## Feedback

Questions about oracle design? Found a vulnerability?

- Open an issue: https://github.com/greg-gzillion/TX/issues
- Email: gjf20842@gmail.com
- Security vulnerabilities: security@phoenixpme.com (private disclosure)
