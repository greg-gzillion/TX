# PhoenixPME Test Wallets
**Last Updated:** February 18, 2026
**Network:** Coreum Testnet
**Chain ID:** coreum-testnet-1

---

## 🏦 Test Wallet Registry

### User Wallets (Created in Keplr)

| Name | Address | TESTCORE | TESTUSD | Created | Role |
|------|---------|----------|---------|---------|------|
| **Robert** | `testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen` | ✓ Visible | ⚠️ Manual add | Existing | Full user |
| **Alice** | `testcore14qkw9fplr9xplfl5qwz8rr8f3uxhja8yuf0z6l` | ✓ Visible | ⚠️ Manual add | Existing | Full user |
| **Charlie** | `testcore1urvw6ta906qphvvrmcuwwxy3z2fqns56er2agu` | ✓ Visible | ⚠️ Manual add | Existing | Full user |
| **Mike** | `testcore1rr8knhdwc9uthxh3fazt3k4keuqtycctzcvd3c` | ✓ Visible | ⚠️ Manual add | Existing | Full user |

### System Wallets (Created Feb 18, 2026)

| Name | Address | TESTCORE | TESTUSD | Purpose |
|------|---------|----------|---------|---------|
| **Treasury** | `testcore19krrq7dtfck53dla2us9lxlmmzxg7d9wa6qkdm` | ✓ Visible | ⚠️ Manual add | Multi-sig, DAO treasury |
| **Deployer** | `testcore1wvrwgqjqfu7t9qzz3h05384ltjtnzfqlrytkmj` | ✓ Visible | ⚠️ Manual add | Contract deployment |
| **CRF** | `testcore1m5adn3k68tk4zqmujpnstmp9r933jafzu44tnv` | ✓ Visible | ⚠️ Manual add | Community Reserve Fund |

---

## 🔧 Issue: TESTUSD Not Visible in Keplr

### Current Behavior
- ✅ TESTCORE balance shows correctly
- ❌ TESTUSD token not appearing in wallet
- ✅ Token exists on-chain (verified)

### Root Cause
Keplr needs the token denom to be added to the chain configuration. The TESTUSD denom is:

utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6


---

## ✅ Solution: Add TESTUSD to Keplr

### Option 1: Manual Token Addition (For Users)

1. Open Keplr extension
2. Click on the Coreum Testnet
3. Click "Manage Tokens" → "Add Token"
4. Enter these details:

| Field | Value |
|-------|-------|
| **Denom** | `utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6` |
| **Symbol** | `TESTUSD` |
| **Decimals** | `6` |

5. Click "Add"

### Option 2: Update Chain Configuration (For Developers)

In `WalletSelector.tsx`, update the chain config:

```typescript
currencies: [
  {
    coinDenom: 'TESTCORE',
    coinMinimalDenom: 'utestcore',
    coinDecimals: 6,
  },
  {
    coinDenom: 'TESTUSD',
    coinMinimalDenom: 'utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6',
    coinDecimals: 6,
  },
],
📊 Wallet Balances (as of Feb 18, 2026)
Name	TESTCORE	TESTUSD	Last Verified
Robert	9.97	5,000,000	Feb 18, 2026
Alice	9.97	5,000,000	Feb 18, 2026
Charlie	9.97	5,000,000	Feb 18, 2026
Mike	9.97	5,000,000	Feb 18, 2026
need to populate others (treasury, deployer, and community reserve fund), will update