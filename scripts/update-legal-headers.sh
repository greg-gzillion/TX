#!/bin/bash

DATE="February 16, 2026"
JURISDICTION="Colorado, USA"
DEVELOPER="Greg Frank (individual developer)"
EMAIL="gjf20842@gmail.com"

echo "Updating legal document headers..."

# Update root documents
[ -f ~/dev/TX/TERMS_OF_SERVICE.md ] && sed -i "s/\[DATE\]/$DATE/g; s/\[Jurisdiction\]/$JURISDICTION/g; s/\[Legal Entity Name\]/$DEVELOPER/g; s/\[Email\]/$EMAIL/g" ~/dev/TX/TERMS_OF_SERVICE.md && echo "✅ Updated TERMS_OF_SERVICE.md"

[ -f ~/dev/TX/PRIVACY_POLICY.md ] && sed -i "s/\[DATE\]/$DATE/g; s/\[Jurisdiction\]/$JURISDICTION/g; s/\[Legal Entity Name\]/$DEVELOPER/g; s/\[Email\]/$EMAIL/g" ~/dev/TX/PRIVACY_POLICY.md && echo "✅ Updated PRIVACY_POLICY.md"

# Update compliance documents
[ -f ~/dev/TX/docs/legal/compliance/INSURANCE_DISCLAIMER.md ] && sed -i "s/\[DATE\]/$DATE/g; s/\[Jurisdiction\]/$JURISDICTION/g" ~/dev/TX/docs/legal/compliance/INSURANCE_DISCLAIMER.md && echo "✅ Updated INSURANCE_DISCLAIMER.md"

[ -f ~/dev/TX/docs/legal/compliance/RISK_DISCLOSURE.md ] && sed -i "s/\[DATE\]/$DATE/g; s/\[Jurisdiction\]/$JURISDICTION/g" ~/dev/TX/docs/legal/compliance/RISK_DISCLOSURE.md && echo "✅ Updated RISK_DISCLOSURE.md"

echo ""
echo "🎉 All done! New documents added and headers updated."
