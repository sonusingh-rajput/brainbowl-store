import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get('phone')?.trim().replace(/\D/g, '');
    const receiptId = searchParams.get('receiptId')?.trim();

    if (!phone && !receiptId) {
      return NextResponse.json(
        { success: false, error: 'Phone number or Receipt ID is required' },
        { status: 400 }
      );
    }

    const whereConditions: any = {};
    if (phone) {
      whereConditions.customerPhone = phone;
    }
    if (receiptId) {
      whereConditions.receiptId = receiptId;
    }

    const orders = await prisma.order.findMany({
      where: whereConditions,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        receiptId: true,
        amount: true,
        shippingCost: true,
        status: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        shippingAddress: true,
        razorpayPaymentId: true,
        awbNumber: true,
        courierUrl: true,
        deliveredAt: true,
        returnReason: true,
        returnDetails: true,
        returnUpi: true,
        returnStatus: true,
        returnRequestedAt: true,
        returnAdminNotes: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    console.error('Order Lookup Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to lookup orders' },
      { status: 500 }
    );
  }
}
