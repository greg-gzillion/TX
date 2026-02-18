# PhoenixPME Frontend Architecture
**Last Updated:** February 18, 2026
**Version:** 2.0 (Post-Reorganization)

## 📋 Recent Changes (Feb 18, 2026)

| Change | Description |
|--------|-------------|
| **Reorganized components** | Moved all UI components to `/components/ui` |
| **New homepage** | Replaced with polished design at `app/page.tsx` |
| **Wallet integration** | `WalletSelector` moved to `/components/layout` |
| **Auction components** | Consolidated in `/components/auctions` |
| **Import paths fixed** | All pages now use `@/` aliases |

## 🏗️ Current Structure (as of Feb 18, 2026)
frontend/
├── app/ # Next.js App Router pages
│ ├── auctions/
│ │ ├── create/
│ │ │ └── page.tsx # Create auction page
│ │ └── page.tsx # Auctions listing page
│ ├── dashboard/
│ │ └── page.tsx # User dashboard
│ ├── test-wallet/
│ │ └── page.tsx # Wallet test page
│ └── page.tsx # NEW homepage design
│
├── components/ # Reusable components
│ ├── auctions/
│ │ ├── AuctionCreator.tsx # Create auction form
│ │ └── AuctionList.tsx # Auction listing logic
│ ├── layout/
│ │ └── WalletSelector.tsx # Wallet connection (MOVED HERE)
│ └── ui/
│ ├── AuctionCard.tsx # Individual auction card (NEW)
│ ├── Button.tsx # Reusable button (NEW)
│ ├── FilterTabs.tsx # Metal filter tabs (NEW)
│ └── NavBar.tsx # Main navigation (NEW)
│
├── lib/ # Utilities and API
│ └── api.ts # API service (updated for Render)
│
└── public/ # Static assets


## 🎯 Component Reference (Updated Feb 18, 2026)

| Component | Location | Purpose | Status |
|-----------|----------|---------|--------|
| **Homepage** | `app/page.tsx` | Main landing with live prices | ✅ NEW |
| **NavBar** | `components/ui/NavBar.tsx` | Top navigation | ✅ NEW |
| **WalletSelector** | `components/layout/WalletSelector.tsx` | Wallet connection | ✅ MOVED |
| **AuctionCard** | `components/ui/AuctionCard.tsx` | Individual auction | ✅ NEW |
| **FilterTabs** | `components/ui/FilterTabs.tsx` | Metal filters | ✅ NEW |
| **Button** | `components/ui/Button.tsx` | Reusable button | ✅ NEW |
| **AuctionCreator** | `components/auctions/AuctionCreator.tsx` | Create auction | ✅ KEPT |
| **AuctionList** | `components/auctions/AuctionList.tsx` | Auction listing | ✅ KEPT |
| **API Service** | `lib/api.ts` | Backend calls | ✅ UPDATED |

## 🔗 Live URLs (as of Feb 18, 2026)

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | `https://phoenix-frontend-seven.vercel.app` | ✅ LIVE |
| **Backend API** | `https://phoenix-api-756y.onrender.com` | ✅ LIVE |
| **Prices** | `https://phoenix-api-756y.onrender.com/api/prices` | ✅ LIVE |

## 🧹 Clean Folders Status

| Folder | Status | Contains |
|--------|--------|----------|
| `/components/ui` | ✅ CLEAN | New UI components |
| `/components/layout` | ✅ CLEAN | Layout components |
| `/components/auctions` | ✅ CLEAN | Auction-specific components |
| `/lib` | ✅ CLEAN | API utilities |
| `/app` | ✅ CLEAN | Page routes only |

---

*Documentation maintained by @greg-gzillion*
*Last commit: 742436c - Fix AuctionList import*

