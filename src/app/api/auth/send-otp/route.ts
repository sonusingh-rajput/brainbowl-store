import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, type } = await req.json(); // type: "REGISTER" or "FORGOT_PASSWORD"

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (type === 'REGISTER' && existingUser) {
      return NextResponse.json({ success: false, error: 'User with this email already exists' }, { status: 400 });
    }

    if (type === 'FORGOT_PASSWORD' && !existingUser) {
      return NextResponse.json({ success: false, error: 'No account found with this email' }, { status: 404 });
    }

    // Generate random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes validity

    // Delete existing unused OTPs for this email/type
    await prisma.otp.deleteMany({ where: { email, type } });

    // Store new OTP in database
    await prisma.otp.create({
      data: { email, code, type, expiresAt },
    });

    // Send email
    await sendOtpEmail(email, code, type);

    return NextResponse.json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to send OTP' }, { status: 500 });
  }
}