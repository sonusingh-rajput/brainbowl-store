import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail || !otp?.trim() || !newPassword) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }

    // Verify OTP
    const otpRecord = await prisma.otp.findFirst({
      where: { email: cleanEmail, code: otp?.trim(), type: 'FORGOT_PASSWORD' },
    });

    if (!otpRecord) {
      return NextResponse.json({ success: false, error: 'Incorrect verification code.' }, { status: 400 });
    }

    if (otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    // Update User Password in PostgreSQL
    await prisma.user.update({
      where: { email: cleanEmail },
      data: { password: newPassword },
    });

    // Delete used OTP
    await prisma.otp.deleteMany({ where: { email: cleanEmail, type: 'FORGOT_PASSWORD' } });

    return NextResponse.json({ success: true, message: 'Password updated successfully. Please sign in.' });
  } catch (error: any) {
    console.error('Password Reset Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Password reset failed' },
      { status: 500 }
    );
  }
}