import { prisma } from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch active BrainBowl flagship product from PostgreSQL
  const product = await prisma.product.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  const activeProduct = {
    id: product?.id || 'default',
    name: product?.name || 'Brain Bowl Powder',
    price: product?.price || 49900,
    originalPrice: product?.originalPrice || 79900,
    stock: product?.stock ?? 100,
    imageUrl: product?.imageUrl || '/product_image.jpeg',
    description: product?.description || '100% Plant-Based Superfood Makhana with mental focus nutrients.',
    sku: product?.sku || 'POW-100',
  };

  return <HomeClient initialProduct={activeProduct} />;
}