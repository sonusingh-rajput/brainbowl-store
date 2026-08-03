import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
    }

    // Verify HMAC SHA256 Webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      logger.error('Invalid Razorpay Webhook Signature received');
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);

    // Process payment captured event as an asynchronous backup
    if (payload.event === 'payment.captured') {
      const payment = payload.payload.payment.entity;

      const existingOrder = await prisma.order.findUnique({
        where: { razorpayOrderId: payment.order_id },
      });

      if (existingOrder && existingOrder.status !== 'PAID') {
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { razorpayOrderId: payment.order_id },
            data: {
              status: 'PAID',
              razorpayPaymentId: payment.id,
            },
          });

          await tx.product.update({
            where: { id: existingOrder.productId },
            data: { stock: { decrement: 1 } },
          });
        });

        logger.info(`Webhook: Updated order ${existingOrder.id} to PAID`);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    logger.error({ error }, 'Webhook Handler Error');
    return NextResponse.json({ error: 'Webhook Handler Failed' }, { status: 500 });
  }
}