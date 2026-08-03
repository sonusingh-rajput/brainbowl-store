import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Account with this email or phone already exists' },
        { status: 400 }
      );
    }

    // Insert user into PostgreSQL
    const user = await prisma.user.create({
      data: { name, email, phone, password },
    });

    // Set secure cookie
    const cookieStore = await cookies();
    cookieStore.set('brainbowl_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 Days
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}