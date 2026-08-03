import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('brainbowl_session')?.value;

    if (!userId) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    // Fetch user directly from PostgreSQL
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, user: null }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}