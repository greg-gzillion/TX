# How to Contribute to PhoenixPME

## 🎯 Project Focus
First, please read [`CURRENT-FOCUS.md`](CURRENT-FOCUS.md) to understand what we're building NOW vs what's parked for later. This will save everyone time.

## 📋 Finding Tasks
1. Check [`PROJECTS_NEW.md`](PROJECTS_NEW.md) for current priorities
2. Look for issues tagged `good-first-issue` or `help-wanted` on GitHub
3. Review the architecture docs in `/docs/architecture/` to understand the system

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

💰 Compensation
Substantial contributions may be eligible for grants from future platform revenue. This includes:

Core feature development

Security audits and improvements

Documentation and tutorials

Community building

Compensation is evaluated on:

Impact of contribution

Quality of work

Alignment with project goals

Compensation discussions happen via email after the contribution is reviewed.

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