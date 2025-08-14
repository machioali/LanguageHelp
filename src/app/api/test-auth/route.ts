import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authUrl = process.env.NEXTAUTH_URL;
    const authSecret = process.env.NEXTAUTH_SECRET;
    const databaseUrl = process.env.DATABASE_URL;
    
    return NextResponse.json({
      success: true,
      config: {
        nextAuthUrl: authUrl ? 'Set' : 'Missing',
        nextAuthSecret: authSecret ? 'Set' : 'Missing',
        databaseUrl: databaseUrl ? 'Set' : 'Missing',
        nodeEnv: process.env.NODE_ENV,
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
