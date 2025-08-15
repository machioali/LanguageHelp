import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Only allow this in development or for debugging
    const isDebugMode = process.env.NODE_ENV === 'development' || process.env.DEBUG_MODE === 'true';
    
    if (!isDebugMode) {
      return NextResponse.json({ error: 'Debug endpoint disabled' }, { status: 403 });
    }

    const debugInfo = {
      nodeEnv: process.env.NODE_ENV,
      nextAuthUrl: process.env.NEXTAUTH_URL ? 'Set' : 'Missing',
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing',
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Missing',
      vercelUrl: process.env.VERCEL_URL || 'Not set',
      vercelEnv: process.env.VERCEL_ENV || 'Not set',
      timestamp: new Date().toISOString(),
      headers: {
        host: request.headers.get('host'),
        origin: request.headers.get('origin'),
        userAgent: request.headers.get('user-agent'),
      }
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { error: 'Debug endpoint failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
