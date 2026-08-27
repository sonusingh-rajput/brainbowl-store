import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config({ path: '.env.local' });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  const product = await prisma.product.create({
    data: {
      name: 'BrainBowl Superfood Makhana',
      description: 'Nourish Your Brain & Body — 100% Plant Based & Gluten Free',
      price: 29900, // ₹299.00
      stock: 500,
    },
  });

  console.log('✅ Successfully seeded BrainBowl Product:', product);
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });