#!/bin/bash
set -e

echo "🔧 Properly fixing JsonSchema..."

# 1. First, fix msg.rs (remove duplicates, ensure proper format)
echo "Fixing msg.rs..."
# Backup original
cp src/msg.rs src/msg.rs.backup2

# Clean up any line with multiple JsonSchema
sed -i 's/#\[derive(\(.*\)JsonSchema, JsonSchema\(.*\))\]/#[derive(\1JsonSchema\2)]/g' src/msg.rs
sed -i 's/#\[derive(\(.*\), JsonSchema, JsonSchema\(.*\))\]/#[derive(\1, JsonSchema\2)]/g' src/msg.rs
sed -i 's/#\[derive(\(.*\)JsonSchema, JsonSchema, JsonSchema\(.*\))\]/#[derive(\1JsonSchema\2)]/g' src/msg.rs

# Ensure proper derive format
sed -i 's/#\[derive(QueryResponses, JsonSchema)\]/#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]\n#[derive(QueryResponses)]/g' src/msg.rs

# 2. Check and fix other files
for file in src/state.rs src/contract.rs src/execute/*.rs src/query/*.rs; do
    if [ -f "$file" ]; then
        echo "Checking $file..."
        
        # Check for struct/enum without derive
        if grep -q "^\s*\(pub\s\+\)\?\(struct\|enum\)" "$file" && ! grep -q "derive(" "$file"; then
            echo "  ❌ Needs derive macro added"
            
            # Try to add derive to structs
            sed -i '/^\s*\(pub\s\+\)\?struct/s/^/#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]\n/' "$file" 2>/dev/null || true
            
            # Try to add derive to enums  
            sed -i '/^\s*\(pub\s\+\)\?enum/s/^/#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]\n/' "$file" 2>/dev/null || true
        fi
        
        # Add use schemars if not present
        if grep -q "derive(" "$file" && ! grep -q "use schemars" "$file"; then
            echo "  Adding use schemars import..."
            if grep -q "^use " "$file"; then
                sed -i '/^use /a use schemars::JsonSchema;' "$file"
            else
                # Add after any module declarations or at top
                sed -i '1s/^/use schemars::JsonSchema;\n/' "$file"
            fi
        fi
    fi
done

echo "✅ Fix complete!"
