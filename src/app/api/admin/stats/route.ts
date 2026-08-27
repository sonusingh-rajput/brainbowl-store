import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_session')?.value === 'true';

    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [totalUsers, totalOrders, paidOrders, recentUsers, recentOrders] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.findMany({ where: { status: 'PAID' } }),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, phone: true, createdAt: true },
      }),
      prisma.order.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          receiptId: true,
          customerName: true,
          customerEmail: true,
          customerPhone: true,
          shippingAddress: true,
          amount: true,
          shippingCost: true,
          status: true,
          razorpayPaymentId: true,
          awbNumber: true,
          courierUrl: true,
          createdAt: true,
        },
      }),
    ]);

    const totalSales = paidOrders.reduce((acc, order) => acc + order.amount / 100, 0);
    const pendingOrders = totalOrders - paidOrders.length;

    return NextResponse.json({
      success: true,
      data: {
        totalSales,
        totalUsers,
        totalOrders,
        pendingOrders,
        recentUsers,
        recentOrders,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}