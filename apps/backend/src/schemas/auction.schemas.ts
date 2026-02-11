import { z } from 'zod';

export const auctionSchemas = {
  getAuction: z.object({
    params: z.object({
      id: z.string(),
    }),
  }),

  createAuction: z.object({
    body: z.object({
      title: z.string().min(3),
      description: z.string().optional(),
      startingPrice: z.number().positive(),
      reservePrice: z.number().positive().optional(),
      endDate: z.string().datetime(),
      tokenAddress: z.string(),
      tokenId: z.string().optional(),
    }),
  }),

  updateAuction: z.object({
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      title: z.string().min(3).optional(),
      description: z.string().optional(),
      status: z.enum(['draft', 'active', 'ended', 'cancelled']).optional(),
    }),
  }),

  deleteAuction: z.object({
    params: z.object({
      id: z.string(),
    }),
  }),
};
