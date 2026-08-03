import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { verifyPaymentSchema } from '@/lib/zod-schemas';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate payload
    const validation = verifyPaymentSchema.safeParse(body);
    if (!validation.success) {
  return NextResponse.json(
    { success: false, error: validation.error.issues[0].message },
    { status: 400 }
  );
}

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      validation.data;

    // 2. Compute expected HMAC SHA256 signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      logger.warn(`Signature mismatch for Razorpay Order: ${razorpay_order_id}`);
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // 3. Mark Order as PAID and update stock count in a single transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          status: 'PAID',
          razorpayPaymentId: razorpay_payment_id,
        },
      });

      await tx.product.update({
        where: { id: order.productId },
        data: {
          stock: { decrement: 1 },
        },
      });

      return order;
    });

    logger.info(`Order ${updatedOrder.id} successfully marked as PAID`);

    return NextResponse.json({
      success: true,
      data: {
        orderId: updatedOrder.id,
        status: updatedOrder.status,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Verify Payment API error');
    return NextResponse.json(
      { success: false, error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}