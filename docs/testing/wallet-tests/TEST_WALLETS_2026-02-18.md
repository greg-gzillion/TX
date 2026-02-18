# PhoenixPME Test Wallets
**Last Updated:** February 18, 2026
**Network:** Coreum Testnet
**Chain ID:** coreum-testnet-1

---

## 🏦 Test Wallet Registry

| Role | Address | TESTCORE | TESTUSD (Expected) | Status |
|------|---------|----------|-------------------|--------|
| **Seller** | `testcore1xa352f6gtgc4g7c9rrdgl4wn9vaw9r25v47jen` | ✓ Visible | ⚠️ Not visible | Active |
| **Alice** | `testcore14qkw9fplr9xplfl5qwz8rr8f3uxhja8yuf0z6l` | ✓ Visible | ⚠️ Not visible | Active |
| **Charlie** | `testcore1urvw6ta906qphvvrmcuwwxy3z2fqns56er2agu` | ✓ Visible | ⚠️ Not visible | Active |
| **Mike** | `testcore1rr8knhdwc9uthxh3fazt3k4keuqtycctzcvd3c` | ✓ Visible | ⚠️ Not visible | Active |

---

## 🔧 Issue: TESTUSD Not Visible in Keplr

### Current Behavior
- ✅ TESTCORE balance shows correctly
- ❌ TESTUSD token not appearing in wallet
- ✅ Token exists on-chain (verified)

### Root Cause
Keplr needs the token denom to be added to the chain configuration. The TESTUSD denom is:
