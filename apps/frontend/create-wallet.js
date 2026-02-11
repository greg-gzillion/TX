const { DirectSecp256k1HdWallet } = require("@cosmjs/proto-signing");

async function createWallet() {
  const wallet = await DirectSecp256k1HdWallet.generate(12, {
    prefix: "testcore",
  });
  const accounts = await wallet.getAccounts();
  
  console.log("✅ WALLET CREATED LOCALLY");
  console.log("Address:", accounts[0].address);
  console.log("Mnemonic:", wallet.mnemonic);
  console.log("\n1. Use this address to get TESTCORE from faucet");
  console.log("2. Then I'll create TESTUSD token for you");
}

createWallet().catch(console.error);
