import { withAuth } from "next-auth/middleware";
import { NextResponse, NextRequest } from "next/server";
import { UserRole } from "./src/lib/constants";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

// JWT Secret for interpreter authentication
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';

// Helper function to verify interpreter JWT token from cookies
function verifyInterpreterToken(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      // console.log('[JWT] No auth-token cookie found');
      return null;
    }
    
    if (authToken.length < 10) {
      console.log('[JWT] Invalid token format (too short)');
      return null;
    }
    
    const decoded = jwt.verify(authToken, JWT_SECRET) as any;
    
    if (!decoded.role || !decoded.userId) {
      console.log('[JWT] Token missing required fields');
      return null;
    }
    
    // console.log(`[JWT] Valid token for: ${decoded.email} (${decoded.role})`);
    return decoded;
  } catch (error) {
    console.log(`[JWT] Token verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return null;
  }
}

// Define allowed paths for signed-in clients
const CLIENT_ALLOWED_PATHS = [
  // Auth pages (for signup/signin flow)
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/admin',
  '/unauthorized',
  
  // Dashboard and related pages
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/settings', 
  '/dashboard/billing',
  
  // Core functionality pages
  '/book',
  '/pricing',
  '/help',
  '/about',
  
  // API routes
  '/api/',
  
  // Static assets and Next.js internals
  '/_next/',
  '/favicon.ico',
  '/images/',
  '/icons/'
];

// Define paths that require authentication (any role)
const PROTECTED_PATHS = [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/settings',
  '/dashboard/billing',
];

// Define admin-only paths (more comprehensive)
const ADMIN_ONLY_PATHS = [
  '/admin',
  '/admin/',
  '/admin/dashboard',
  '/admin/create-admin',
  '/admin/create-interpreter',
  '/api/admin'
];

// Define allowed paths for admin users (very restrictive)
const ADMIN_ALLOWED_PATHS = [
  '/admin',
  '/admin/',
  '/admin/dashboard',
  '/admin/create-admin',
  '/admin/create-interpreter',
  '/api/admin',
  '/api/auth/', // Auth endpoints
  '/unauthorized', // In case they need to see error pages
  '/_next/', // Next.js assets
  '/favicon.ico', // Favicon
  '/images/', // Static images
  '/icons/' // Static icons
];

// Define paths that are completely blocked for clients (will redirect to dashboard)
const CLIENT_BLOCKED_PATHS = [
  '/services',
  '/interpreter-portal',
  '/contact',
  '/careers',
  '/press',
  '/demo',
  '/status',
  '/docs',
  '/compliance',
  '/security',
  '/privacy',
  '/terms'
];

// Define ONLY allowed paths for interpreters (very restrictive)
const INTERPRETER_ALLOWED_PATHS = [
  '/interpreter-portal/interpreter',
  '/interpreter-portal/analytics',
  '/interpreter-portal/myaccount',
  '/interpreter-portal/reports',
  '/interpreter-portal/test-auth',
  '/api/interpreter',
  '/api/auth/interpreter-signin',
  '/auth/interpreter-signin',
  '/_next/',
  '/favicon.ico',
  '/images/',
  '/icons/'
];

// Helper function to check if a path is allowed for clients
function isPathAllowedForClient(pathname: string): boolean {
  return CLIENT_ALLOWED_PATHS.some(allowedPath => {
    if (allowedPath.endsWith('/')) {
      // For paths ending with '/', check if the pathname starts with it (like API routes)
      return pathname.startsWith(allowedPath);
    } else {
      // For exact paths, check for exact match or if it's a sub-path
      return pathname === allowedPath || pathname.startsWith(allowedPath + '/');
    }
  });
}

// Helper function to check if a path requires authentication
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(protectedPath => {
    return pathname === protectedPath || pathname.startsWith(protectedPath + '/');
  });
}

// Helper function to check if a path requires admin access
function isAdminOnlyPath(pathname: string): boolean {
  return ADMIN_ONLY_PATHS.some(adminPath => {
    return pathname === adminPath || pathname.startsWith(adminPath + '/');
  });
}

// Helper function to check if a path is allowed for admin users
function isPathAllowedForAdmin(pathname: string): boolean {
  return ADMIN_ALLOWED_PATHS.some(allowedPath => {
    if (allowedPath.endsWith('/')) {
      // For paths ending with '/', check if the pathname starts with it (like API routes)
      return pathname.startsWith(allowedPath);
    } else {
      // For exact paths, check for exact match or if it's a sub-path
      return pathname === allowedPath || pathname.startsWith(allowedPath + '/');
    }
  });
}

// Helper function to check if a path is allowed for interpreters (very restrictive)
function isPathAllowedForInterpreter(pathname: string): boolean {
  return INTERPRETER_ALLOWED_PATHS.some(allowedPath => {
    if (allowedPath.endsWith('/')) {
      // For paths ending with '/', check if the pathname starts with it (like API routes)
      return pathname.startsWith(allowedPath);
    } else {
      // For exact paths, check for exact match or if it's a sub-path
      return pathname === allowedPath || pathname.startsWith(allowedPath + '/');
    }
  });
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Skip middleware for static files and API routes that don't need protection
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/icons/') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/auth/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }
  
  // Get NextAuth token for all users (including interpreters)
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  console.log(`[Middleware DEBUG] Path: ${pathname}`);
  console.log(`[Middleware DEBUG] Token exists: ${!!token}`);
  console.log(`[Middleware DEBUG] Token role: ${token?.role}`);
  console.log(`[Middleware DEBUG] Token email: ${token?.email}`);
  
  // Force re-validate token if it seems stale
  if (token) {
    const now = Date.now();
    const tokenExp = token.exp ? (token.exp as number) * 1000 : 0;
    if (tokenExp && tokenExp < now) {
      console.log(`[Middleware DEBUG] Token expired, treating as unauthenticated`);
      // Treat as unauthenticated if token is expired
      return handleUnauthenticatedUser(req, pathname);
    }
  }
    
  // If user is signed in as a CLIENT
  if (token && token.role === UserRole.CLIENT) {
    console.log(`[Middleware] 🔒 CLIENT detected accessing: ${pathname}`);
    
    // Special case: redirect from home page to dashboard
    if (pathname === '/') {
      console.log(`[Middleware] ➡️ Redirecting client from home to dashboard`);
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    
    // Check if the current path is allowed for clients
    const isAllowed = isPathAllowedForClient(pathname);
    console.log(`[Middleware] Path ${pathname} allowed for client: ${isAllowed}`);
    
    if (!isAllowed) {
      console.log(`[Middleware] 🚫 BLOCKING client access to: ${pathname}`);
      // Redirect to dashboard if trying to access unauthorized pages
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      url.searchParams.set('blocked', 'true'); // Add query param to help debug
      return NextResponse.redirect(url);
    }
    
    console.log(`[Middleware] ✅ Allowing client access to: ${pathname}`);
  } else if (token) {
    console.log(`[Middleware] Non-client user (${token.role}) accessing: ${pathname}`);
    
    // For ADMIN users - handle them FIRST with very restrictive access control
    if (token.role === UserRole.ADMIN) {
      console.log(`[Middleware] 🔐 ADMIN user detected, applying strict access control`);
      
      // First verify this is the authorized admin email
      const AUTHORIZED_ADMIN_EMAIL = 'machio2024@hotmail.com';
      if (token.email !== AUTHORIZED_ADMIN_EMAIL) {
        console.log(`[Middleware] 🚫 BLOCKING unauthorized admin email: ${token.email}`);
        console.log(`[Middleware] 🚨 SECURITY ALERT: Admin role but wrong email - ${token.email}`);
        const url = req.nextUrl.clone();
        url.pathname = '/unauthorized';
        return NextResponse.redirect(url);
      }
      
      // Special case: redirect from home page to admin dashboard
      if (pathname === '/') {
        console.log(`[Middleware] ➡️ Redirecting admin from home to admin dashboard`);
        const url = req.nextUrl.clone();
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
      }
      
      // Check if the current path is allowed for admins
      const isAllowedForAdmin = isPathAllowedForAdmin(pathname);
      console.log(`[Middleware] Path ${pathname} allowed for admin: ${isAllowedForAdmin}`);
      
      if (!isAllowedForAdmin) {
        console.log(`[Middleware] 🚫 BLOCKING admin access to unauthorized path: ${pathname}`);
        console.log(`[Middleware] 📍 Redirecting admin to dashboard instead`);
        // Redirect to admin dashboard if trying to access unauthorized pages
        const url = req.nextUrl.clone();
        url.pathname = '/admin/dashboard';
        url.searchParams.set('blocked', 'true');
        url.searchParams.set('attempted', pathname); // Track what they tried to access
        return NextResponse.redirect(url);
      }
      
      console.log(`[Middleware] ✅ Allowing admin access to: ${pathname}`);
      return NextResponse.next(); // Explicitly allow and exit here
    }
    
    // Check admin-only paths for non-admin users (INTERPRETER, etc.)
    if (isAdminOnlyPath(pathname)) {
      console.log(`[Middleware] 🚫 BLOCKING non-admin access to admin path: ${pathname}`);
      console.log(`[Middleware] 🚨 SECURITY ALERT: Unauthorized admin access attempt by ${token.email} (role: ${token.role})`);
      const url = req.nextUrl.clone();
      url.pathname = '/unauthorized';
      return NextResponse.redirect(url);
    }
    
    // For INTERPRETER users - apply STRICT access control
    if (token.role === UserRole.INTERPRETER) {
      console.log(`[Middleware] 🔒 INTERPRETER detected: ${token.email}`);
      console.log(`[Middleware] 🔒 Applying STRICT interpreter access control`);
      
      // Redirect interpreters from home to their dashboard
      if (pathname === '/') {
        console.log(`[Middleware] ➡️ Redirecting interpreter from home to dashboard`);
        const url = req.nextUrl.clone();
        url.pathname = '/interpreter-portal/interpreter';
        return NextResponse.redirect(url);
      }
      
      // Check if the path is allowed for interpreters (VERY RESTRICTIVE)
      const isAllowedForInterpreter = isPathAllowedForInterpreter(pathname);
      console.log(`[Middleware] Path ${pathname} allowed for interpreter: ${isAllowedForInterpreter}`);
      
      if (!isAllowedForInterpreter) {
        console.log(`[Middleware] 🚫 BLOCKING interpreter access to unauthorized path: ${pathname}`);
        console.log(`[Middleware] 🚨 SECURITY: Interpreter ${token.email} tried to access: ${pathname}`);
        console.log(`[Middleware] 📍 Redirecting to interpreter dashboard`);
        
        // Redirect to interpreter dashboard for ANY unauthorized access
        const url = req.nextUrl.clone();
        url.pathname = '/interpreter-portal/interpreter';
        url.searchParams.set('blocked', 'true');
        url.searchParams.set('attempted', pathname);
        return NextResponse.redirect(url);
      }
      
      console.log(`[Middleware] ✅ Allowing interpreter access to authorized path: ${pathname}`);
    }
  } else {
    // Check if trying to access interpreter-only paths without authentication
    if (pathname.startsWith('/interpreter-portal') || pathname.startsWith('/api/interpreter')) {
      console.log(`[Middleware] 🚫 BLOCKING unauthenticated interpreter access: ${pathname}`);
      const url = req.nextUrl.clone();
      url.pathname = '/auth/interpreter-signin';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    
    // Unauthenticated user - handle this case
    return handleUnauthenticatedUser(req, pathname);
  }
  
  return NextResponse.next();
}

// Helper function to handle unauthenticated users
function handleUnauthenticatedUser(req: NextRequest, pathname: string) {
  console.log(`[Middleware] Unauthenticated user accessing: ${pathname}`);
  
  // Check if trying to access admin paths without authentication
  if (isAdminOnlyPath(pathname)) {
    console.log(`[Middleware] 🚫 BLOCKING unauthenticated admin access: ${pathname}`);
    // Redirect to admin sign-in page
    const url = req.nextUrl.clone();
    url.pathname = '/auth/admin';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  // Check if trying to access other protected paths
  if (isProtectedPath(pathname)) {
    console.log(`[Middleware] 🚫 BLOCKING unauthenticated access to protected path: ${pathname}`);
    // Redirect to regular sign-in page
    const url = req.nextUrl.clone();
    url.pathname = '/auth/signin';
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }
  
  console.log(`[Middleware] ✅ Allowing unauthenticated access to public path: ${pathname}`);
  return NextResponse.next();
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
