import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, otp } = await req.json();

    const cleanEmail = email?.trim().toLowerCase();
    const cleanPhone = phone?.trim().replace(/\D/g, '');

    if (!name?.trim() || !cleanEmail || !cleanPhone || !password || !otp) {
      return NextResponse.json(
        { success: false, error: 'All fields including OTP are required.' },
        { status: 400 }
      );
    }

    // 1. Verify OTP record
    const otpRecord = await prisma.otp.findFirst({
      where: { email: cleanEmail, code: otp?.trim(), type: 'REGISTER' },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'Incorrect verification code. Please check your email and try again.' },
        { status: 400 }
      );
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Verification code has expired. Please click "Resend OTP".' },
        { status: 400 }
      );
    }

    // 2. Check if email is already registered
    const existingEmail = await prisma.user.findFirst({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please sign in.' },
        { status: 400 }
      );
    }

    // 3. Check if phone is already registered
    const existingPhone = await prisma.user.findFirst({
      where: { phone: cleanPhone },
    });
    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: 'An account with this phone number is already registered.' },
        { status: 400 }
      );
    }

    // 4. Create user in database
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        password,
      },
    });

    // 5. Clean up used OTP record
    await prisma.otp.deleteMany({ where: { email: cleanEmail, type: 'REGISTER' } });

    // 6. Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('brainbowl_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (error: any) {
    console.error('Registration OTP Error in /api/auth/register-otp:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Email or phone number is already registered with another account.' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}