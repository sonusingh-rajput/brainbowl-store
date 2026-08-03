import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  // Verify Admin Cookie
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'true';

  if (!isAdmin) {
    return NextResponse.json({ success: false, error: 'Unauthorized access' }, { status: 401 });
  }

  try {
    const totalUsers = await prisma.user.count();
    const paidOrders = await prisma.order.findMany({
      where: { status: 'PAID' },
      select: { amount: true },
    });

    const totalSalesRupees = paidOrders.reduce((sum, order) => sum + order.amount, 0) / 100;
    const totalOrdersCount = await prisma.order.count();
    const pendingOrdersCount = await prisma.order.count({ where: { status: 'PENDING' } });

    const products = await prisma.product.findMany({
      select: { id: true, name: true, price: true, stock: true },
    });

    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    });

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        amount: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalSales: totalSalesRupees,
        totalUsers,
        totalOrders: totalOrdersCount,
        pendingOrders: pendingOrdersCount,
        products,
        recentUsers,
        recentOrders,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard metrics' }, { status: 500 });
  }
}