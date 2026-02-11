const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const testScripts = JSON.parse(fs.readFileSync('package-test-scripts.json', 'utf8'));

// Update scripts
packageJson.scripts = testScripts.scripts;

// Write back
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ Updated package.json with Windows-compatible test scripts');
