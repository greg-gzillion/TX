import { z } from 'zod';

export const authSchemas = {
  register: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
      name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters'),
      phoneNumber: z.string()
        .min(10, 'Phone number must be at least 10 characters')
        .max(20, 'Phone number must not exceed 20 characters')
        .optional(),
      country: z.string()
        .min(2, 'Country code must be 2 characters')
        .max(3, 'Country code must not exceed 3 characters')
        .optional(),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
      password: z.string().min(1, 'Password is required'),
      twoFactorCode: z.string().optional(),
    }),
  }),

  refreshToken: z.object({
    body: z.object({
      refreshToken: z.string().min(1, 'Refresh token is required'),
    }),
  }),

  verifyEmail: z.object({
    query: z.object({
      token: z.string().min(1, 'Verification token is required'),
    }),
  }),

  forgotPassword: z.object({
    body: z.object({
      email: z.string().email('Invalid email address'),
    }),
  }),

  resetPassword: z.object({
    body: z.object({
      token: z.string().min(1, 'Reset token is required'),
      password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    }),
  }),

  changePassword: z.object({
    body: z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    }),
  }),

  updateProfile: z.object({
    body: z.object({
      name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .optional(),
      phoneNumber: z.string()
        .min(10, 'Phone number must be at least 10 characters')
        .max(20, 'Phone number must not exceed 20 characters')
        .optional(),
      country: z.string()
        .min(2, 'Country code must be 2 characters')
        .max(3, 'Country code must not exceed 3 characters')
        .optional(),
      bio: z.string()
        .max(500, 'Bio must not exceed 500 characters')
        .optional(),
    }),
  }),
};
