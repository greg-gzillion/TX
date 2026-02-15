#!/bin/bash
set -e

echo "🔧 Fixing JsonSchema in all files..."

# Function to add JsonSchema to a file
fix_file() {
    local file="$1"
    
    if [ ! -f "$file" ]; then
        return
    fi
    
    echo "  Processing $file"
    
    # 1. Add use schemars::JsonSchema if not present
    if grep -q "derive(" "$file" && ! grep -q "use schemars::JsonSchema" "$file"; then
        # Add after existing use statements or at the top
        if grep -q "^use " "$file"; then
            sed -i '/^use /a use schemars::JsonSchema;' "$file"
        else
            # Add at the beginning (after any module declarations)
            sed -i '1s/^/use schemars::JsonSchema;\n/' "$file"
        fi
    fi
    
    # 2. Add JsonSchema to all derive macros
    # Fix patterns like #[derive(Serialize, Deserialize)]
    sed -i 's/#\[derive(\([^)]*\))\]/#[derive(\1, JsonSchema)]/g' "$file"
    
    # Fix patterns with multiple traits
    sed -i 's/#\[derive(\([^,]*\), \([^,]*\))\]/#[derive(\1, \2, JsonSchema)]/g' "$file"
    sed -i 's/#\[derive(\([^,]*\), \([^,]*\), \([^,]*\))\]/#[derive(\1, \2, \3, JsonSchema)]/g' "$file"
    sed -i 's/#\[derive(\([^,]*\), \([^,]*\), \([^,]*\), \([^,]*\))\]/#[derive(\1, \2, \3, \4, JsonSchema)]/g' "$file"
    sed -i 's/#\[derive(\([^,]*\), \([^,]*\), \([^,]*\), \([^,]*\), \([^,]*\))\]/#[derive(\1, \2, \3, \4, \5, JsonSchema)]/g' "$file"
}

# Process all Rust files
for file in src/msg.rs src/state.rs src/lib.rs src/contract.rs; do
    fix_file "$file"
done

# Process execute module files
for file in src/execute/*.rs; do
    fix_file "$file"
done

# Process query module files  
for file in src/query/*.rs; do
    fix_file "$file"
done

echo "✅ Done fixing JsonSchema!"
echo ""
echo "📋 Checking results:"
grep -r "derive(" src/ | head -20
