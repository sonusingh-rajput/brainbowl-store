import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const {
      amount,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
    } = await req.json();

    // Find or create default Product record in PostgreSQL
    let product = await prisma.product.findFirst();
    if (!product) {
      product = await prisma.product.create({
        data: {
          name: "BrainBowl Classic Roasted Makhana (250g)",
          price: amount || 29900,
          stock: 100,
        },
      });
    }

    const receiptId = `rcpt_${Date.now()}`;

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: amount || 29900,
      currency: "INR",
      receipt: receiptId,
    });

    // Save Pending Order in PostgreSQL
    await prisma.order.create({
      data: {
        receiptId: receiptId,
        amount: amount || 29900,
        status: "PENDING",
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        razorpayOrderId: razorpayOrder.id,
        productId: product.id,
      },
    });

    return NextResponse.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID, // Send key ID to client safely
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to initiate checkout" },
      { status: 500 },
    );
  }
}
