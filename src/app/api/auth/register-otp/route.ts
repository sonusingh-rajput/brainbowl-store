import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, otp } = await req.json();

    if (!name || !email || !phone || !password || !otp) {
      return NextResponse.json({ success: false, error: 'All fields including OTP are required' }, { status: 400 });
    }

    // Verify OTP record
    const otpRecord = await prisma.otp.findFirst({
      where: { email, code: otp, type: 'REGISTER' },
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Create user in PostgreSQL
    const user = await prisma.user.create({
      data: { name, email, phone, password },
    });

    // Clean up OTP record
    await prisma.otp.delete({ where: { id: otpRecord.id } });

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('brainbowl_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Registration failed' }, { status: 500 });
  }
}