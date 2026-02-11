import { Router } from "express";
import { coreumService } from "../services/blockchain/coreum.service";

const router = Router();

// GET /api/blockchain/health
router.get("/health", async (req, res) => {
    try {
        const health = await coreumService.healthCheck();
        res.json(health);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/blockchain/balance/:address
router.get("/balance/:address", async (req, res) => {
    try {
        const result = await coreumService.getBalance(req.params.address);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/blockchain/wallet
router.get("/wallet", (req, res) => {
    try {
        const info = coreumService.getWalletInfo();
        res.json(info);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/blockchain/send (for testing)
router.post("/send", async (req, res) => {
    try {
        const { toAddress, amount } = req.body;

        if (!toAddress || !amount) {
            return res.status(400).json({ error: "Missing toAddress or amount" });
        }

        const insurancePool = process.env.INSURANCE_POOL_ADDRESS || "";
        const result = await coreumService.sendWithFee(toAddress, amount, insurancePool);

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
