import { PrismaClient } from '@prisma/client'

// Prisma v7 - just instantiate directly, URL comes from prisma.config.ts
const prisma = new PrismaClient()

export default prisma
