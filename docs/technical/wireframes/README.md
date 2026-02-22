# UI Wireframes

This directory will contain wireframes and design assets for the PhoenixPME interface.

## Current Status
✅ Frontend UI already implemented (see `/apps/frontend`)
🔄 Wireframes for future features in progress

## Design Guidelines
- **Mobile-first approach** - All designs should work on mobile first, then scale up
- **Accessibility** - WCAG 2.1 AA compliance target
- **Consistent components** - Reusable design system

## Wireframes Needed
| Priority | Wireframe | Status |
|----------|-----------|--------|
| 🔴 HIGH | Marketplace/homepage | ✅ Already implemented |
| 🔴 HIGH | Auction creation wizard | ✅ Already implemented |
| 🔴 HIGH | Auction detail page | ⏳ Planned |
| 🟡 MEDIUM | User dashboard | ✅ Already implemented |
| 🟡 MEDIUM | Settlement flow | ⏳ Not Started |
| 🟢 LOW | Settings page | ⏳ Not Started |

✅ **Already Implemented in Code:**
- Marketplace/homepage (live on Vercel)
- Auction creation wizard (complete form with 8 components)
- User dashboard (working with stats)
- Auction detail page (coming soon - planned)

## Tools
- **Figma** (preferred) - Collaborative design
- **Adobe XD** - Alternative option
- **Pen/paper scans** - Quick ideation
- **Export format**: PNG/SVG for web assets

## File Naming Convention

wireframe_[page-name]_v[version].[extension]
Example: wireframe_auction-creation_v1.fig


## Design System Components
- Colors (to be defined)
- Typography (to be defined)
- Spacing grid (to be defined)
- Component library (to be defined)

⚠️ **Note:** Many components already exist in the codebase:
- See `/apps/frontend/components/shared/ui/` for Button, FilterTabs, etc.
- See `/apps/frontend/components/auctions/` for auction-specific components
- Wireframes should align with existing implementation

## Next Steps
1. Document existing UI components (what's already built)
2. Create wireframes for missing pages (auction detail, settlement flow)
3. Align with existing design patterns
4. Convert to high-fidelity for new features

---

*This document will be updated as wireframes are created.*

*Last updated: February 21, 2026*