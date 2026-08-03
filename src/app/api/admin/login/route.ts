import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const envUsername = process.env.ADMIN_USERNAME || 'admin';
    const envPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (username !== envUsername || password !== envPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Set HTTP-Only Cookie for Admin Session
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 Hours
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}