import { Router } from 'express';
import { auctionController } from '../controllers/auction.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateZod } from '../middleware/zodValidation.middleware';
import { auctionSchemas } from '../schemas/auction.schemas';

const router = Router();

// Get all auctions
router.get(
  '/',
  auctionController.getAuctions
);

// Get auction by ID
router.get(
  '/:id',
  validateZod(auctionSchemas.getAuction),
  auctionController.getAuctionById
);

// Create auction (authenticated)
router.post(
  '/',
  authenticate,
  validateZod(auctionSchemas.createAuction),
  auctionController.createAuction
);

// Update auction (authenticated)
router.put(
  '/:id',
  authenticate,
  validateZod(auctionSchemas.updateAuction),
  auctionController.updateAuction
);

// Delete auction (authenticated + authorized)
router.delete(
  '/:id',
  authenticate,
  authorize(['admin']),
  validateZod(auctionSchemas.deleteAuction),
  auctionController.deleteAuction
);

export default router;
