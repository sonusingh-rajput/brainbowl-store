import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

async function checkAdminAuth() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

export async function GET() {
  if (!(await checkAdminAuth())) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const images: Array<{
      name: string;
      url: string;
      size?: number;
      createdAt?: string;
      isDefault?: boolean;
    }> = [];

    // 1. Add Default Store Product Images
    const publicDir = path.join(process.cwd(), 'public');
    const defaultImages = [
      { name: 'Default Product Packaging', url: '/product_image.jpeg', isDefault: true },
      { name: 'Brain Bowl Main Logo', url: '/Brain Bowl Logo.png', isDefault: true },
      { name: 'Brain Bowl Text Logo', url: '/Brain Bowl Text logo.png', isDefault: true },
    ];

    defaultImages.forEach((img) => {
      if (fs.existsSync(path.join(publicDir, img.url.replace(/^\//, '')))) {
        images.push(img);
      }
    });

    // 2. Read User Uploaded Gallery Images from /public/uploads
    const uploadsDir = path.join(publicDir, 'uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      files.forEach((file) => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile() && /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file)) {
          images.push({
            name: file,
            url: `/uploads/${file}`,
            size: stats.size,
            createdAt: stats.birthtime.toISOString(),
            isDefault: false,
          });
        }
      });
    }

    return NextResponse.json({ success: true, data: images });
  } catch (error: any) {
    console.error('Gallery Fetch Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
