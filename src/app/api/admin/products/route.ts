import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

// GET all products
export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json({ success: true, data: products });
}

// CREATE or UPDATE product
export async function POST(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const {
      id,
      name,
      sku,
      price,
      originalPrice,
      stock,
      imageUrl,
      description,
      seoTitle,
      seoDescription,
    } = await req.json();

    if (!name || price === undefined || price === null || price === '') {
      return NextResponse.json({ success: false, error: 'Name and Price are required' }, { status: 400 });
    }

    const numericPrice = Math.round(Number(price) * 100);
    const numericOriginalPrice =
      originalPrice !== undefined && originalPrice !== null && originalPrice !== ''
        ? Math.round(Number(originalPrice) * 100)
        : null;

    const data = {
      name,
      sku: sku || null,
      price: numericPrice,
      originalPrice: numericOriginalPrice,
      stock: Number(stock) || 0,
      imageUrl: imageUrl?.trim() || null,
      description: description || null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
    };

    if (id) {
      const updated = await prisma.product.update({
        where: { id },
        data,
      });
      return NextResponse.json({ success: true, data: updated });
    } else {
      const created = await prisma.product.create({
        data,
      });
      return NextResponse.json({ success: true, data: created });
    }
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}