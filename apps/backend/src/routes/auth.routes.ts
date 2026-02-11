import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateZod } from '../middleware/zodValidation.middleware';
import { authSchemas } from '../schemas/auth.schemas';

const router = Router();

// Register route with Zod validation
router.post(
  '/register',
  validateZod(authSchemas.register),
  authController.register
);

// Login route with Zod validation
router.post(
  '/login', 
  validateZod(authSchemas.login),
  authController.login
);

// Refresh token route
router.post(
  '/refresh-token',
  validateZod(authSchemas.refreshToken),
  authController.refreshToken
);

// Verify email route
router.get(
  '/verify-email',
  validateZod(authSchemas.verifyEmail),
  authController.verifyEmail
);

// Forgot password route
router.post(
  '/forgot-password',
  validateZod(authSchemas.forgotPassword),
  authController.forgotPassword
);

// Reset password route
router.post(
  '/reset-password',
  validateZod(authSchemas.resetPassword),
  authController.resetPassword
);

export default router;
