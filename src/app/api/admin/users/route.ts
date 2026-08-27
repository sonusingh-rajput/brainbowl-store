import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

// GET all customer users
export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// DELETE a single user OR all user records
export async function DELETE(req: Request) {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (body.deleteAll === true) {
      const deleteResult = await prisma.user.deleteMany({});
      return NextResponse.json({
        success: true,
        message: `Deleted all ${deleteResult.count} user records successfully.`,
        count: deleteResult.count,
      });
    }

    if (body.userId) {
      await prisma.user.delete({
        where: { id: body.userId },
      });
      return NextResponse.json({
        success: true,
        message: 'User deleted successfully.',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Please specify userId or deleteAll: true' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error deleting user(s):', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete user record(s)' },
      { status: 500 }
    );
  }
}
