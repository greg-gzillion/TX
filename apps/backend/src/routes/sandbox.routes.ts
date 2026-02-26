import { Router } from 'express';
import { generateTestWallet, fundWallet } from '../services/wallet.service';

const router = Router();

// Create a REAL testnet wallet
router.post('/wallets/create', async (req, res) => {
  try {
    const wallet = await generateTestWallet();
    res.json({ 
      success: true, 
      wallet: {
        id: wallet.id,
        name: `Test Wallet ${wallet.id.slice(0,4)}`,
        address: wallet.address,
        balance: '0 TESTUSD' // Start with 0, fund separately
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create wallet' });
  }
});

// Fund a wallet from faucet
router.post('/wallets/fund', async (req, res) => {
  try {
    const { address } = req.body;
    const result = await fundWallet(address);
    res.json({ success: true, balance: '10,000 TESTUSD' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fund wallet' });
  }
});

export default router;