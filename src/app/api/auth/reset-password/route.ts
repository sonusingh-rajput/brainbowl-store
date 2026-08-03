import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }

    // Verify OTP
    const otpRecord = await prisma.otp.findFirst({
      where: { email, code: otp, type: 'FORGOT_PASSWORD' },
    });

    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 });
    }

    // Update User Password in PostgreSQL
    await prisma.user.update({
      where: { email },
      data: { password: newPassword },
    });

    // Delete used OTP
    await prisma.otp.delete({ where: { id: otpRecord.id } });

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Password reset failed' }, { status: 500 });
  }
}