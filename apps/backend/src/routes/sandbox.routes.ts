// apps/backend/src/routes/sandbox.routes.ts
router.get('/auctions', (req, res) => {
  res.json({
    success: true,
    data: mockAuctions,
    sandbox: true,
    message: "Sandbox mode - mock data only"
  });
});

router.get('/wallets', (req, res) => {
  res.json({
    success: true,
    data: testWallets, // Your 7 test wallets
    sandbox: true
  });
});