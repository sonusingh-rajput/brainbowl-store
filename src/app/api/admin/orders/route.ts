import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function checkAdminAuth() {
  const cookieStore = await cookies();
  return cookieStore.get("admin_session")?.value === "true";
}

export async function PUT(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { orderId, awbNumber, courierUrl, status ,shippingCost} = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 },
      );
    }

    const updateData: any = {};
    if (awbNumber !== undefined)
      updateData.awbNumber = awbNumber?.trim() || null;
    if (courierUrl !== undefined)
      updateData.courierUrl = courierUrl?.trim() || null;
    if (status !== undefined) updateData.status = status;
    if (shippingCost !== undefined) {
      updateData.shippingCost = Math.round(Number(shippingCost) * 100);
    }
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { orderId } = await req.json();
    await prisma.order.delete({ where: { id: orderId } });
    return NextResponse.json({ success: true, message: "Order deleted" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
