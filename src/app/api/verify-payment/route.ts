import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment parameters' },
        { status: 400 }
      );
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json(
        { success: false, error: 'RAZORPAY_KEY_SECRET is not configured' },
        { status: 500 }
      );
    }

    // 1. Verify HMAC SHA256 Signature
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // 2. Update Order status to PAID in PostgreSQL
    await prisma.order.update({
      where: { razorpayOrderId: razorpayOrderId },
      data: {
        status: 'PAID',
        razorpayPaymentId: razorpayPaymentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified and order updated successfully',
    });
  } catch (error: any) {
    console.error('Verification Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}