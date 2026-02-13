import { Router } from 'express';
import * as blockchainController from '../controllers/blockchain.controller';

const router = Router();

router.get('/status', blockchainController.getStatus);
router.post('/execute', blockchainController.executeContract);
router.get('/query/:contract', blockchainController.queryContract);
router.get('/balance/:address', blockchainController.getBalance);

export default router;
