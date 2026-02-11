use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

// Remove duplicate JsonSchema entries
sed -i 's/JsonSchema, JsonSchema/JsonSchema/g' src/msg.rs
sed -i 's/JsonSchema, JsonSchema, JsonSchema/JsonSchema/g' src/msg.rs
sed -i 's/JsonSchema, JsonSchema, JsonSchema, JsonSchema/JsonSchema/g' src/msg.rs
sed -i 's/, JsonSchema,/,/g' src/msg.rs | sed -i 's/, JsonSchema)/)/g' | sed -i 's/JsonSchema, //g'
