#!/bin/bash
set -e  # Exit on error

echo "📝 Creating TESTUSD token documentation..."

# Create docs directory if it doesn't exist
mkdir -p docs

# Create the main token documentation
cat > docs/TESTUSD_TOKEN_CREATION.md << 'DOCEOF'
# TESTUSD Token - Live on Coreum Testnet ✅

## 🎉 Successfully Created!
**Date:** $(date)
**Transaction:** 37EC84596A02687D8F77E7D92538F518CCE847D8B4A325732B911FD0B0D35E9A

## Token Details
- **Symbol:** TESTUSD
- **Denom:** utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6
- **Decimals:** 6
- **Initial Supply:** 1000 tokens
- **Issuer:** testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6

## Current Distribution
- **Issuer Wallet:** 900 TESTUSD
- **Test Wallet (testcore1u5m...):** 100 TESTUSD

## Status: ✅ OPERATIONAL
Token is live, transferable, and visible in Leap Wallet.
DOCEOF

echo "✅ Created docs/TESTUSD_TOKEN_CREATION.md"

# Update README if it exists
if [ -f README.md ]; then
    echo "📖 Updating README.md..."
    
    # Check if we already have a token section
    if ! grep -q "TESTUSD Token" README.md; then
        # Add token section at the end
        echo "" >> README.md
        echo "## TESTUSD Token Status" >> README.md
        echo "✅ **LIVE ON COREM TESTNET**" >> README.md
        echo "The foundation token for PhoenixPME auctions is now operational." >> README.md
        echo "- Symbol: TESTUSD" >> README.md
        echo "- Denom: utestusd-testcore1tymxlev27p5rhxd36g4j3a82c7uucjjz4xuzc6" >> README.md
        echo "- Created: $(date)" >> README.md
        echo "" >> README.md
        echo "See [docs/TESTUSD_TOKEN_CREATION.md](docs/TESTUSD_TOKEN_CREATION.md) for details." >> README.md
    fi
    
    echo "✅ Updated README.md"
else
    echo "⚠️ README.md not found - creating basic one"
    echo "# PhoenixPME" > README.md
    echo "## TESTUSD Token Status" >> README.md
    echo "✅ **LIVE ON COREM TESTNET**" >> README.md
fi

echo ""
echo "🎉 Documentation created successfully!"
echo "Files:"
ls -la docs/
echo ""
echo "To commit to GitHub:"
echo "  git add docs/ README.md"
echo "  git commit -m 'docs: Add TESTUSD token documentation'"
echo "  git push"
