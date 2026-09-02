import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";

const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
  });

export async function POST(req: Request) {
  try {
    // 1. Verify User Authentication via Session Cookie
    const cookieStore = await cookies();
    const userId = cookieStore.get("brainbowl_session")?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required. Please sign in or register to place an order." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Active user session not found. Please sign in again." },
        { status: 401 }
      );
    }

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
    const razorpay = getRazorpay();

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
        customerName: customerName || user.name,
        customerEmail: customerEmail || user.email,
        customerPhone: customerPhone || user.phone,
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
