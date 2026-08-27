import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // 1. Verify Admin Session Cookie
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_session')?.value === 'true';

    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, awbNumber, courierUrl } = await req.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (awbNumber !== undefined) {
      updateData.awbNumber = awbNumber?.trim() || null;
    }
    if (courierUrl !== undefined) {
      const trimmed = courierUrl?.trim();
      if (!trimmed) {
        updateData.courierUrl = null;
      } else if (/^https?:\/\//i.test(trimmed)) {
        updateData.courierUrl = trimmed;
      } else {
        updateData.courierUrl = `https://${trimmed}`;
      }
    }

    // 2. Update in PostgreSQL
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      data: updatedOrder,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update AWB details' },
      { status: 500 }
    );
  }
}