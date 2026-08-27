import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let product = await prisma.product.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!product) {
      product = await prisma.product.create({
        data: {
          name: 'BrainBowl Superfood Makhana',
          sku: 'BB-ROAST-01',
          price: 49900,
          originalPrice: 79900,
          stock: 100,
          imageUrl: '/product_image.jpeg',
          description: '100% Plant-Based Superfood Makhana with mental focus nutrients.',
          seoTitle: 'BrainBowl — Premium Superfood Makhana',
          seoDescription: 'High-protein, low-calorie roasted superfood drink.',
        },
      });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
