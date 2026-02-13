import { Router } from 'express';
import * as auctionController from '../controllers/auction.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', auctionController.getAuctions);
router.get('/:id', auctionController.getAuctionById);

// Protected routes
router.post('/', authenticate, auctionController.createAuction);
router.post('/:id/bid', authenticate, auctionController.placeBid);
router.put('/:id', authenticate, authorize('seller'), auctionController.updateAuction);
router.delete('/:id', authenticate, authorize('seller', 'admin'), auctionController.deleteAuction);
router.post('/:id/end', authenticate, auctionController.endAuction);

export default router;
