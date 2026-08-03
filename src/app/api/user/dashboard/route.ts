import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('brainbowl_session')?.value;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Session cookie missing or expired.' },
        { status: 401 }
      );
    }

    // 1. Fetch user directly from PostgreSQL
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User account not found in database.' },
        { status: 404 }
      );
    }

    // 2. Build filter conditions
    const filterConditions = [];
    if (user.email) filterConditions.push({ customerEmail: user.email });
    if (user.phone) filterConditions.push({ customerPhone: user.phone });

    // 3. Query order history using `receiptId` (matching your Prisma schema)
   const orders = filterConditions.length > 0
  ? await prisma.order.findMany({
      where: { OR: filterConditions },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        receiptId: true,
        amount: true,
        status: true,
        shippingAddress: true,
        awbNumber: true, // <-- SELECT AWB NUMBER
        createdAt: true,
      },
    })
  : [];

    return NextResponse.json({
      success: true,
      data: {
        user,
        orders,
      },
    });
  } catch (error: any) {
    console.error('Dashboard Fetch Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}