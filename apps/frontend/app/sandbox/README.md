# 🧪 PhoenixPME Developer Sandbox

**A safe, testnet environment for experimenting with precious metals auctions on the TX blockchain.**

## 📋 Overview

The PhoenixPME Sandbox is a comprehensive testing environment that allows developers to:

- Experiment with auction creation and bidding
- Test smart contract interactions
- Simulate wallet connections and transactions
- Understand the dual-collateral mechanism
- Explore TRUST/DONT TRUST reputation system

**⚠️ IMPORTANT:** All transactions occur on testnet. No real funds are ever used.

## 🏗️ Architecture

```
sandbox/
├── page.tsx                    # Main sandbox entry point
├── components/
│   ├── AuctionPlayground.tsx   # Full auction simulation
│   ├── ContractTester.tsx      # Smart contract interaction
│   ├── PriceFeed.tsx           # Live metal price display
│   ├── TestWalletsPanel.tsx    # Pre-funded test wallets
│   └── WalletSelector.tsx      # Wallet connection manager
```

## 🚀 Getting Started

### Prerequisites

- Keplr wallet or Leap wallet browser extension
- Test tokens (automatically provided in sandbox)

### Running the Sandbox

1. Navigate to `/sandbox` on the live site
2. Select a test wallet from the panel
3. Choose between Auction Playground or Contract Tester
4. Start experimenting!

## 🎮 Features

### 1. **Wallet Selection**

```typescript
// Multiple wallet options:
- Test Wallet 1 (1000 TESTUSD)
- Test Wallet 2 (1000 TESTUSD)
- Test Wallet 3 (1000 TESTUSD)
- Test Wallet 4 (1000 TESTUSD)
- Test Wallet 5 (1000 TESTUSD)
- Test Wallet 6 (1000 TESTUSD)
```

### 2. **Auction Playground**

- Create mock auctions with various metals
- Place test bids
- Simulate the 48-hour verification period
- Test collateral requirements
- Experience the dual-collateral mechanism

### 3. **Contract Tester**

- Direct smart contract interaction
- Test escrow functionality
- Simulate successful and failed trades
- Verify TRUST/DONT TRUST issuance

### 4. **Price Feed**

- Real-time metal prices (testnet)
- Manual update simulation
- Price history tracking

## 🔧 Component Documentation

### `AuctionPlayground.tsx`

```tsx
<AuctionPlayground wallet={selectedWallet} />
```

Full auction simulation with:

- Create auction (Gold, Silver, Platinum, Palladium)
- Place bids
- View auction status
- Test collateral locking

### `ContractTester.tsx`

```tsx
<ContractTester wallet={selectedWallet} />
```

Direct contract interaction:

- Deploy test contracts
- Call contract methods
- View transaction results
- Error simulation

### `PriceFeed.tsx`

```tsx
<PriceFeed />
```

Live price display:

- Current metal prices
- Price change indicators
- Last update timestamp
- Manual update trigger

### `TestWalletsPanel.tsx`

```tsx
<TestWalletsPanel
  selectedWallet={selectedWallet}
  onSelectWallet={setSelectedWallet}
/>
```

Pre-funded test accounts:

- 1000 TESTUSD each
- One-click selection
- Balance display
- Account details

### `WalletSelector.tsx`

```tsx
<WalletSelector onSelect={setSelectedWallet} />
```

Wallet connection manager:

- Connect Keplr
- Connect Leap
- Disconnect
- Address display

## 🧪 Test Scenarios

### Scenario 1: Create an Auction

1. Select a test wallet
2. Go to Auction Playground
3. Choose metal type (Gold)
4. Set price and duration
5. Create auction
6. Verify collateral is locked

### Scenario 2: Place a Bid

1. Select a different test wallet
2. Find an active auction
3. Enter bid amount
4. Place bid
5. Verify bid is recorded

### Scenario 3: Complete a Trade

1. Create auction as seller
2. Place bid as buyer
3. Simulate delivery confirmation
4. Wait 48-hour period
5. Verify collateral returned + PHNX issued

### Scenario 4: Test Contract Edge Cases

1. Insufficient balance
2. Invalid auction parameters
3. Late bids
4. Concurrent auctions

## 📊 State Management

```typescript
// Core state in sandbox page
const [selectedWallet, setSelectedWallet] = useState(null);
const [activeTab, setActiveTab] = useState("auctions");
const [mounted, setMounted] = useState(false);
```

## 🎨 UI/UX Features

- **Warning banners** - Clear testnet indicators
- **Responsive design** - Works on all devices
- **Loading states** - Visual feedback during transactions
- **Error messages** - Clear error explanations
- **Success confirmations** - Transaction receipts
- **Animations** - Smooth transitions between tabs

## 🔒 Security Notes

- All transactions are on testnet only
- Test tokens have no real value
- Private keys are never stored
- No real funds are ever at risk
- Smart contracts are experimental

## 🐛 Debugging

Common issues and solutions:

| Issue                 | Solution                       |
| --------------------- | ------------------------------ |
| Wallet not connecting | Ensure Keplr/Leap is installed |
| Transaction fails     | Check test token balance       |
| UI not updating       | Refresh or reconnect wallet    |
| CORS errors           | Check backend configuration    |

## 📝 Adding New Features

To extend the sandbox:

1. Create new component in `components/features/sandbox/`
2. Import and add to main `SandboxPage`
3. Update this documentation
4. Test thoroughly with all wallet types

## 🧪 Testing Commands

```bash
# Test sandbox locally
cd apps/frontend
npm run dev
# Visit http://localhost:3000/sandbox

# Run component tests
npm test sandbox

# Build for production
npm run build
```

## 📚 Learning Resources

- [TX Blockchain Documentation](https://docs.txchain.io)
- [Coreum Developer Portal](https://docs.coreum.dev)
- [CosmWasm Smart Contracts](https://docs.cosmwasm.com)
- [Keplr Wallet Guide](https://docs.keplr.app)

## 🤝 Contributing

We welcome sandbox improvements! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## ⚠️ Disclaimer

This sandbox is for **educational and testing purposes only**. No real transactions occur. All tokens are testnet tokens with no real-world value. Smart contracts are experimental and may contain bugs.

---

**Built with** 🧪 by the PhoenixPME team  
**Last Updated:** February 23, 2026  
**Live Demo:** [https://phoenix-frontend-seven.vercel.app/sandbox](https://phoenix-frontend-seven.vercel.app/sandbox)
