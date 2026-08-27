import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { orderId, receiptId, returnReason, returnDetails, returnUpi } = await req.json();

    if (!orderId && !receiptId) {
      return NextResponse.json(
        { success: false, error: 'Order ID or Receipt ID is required.' },
        { status: 400 }
      );
    }

    if (!returnReason || !returnReason.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please select a reason for your return request.' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: orderId ? { id: orderId } : { receiptId },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found.' },
        { status: 404 }
      );
    }

    if (order.status === 'RETURN_REQUESTED' || order.status === 'RETURNED') {
      return NextResponse.json(
        { success: false, error: `A return request is already ${order.status === 'RETURNED' ? 'completed' : 'under review'} for this order.` },
        { status: 400 }
      );
    }

    if (order.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, error: 'Cancelled orders cannot be returned.' },
        { status: 400 }
      );
    }

    if (order.status !== 'DELIVERED') {
      return NextResponse.json(
        { success: false, error: 'Returns are only allowed for delivered orders.' },
        { status: 400 }
      );
    }

    // Enforce 7 days return validity period after delivery
    const deliveryTime = order.deliveredAt ? new Date(order.deliveredAt).getTime() : 0;
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    if (!deliveryTime || Date.now() - deliveryTime > SEVEN_DAYS_MS) {
      return NextResponse.json(
        { success: false, error: 'The 7-day return period for this order has expired.' },
        { status: 400 }
      );
    }

    // Update order with Return Request details
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'RETURN_REQUESTED',
        returnStatus: 'PENDING',
        returnReason: returnReason.trim(),
        returnDetails: returnDetails?.trim() || null,
        returnUpi: returnUpi?.trim() || null,
        returnRequestedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Return request submitted successfully. Our support team will review and process your request.',
      data: updatedOrder,
    });
  } catch (error: any) {
    console.error('Return Request Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit return request' },
      { status: 500 }
    );
  }
}
