import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { strongPasswordSchema, indianPhoneSchema } from '@/lib/zod-schemas';

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json();

    const cleanEmail = email?.trim().toLowerCase();
    const cleanPhone = phone?.trim().replace(/\D/g, '');

    // 1. Validate Phone Number (Format + Fake Pattern Detection)
    const phoneValidation = indianPhoneSchema.safeParse(cleanPhone);
    if (!phoneValidation.success) {
      return NextResponse.json(
        { success: false, error: phoneValidation.error.errors[0].message },
        { status: 400 }
      );
    }

    // 2. Validate High-Security Password
    const passwordValidation = strongPasswordSchema.safeParse(password);
    if (!passwordValidation.success) {
      return NextResponse.json(
        { success: false, error: passwordValidation.error.errors[0].message },
        { status: 400 }
      );
    }

    // 3. Duplicate Email Check in PostgreSQL
    const existingEmail = await prisma.user.findFirst({
      where: { email: cleanEmail },
    });

    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'This email address is already registered. Please sign in.' },
        { status: 400 }
      );
    }

    // 4. Duplicate Phone Check in PostgreSQL
    const existingPhone = await prisma.user.findFirst({
      where: { phone: cleanPhone },
    });

    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: 'This phone number is already registered with another account.' },
        { status: 400 }
      );
    }

    // 5. Hash Password & Save User
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: cleanEmail,
        phone: cleanPhone,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully!',
      user: { id: user.id, email: user.email, name: user.name },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}