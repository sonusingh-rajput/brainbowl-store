
// src/app/page.tsx
import { prisma } from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

export const revalidate = 60; // Revalidate cache every 60 seconds

export default async function HomePage() {
  // Fetch active BrainBowl product directly from PostgreSQL
  const product = await prisma.product.findFirst({
    where: { stock: { gt: 0 } },
  });

  const fallbackProduct = {
    id: product?.id || '',
    name: product?.name || 'BrainBowl Superfood Makhana',
    price: product?.price || 29900,
    stock: product?.stock || 0,
  };

  return <HomeClient initialProduct={fallbackProduct} />;
}