import { z } from 'zod';

export const authSchemas = {
  register: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().optional(),
      twoFactorCode: z.string().optional(),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string(),
      twoFactorCode: z.string().optional(),
    }),
  }),

  refreshToken: z.object({
    body: z.object({
      refreshToken: z.string(),
    }),
  }),

  verifyEmail: z.object({
    query: z.object({
      token: z.string(),
    }),
  }),

  forgotPassword: z.object({
    body: z.object({
      email: z.string().email(),
    }),
  }),

  resetPassword: z.object({
    body: z.object({
      token: z.string(),
      password: z.string().min(8),
    }),
  }),
};
