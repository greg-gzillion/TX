# PhoenixPME DAO Operations & Governance

**Last updated:** February 21, 2026
**Status:** Living Document - Pre-DAO Phase

---

## Core Philosophy
PhoenixPME will be governed by its users through a Decentralized Autonomous Organization (DAO). The protocol's parameters—including the 1.1% fee—are transparently encoded in smart contracts. Future governance will allow the community to decide how accumulated funds are used.

**Current Status:** ⚠️ DAO NOT YET ACTIVE. Funds accumulate in Community Reserve Fund with no withdrawal ability until DAO forms.

---

## Phase 0: Preparation & Launch (Current - Feb 21, 2026)

**Objective:** Build, test, and prepare for mainnet launch.

### Current Status:
- ✅ Frontend live on Vercel
- ✅ Backend live on Render
- ✅ Smart contracts ready (7 + 16 tests passing)
- ✅ Mock mode active for UI testing
- ✅ Legal documentation complete
- ⏳ Community Reserve Fund accumulating (test mode)
- ⏳ TX testnet launch: March 6, 2026

### Fee Status:
- **Protocol Fee:** 1.1% hardcoded (not yet active)
- **Destination:** Community Reserve Fund (accumulating)
- **Withdrawal:** ❌ NO ONE can withdraw (not even founder)

### Governance:
- Informal, guided by founder (@greg-gzillion)
- Community input via GitHub Issues
- No on-chain voting yet

### Exit Condition:
- Successful TX testnet deployment
- First real auction completed
- Community Reserve Fund accumulates first fees
- Move to Phase 1 after March 6

---

## Phase 1: Bootstrap & Foundation (Post-Launch)

**Objective:** Launch a secure, functional MVP. Acquire the first 100 users and prove the protocol's value.

### Fee Structure:
| Aspect | Detail |
|--------|--------|
| **Protocol Fee** | 1.1% (hardcoded, cannot be changed) |
| **Destination** | Community Reserve Fund |
| **Founder Stake** | 10% voting weight (not withdrawal rights) |
| **Community** | 90% governed by future DAO |

### Treasury Allocation (To Be Voted):
- **50%:** Security (Smart contract audits, bug bounties)
- **30%:** Protocol Maintenance (Oracle server costs, infrastructure)
- **20%:** Community Initiatives (Grants for tools, education)

### Governance:
- Formal on-chain voting using governance tokens (PHNX)
- 1 token = 1 vote
- Proposals debated in forums before voting

### Goal:
Fund essential security and maintenance to protect user funds.

### Exit Condition:
- Consistent monthly trading volume exceeds **$10,000**
- Move to Phase 2 via DAO vote

---

## Phase 2: Sustainable Operations

**Trigger:** Successful on-chain DAO vote after Phase 1 goals met.

### Fee Structure:
- **Protocol Fee:** 1.1% (remains hardcoded)
- **Destination:** Community Reserve Fund
- **Founder Stake:** 10% voting weight maintained

### Treasury Allocation (Example Proposal):
| Allocation | Purpose |
|------------|---------|
| **40%** | Development Grants (building new features) |
| **30%** | Security & Operations |
| **20%** | Growth & Partnerships |
| **10%** | Community Treasury |

### Goal:
Create a self-sustaining ecosystem where builders are paid from value created.

---

## How Value is Distributed

### Protocol-Level Protections (Immutable)
The smart contracts include two non-negotiable economic protections encoded at deployment:

```solidity
// Cannot be changed by any governance vote
1. 1.1% protocol fee → Community Reserve Fund
2. Founder retains 10% voting weight in Community Reserve Fund