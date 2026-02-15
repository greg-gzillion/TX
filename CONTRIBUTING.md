# How to Contribute to PhoenixPME

## 🎯 Project Focus
First, please read [`CURRENT-FOCUS.md`](CURRENT-FOCUS.md) to understand what we're building NOW vs what's parked for later. This will save everyone time.

## 📋 Finding Tasks
1. Check [`PROJECTS_NEW.md`](PROJECTS_NEW.md) for current priorities
2. Look for issues tagged `good-first-issue` or `help-wanted` on [GitHub Issues](https://github.com/greg-gzillion/TX/issues)
3. Review the architecture docs in [`/docs/architecture/`](/docs/architecture/) to understand the system

## 🚀 Development Setup

### Prerequisites
- Node.js v18+
- Docker (for local blockchain)
- Keplr wallet (for testnet interaction)

### Local Development
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/TX.git
cd TX

# Install dependencies
cd apps/frontend && npm install
cd ../backend && npm install

# Start development servers
# Terminal 1 - Backend
cd apps/backend && npm run dev

# Terminal 2 - Frontend  
cd apps/frontend && npm run dev

# Visit http://localhost:3000

# Mock wallets are in tests/fixtures/wallets/
# Available roles: Treasury, Deployer, Insurance, Seller, Alice, Bob, Charlie

📝 Pull Request Process
Branch Naming:
feature/description for new features

fix/description for bug fixes

docs/description for documentation

Before Submitting:
Test your changes locally

Ensure all tests pass

Update documentation if needed

Add your changes to PROJECTS_NEW.md if applicable

PR Description Should Include:
What problem does this solve?

How did you test it?

Screenshots for UI changes

Related issue numbers

💬 Communication
GitHub Issues: For technical discussions, bug reports, feature requests

Email: gjf20842@gmail.com - For serious work, grants, or partnership inquiries

Do NOT: Open issues for general questions about blockchain or React

💰 The PhoenixPME Funding Model
This project aims to become self-sustaining through a 1.1% protocol fee, governed by the community. This means contributors are paid via transparent grants, not equity or speculative tokens.

Path for Technical Contributors
Step 1: Find an Open Task
Check the active issues in the GitHub Issues tab.

Review the roadmap in ROADMAP.md and CURRENT-FOCUS.md.

Comment on an issue or discussion to express interest and share your initial thoughts.

Step 2: Submit a Grant Proposal
For substantial work, submit a proposal to the community. A good proposal includes:

Title & Summary: e.g., "Build Core Auction Escrow Smart Contract v1.0"

Detailed Scope of Work: Reference specific sections of the Architecture Overview.

Deliverables: Concrete outputs (e.g., "Audited CosmWasm contract on Coreum testnet", "Technical documentation").

Timeline: Estimated start date and completion date.

Grant Request: Total funding amount and milestone breakdowns (e.g., "30% on audit completion, 70% on mainnet deployment").

Your Background: Links to previous relevant work (GitHub, portfolio).

Step 3: Community Review & Vote
Your proposal will be posted to the GitHub Discussions tab.

Community members and other developers will ask questions and provide feedback.

Once refined, the proposal will move to an on-chain snapshot vote for funding approval.

Step 4: Work & Get Paid
Upon vote approval, the grant amount is locked in the DAO treasury.

You work publicly, preferably in a fork or branch of the main repo.

Upon milestone completion, you submit proof of work. A multi-sig of community trustees releases the funds.

Current Priority Tracks for Grants
Core Smart Contract Development: Implementing the auction escrow state machine in CosmWasm.

Frontend/UI Development: Building user-friendly auction interfaces.

Oracle Development: Creating services to verify shipping and tracking.

Cross-Chain Infrastructure: Building bridges between TX (logic) and settlement layers.

Testing & Security: Auditing contracts and writing comprehensive tests.

Getting Started Today
You don't need to wait for a grant to contribute.

Fork the repository and start experimenting.

Submit a Pull Request for documentation fixes, design ideas, or small improvements.

Join the Discussion to help shape the protocol's future.

Building trust through small, public contributions is the best path to larger, funded work.

🔒 Legal
By contributing, you agree to:

The terms in docs/legal/CONTRIBUTOR_AGREEMENT.md

License your work under GPL v3.0 (see LICENSE)

Maintain the project's dual-license structure for commercial use

❓ Questions
Check existing issues first

Review documentation in /docs/

Open a GitHub issue with the question label

Thank you for helping build the future of physical metals trading on blockchain! 🏆

Last updated: February 14, 2026