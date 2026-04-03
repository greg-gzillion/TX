import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function forceUpdatePrices() {
  const prices = {
    gold: 4676,
    silver: 72.9,
    platinum: 1980,
    palladium: 1490
  };
  
  console.log('📊 Force updating prices to:', prices);
  
  try {
    // Delete old price history entries (optional)
    const deleted = await prisma.priceHistory.deleteMany({});
    console.log(`🗑️ Deleted ${deleted.count} old price entries`);
    
    // Create new price entry
    const newPrices = await prisma.priceHistory.create({
      data: {
        gold: prices.gold,
        silver: prices.silver,
        platinum: prices.platinum,
        palladium: prices.palladium,
        createdAt: new Date()
      }
    });
    
    console.log('✅ Prices updated in database:', newPrices);
  } catch (error) {
    console.error('❌ Failed to update prices:', error);
  } finally {
    await prisma.$disconnect();
  }
}

forceUpdatePrices();
