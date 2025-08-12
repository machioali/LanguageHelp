import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { UserRole } from '@/lib/constants';

export async function requireAdmin(request: NextRequest) {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      console.log('[SECURITY] Unauthenticated admin access attempt');
      return NextResponse.redirect(new URL('/auth/signin?callbackUrl=' + encodeURIComponent(request.url), request.url));
    }

    if (token.role !== UserRole.ADMIN) {
      console.log(`[SECURITY] Non-admin role attempting admin access: ${token.email} (${token.role})`);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    // Additional security: Only allow specific admin email
    const AUTHORIZED_ADMIN_EMAIL = 'machio2024@hotmail.com';
    if (token.email !== AUTHORIZED_ADMIN_EMAIL) {
      console.log(`[SECURITY ALERT] Unauthorized admin email: ${token.email}`);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    console.log(`[SECURITY] Authorized admin access: ${token.email}`);
    return null; // User is authorized
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
}

// Helper function to check admin status in API routes
export async function isAdmin(request: NextRequest): Promise<boolean> {
  try {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token || token.role !== UserRole.ADMIN) {
      return false;
    }

    // Additional security: Only allow specific admin email
    const AUTHORIZED_ADMIN_EMAIL = 'machio2024@hotmail.com';
    if (token.email !== AUTHORIZED_ADMIN_EMAIL) {
      console.log(`[SECURITY ALERT] Unauthorized admin API access: ${token.email}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}
