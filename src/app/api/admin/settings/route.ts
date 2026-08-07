import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

// GET Current Shipping Settings
export async function GET() {
  try {
    let settings = await prisma.storeSetting.findUnique({
      where: { id: 'global' },
    });

    if (!settings) {
      settings = await prisma.storeSetting.create({
        data: {
          id: 'global',
          freeShippingMinAmount: 99900, // ₹999 default
          standardShippingFee: 9900,    // ₹99 default
        },
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// UPDATE Shipping Settings
export async function PUT(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { freeShippingMinAmount, standardShippingFee } = await req.json();

    const updated = await prisma.storeSetting.upsert({
      where: { id: 'global' },
      update: {
        freeShippingMinAmount: Math.round(Number(freeShippingMinAmount) * 100),
        standardShippingFee: Math.round(Number(standardShippingFee) * 100),
      },
      create: {
        id: 'global',
        freeShippingMinAmount: Math.round(Number(freeShippingMinAmount) * 100),
        standardShippingFee: Math.round(Number(standardShippingFee) * 100),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}