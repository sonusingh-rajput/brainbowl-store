import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendOtpEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { email, phone, type } = await req.json(); // type: "REGISTER" or "FORGOT_PASSWORD"

    const cleanEmail = email?.trim().toLowerCase();
    const cleanPhone = phone?.trim().replace(/\D/g, '');

    if (!cleanEmail) {
      return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 });
    }

    if (type === 'REGISTER') {
      // 1. Check if Email already exists in database
      const existingEmail = await prisma.user.findFirst({ where: { email: cleanEmail } });
      if (existingEmail) {
        return NextResponse.json(
          { success: false, error: 'This email address is already registered. Please sign in or use a different email.' },
          { status: 400 }
        );
      }

      // 2. Check if Phone Number already exists in database
      if (cleanPhone) {
        const existingPhone = await prisma.user.findFirst({ where: { phone: cleanPhone } });
        if (existingPhone) {
          return NextResponse.json(
            { success: false, error: 'This phone number is already registered with another account. Please use a different phone number.' },
            { status: 400 }
          );
        }
      }
    }

    if (type === 'FORGOT_PASSWORD') {
      const existingUser = await prisma.user.findFirst({ where: { email: cleanEmail } });
      if (!existingUser) {
        return NextResponse.json(
          { success: false, error: 'No registered account found with this email address.' },
          { status: 404 }
        );
      }
    }

    // 3. Both Email & Phone are free -> Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 Minutes validity

    // Delete existing unused OTPs for this email/type
    await prisma.otp.deleteMany({ where: { email: cleanEmail, type } });

    // Store new OTP in database
    await prisma.otp.create({
      data: { email: cleanEmail, code, type, expiresAt },
    });

    // Send email (with server console logging fallback)
    await sendOtpEmail(cleanEmail, code, type);

    return NextResponse.json({ success: true, message: 'Verification code sent to your email.' });
  } catch (error: any) {
    console.error('Error in send-otp API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send OTP' },
      { status: 500 }
    );
  }
}