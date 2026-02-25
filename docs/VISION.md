# 🏛️ PhoenixPME Vision

**Last Updated:** February 24, 2026
**Author:** Greg ([@greg-gzillion](https://github.com/greg-gzillion))
**Current Phase:** Pre-TX Testnet Launch (9 days remaining)

---

## 🌅 Vision

To create a **decentralized protocol for peer-to-peer trading of physical precious metals** (gold, silver, platinum, palladium) where:

✅ Buyers and sellers transact **directly** with no intermediaries  
✅ **Smart contract escrow** ensures fair play for both parties  
✅ **KYC/AML** enables trusted identity and regulatory compliance  
✅ **On-chain reputation** prevents bad behavior and builds trust  
✅ **TESTUSD** provides stable value for testnet (RLUSD planned for mainnet)  
✅ **Community governance** through usage-based voting weight (**PHNX**)  

---

## 🎯 Core Problem to Solve

### Today's Problems:
| Issue | Current Solution | Why It's Broken |
|-------|------------------|-----------------|
| **Trust** | Trust the seller | ❌ Scams, fraud, no recourse |
| **Payment** | Trust the buyer | ❌ Chargebacks, non-payment |
| **Price** | Dealers set spreads | ❌ Gouging, unfair pricing |
| **History** | Word of mouth | ❌ No accountability, fake reviews |
| **Access** | Banks, KYC, paperwork | ❌ Exclusionary, slow, expensive |
| **Governance** | Company decides | ❌ Users have no voice |

### Protocol Solution:
| Issue | PhoenixPME Solution |
|-------|---------------------|
| **Trust** | ✅ Both parties post **10% collateral** in TESTUSD escrow |
| **Payment** | ✅ Funds locked until both parties confirm satisfaction |
| **Price** | ✅ Market discovery through transparent auctions |
| **History** | ✅ **TRUST/DONT TRUST** - permanent on-chain reputation |
| **Access** | ✅ Anyone with a wallet can participate (Keplr, Leap, MetaMask, Phantom) |
| **Governance** | ✅ **PHNX voting weight** - users govern based on fees generated |

---

## 🏛️ The PHNX Fund: Community-Controlled Treasury

### What is PHNX?
**PHNX** is the **community-controlled fund** that holds all 1.1% auction fees in TESTUSD. PHNX itself is **voting weight only** - **non-transferable, no cash value**.

### How It Works:
Every successful auction
↓
1.1% fee → Community Reserve Fund (TESTUSD)
↓
1 PHNX voting weight minted per 1 TESTUSD in fees
↓
90% community voting weight
↓
10% founder voting weight (permanent)


### Usage-Based Voting:
| User Activity | Voting Weight | Why It's Fair |
|---------------|---------------|----------------|
| Generate 100 TESTUSD in fees | 100 PHNX | Heavy users have more experience |
| Generate 50 TESTUSD in fees | 50 PHNX | Regular participants have a voice |
| Generate 10 TESTUSD in fees | 10 PHNX | Active users can participate |
| Generate 1 TESTUSD in fees | 1 PHNX | Everyone gets a foot in the door |

### Why This is Revolutionary:
| Traditional DAO | PHNX Model |
|-----------------|------------|
| Wealthy whales control votes | ✅ **Active users control votes** |
| Buy more tokens = more power | ✅ **Use platform more = more power** |
| Speculators dominate governance | ✅ **Real users dominate governance** |
| Incentive to hoard | ✅ **Incentive to participate** |
| Easy to manipulate with capital | ✅ **Hard to fake transactions** |

### PHNX Fund Uses (Decided by Community):
- ✅ Platform improvements and features
- ✅ Security audits and bug bounties
- ✅ Marketing and user acquisition
- ✅ Development grants
- ✅ Community initiatives

---

## 🔄 The Escrow Process
┌─────────────────────────────────────────────────────────────┐
│ SELLER LISTING │
│ • Lists item with description, images, metal details │
│ • Posts 10% seller collateral in TESTUSD │
│ • Auction created with terms, end time │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ BUYER WINS AUCTION │
│ • Buyer posts 10% buyer collateral in TESTUSD │
│ • Both parties' funds locked in escrow │
│ • Contract state = "AWAITING_PAYMENT" │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ SHIPPING & VERIFICATION │
│ • Seller ships item (tracking provided) │
│ • Buyer has 48-hour inspection period │
│ • Both parties confirm satisfaction │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ SUCCESSFUL TRADE │
│ • Funds released to seller │
│ • 10% collateral returned to both parties │
│ • 1.1% fee → Community Reserve Fund │
│ • 1 TRUST minted to both parties │
│ • 1 PHNX voting weight per 1 TESTUSD in fees │
└─────────────────────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────────────────────┐
│ DISPUTE RESOLUTION │
│ • Either party can flag issue │
│ • Funds remain locked │
│ • Evidence submitted on-chain │
│ • DAO or arbitrator decides │
│ • Bad actor loses collateral │
│ • 1 DONT TRUST minted to bad actor │
└─────────────────────────────────────────────────────────────┘

---

## 🛡️ Protections for Everyone

### For Buyers:
| Protection | How It Works |
|------------|--------------|
| **Funds safe** | Locked in escrow until you confirm receipt |
| **Item as described** | Dispute if not matching description |
| **Seller history** | TRUST/DONT TRUST shows all past behavior |
| **Collateral** | Seller has 10% skin in the game |
| **48-hour window** | Time to inspect before release |
| **Dispute rights** | Fair resolution process with evidence |
| **PHNX governance** | Your usage gives you a voice |

### For Sellers:
| Protection | How It Works |
|------------|--------------|
| **Guaranteed payment** | Funds locked at auction end |
| **No chargebacks** | Blockchain irreversible - no fraud |
| **Buyer history** | See all past behavior and ratings |
| **Collateral** | Buyer also has 10% skin in the game |
| **Dispute rights** | Can challenge false claims |
| **PHNX governance** | Your sales volume gives you influence |

---

## 🔍 On-Chain Reputation System

Every transaction builds a permanent, immutable reputation:

```json
{
  "address": "testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen",
  "total_trades": 47,
  "successful_trades": 46,
  "disputes": 1,
  "disputes_won": 1,
  "TRUST": 46,
  "DONT_TRUST": 1,
  "NET_TRUST": 45,
  "total_volume": 234500,
  "member_since": "2026-02-14",
  "PHNX_voting_power": "4.7%"
}
This reputation is:

✅ Permanent - Never deleted, can't be erased

✅ Transparent - Anyone can view and verify

✅ Immutable - Can't be faked or altered

✅ Portable - Follows you forever across the platform

✅ KYC-bound - One identity, one reputation

💰 TESTUSD & Collateral
We use TESTUSD for testnet (RLUSD planned for mainnet):

Feature	Why It Matters
✅ 6 decimals	Precision for micro-transactions
✅ Stable	1 TESTUSD = $1 USD (testnet value)
✅ Testnet ready	Live on Coreum testnet
✅ CW20 compatible	Works with CosmWasm contracts
Collateral Requirements:
Both parties post 10% of item value in TESTUSD

Collateral ensures good behavior

Bad actors lose their collateral to the other party

Collateral returned after successful trade

⚖️ Preventing Bad Behavior
Bad Behavior	Consequence
Seller gouging	Market competition + reputation hit + lower voting weight
Buyer false claims	Lose collateral + DONT TRUST + voting power reduced
Shill bidding	Tracked, banned, all associated accounts penalized
Non-shipment	Lose collateral + DONT TRUST + platform ban
Non-payment	Lose collateral + DONT TRUST + platform ban
Repeated violations	Permanent ban, reputation destroyed, collateral forfeited
🌐 The Role of TX Blockchain
TX (Coreum + Sologenic merger) is the perfect foundation because:

Feature	Benefit
✅ Built-in KYC/AML	Regulatory compliance at protocol level
✅ CosmWasm smart contracts	Powerful, auditable escrow logic
✅ Fast & cheap	Micro-transactions feasible (cents not dollars)
✅ Asset-focused	Sologenic's tokenization expertise
✅ IBC compatible	Future cross-chain potential
✅ Enterprise grade	Built for financial applications
🏛️ Governance & Community
Today (Pre-DAO Phase):
Founder-led development by Greg

8 contributors actively participating

24 daily visitors providing feedback

All decisions transparent on GitHub

Smart contracts ready for March 6

PHNX Distribution:
Allocation	Purpose
90%	Community (earned through fees)
10%	Founder voting weight (permanent)
Future (DAO Phase):
Aspect	How It Works
Voting	Usage-based weight (1 PHNX per 1 TESTUSD in fees)
Proposals	Any user can submit for community vote
Fund usage	Community decides CRF allocations
Reputation	Community sets dispute rules (within limits)
Platform upgrades	Community votes on major changes
🗺️ Roadmap
Phase	Timeline	Focus
Phase 1	✅ Complete	Foundation, UI, wallet, mock testing
Phase 2	March 6, 2026	TX testnet deployment, real contract testing
Phase 3	Q2 2026	TRUST/DONT TRUST system, PHNX voting weight
Phase 4	Q3 2026+	Mainnet launch, scaling, multi-chain
📊 Current Status (as of Feb 24, 2026)
✅ Working Now:
Component	Status
Live Frontend	✅ phoenix-frontend-seven.vercel.app
Live Backend	✅ phoenix-api-756y.onrender.com
Multi-Wallet	✅ Keplr, Leap, MetaMask, Phantom
TESTUSD Token	✅ Live on testnet
Price Banner	✅ Live metal prices
Admin Panel	✅ Password-protected updates
Smart Contracts	✅ 7 contracts, 16 tests
GitHub Clones	3,175 (14 days)
Contributors	8
🚧 In Progress:
Component	Status
TX Testnet Launch	⏳ March 6, 2026 (9 days)
Contract Deployment	⏳ March 6
Real Auction Testing	⏳ March 6+
PHNX Fund Mechanism	📝 Planned
TRUST/DONT TRUST	📝 Planned
📅 March 6, 2026:
TX TESTNET 6.0 LAUNCHES - REAL TESTING BEGINS!

00:01 UTC - TX Testnet 6.0 launches
00:15 UTC - Deploy phoenix-escrow contract
01:00 UTC - First test auction
02:00 UTC - First test bid
03:00 UTC - First successful trade
04:00 UTC - Announce to community
🤝 Join Us
This isn't just my project. It's OUR protocol.

3,175 developers have already looked at the code. 8 have contributed. The next one could be you.

How to Get Involved:
Activity	How
Use the platform	phoenix-frontend-seven.vercel.app
Test the sandbox	/sandbox
Read the code	github.com/greg-gzillion/TX
Share feedback	Open a GitHub Issue
Contribute	Submit a PR
Discuss	gjf20842@gmail.com
Spread the word	Tell others, share on social media
🌟 The Dream
A world where:

✅ Anyone can trade gold directly with anyone else - no banks, no dealers, no middlemen
✅ Trust comes from code, not institutions - smart contracts never lie
✅ Prices are fair, set by the market - transparent auctions, no gouging
✅ Reputation follows you forever - on-chain, immutable, earned (TRUST/DONT TRUST)
✅ The protocol belongs to its users - PHNX voting weight gives you a voice
✅ Your participation determines your influence - use it more, have more say

That's what we're building. Join us.

📜 The Three Tokens
Token	Purpose	Transferable	Cash Value
PHNX	Governance weight	❌ NO	$0
TRUST	Positive reputation	❌ NO	$0
DONT TRUST	Negative reputation	❌ NO	$0
Earned, not bought. Permanent, not fleeting. Real, not fake.

"Trust, but verify. With code, we can do both."

Last Updated: February 24, 2026
Author: Greg (@greg-gzillion)
*Next Milestone: March 6, 2026 - TX Testnet Launch* 🚀