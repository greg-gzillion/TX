import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📊 Updating database prices...');
  
  // Delete all old price entries
  const deleted = await prisma.priceHistory.deleteMany({});
  console.log(`🗑️ Deleted ${deleted.count} old entries`);
  
  // Insert new prices
  const newPrices = await prisma.priceHistory.create({
    data: {
      gold: 4676,
      silver: 72.9,
      platinum: 1980,
      palladium: 1490,
      createdAt: new Date()
    }
  });
  
  console.log('✅ New prices saved:', newPrices);
  await prisma.$disconnect();
}

main().catch(console.error);
