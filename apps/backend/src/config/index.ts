import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  VERSION: process.env.VERSION || '1.0.0',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://phoenixpme:phoenixpme123@localhost:5432/phoenixpme',

  // JWT - Use number of seconds or specific string format
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-in-production',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m', // Will convert to seconds
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d', // Will convert to seconds

  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  CORS_ORIGINS: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],

  // Rate limiting
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),

  // Email (optional for now)
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',

  // App
  APP_NAME: process.env.APP_NAME || 'PhoenixPME',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@phoenixpme.com',

  // Features
  FEATURE_2FA: process.env.FEATURE_2FA === 'true' || false,
  FEATURE_KYC: process.env.FEATURE_KYC === 'true' || false,
  FEATURE_ESCROW: process.env.FEATURE_ESCROW === 'true' || true,
};

export type Config = typeof config;
