import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lazy initialization to prevent build-time errors
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY not configured, email notifications disabled');
    return null;
  }
  return new Resend(apiKey);
}

interface BookingRequest {
  sourceLanguage: string;
  targetLanguage: string;
  sessionType: 'video' | 'phone' | 'in_person';
  urgency: 'immediate' | 'within_hour' | 'scheduled';
  scheduledAt?: string;
  duration: number;
  description?: string;
  specialRequirements?: string;
}

// POST /api/bookings - Create a new booking request
export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();
    
    // Get client from session/auth
    const clientId = request.headers.get('user-id'); // From your auth system
    
    if (!clientId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabaseClient();

    // Find available interpreters for the language pair
    const { data: interpreters } = await supabase
      .from('interpreters')
      .select(`
        id, user_id, languages, hourly_rate, rating,
        users!interpreters_user_id_fkey(name, email, phone)
      `)
      .eq('verification_status', 'verified')
      .contains('languages', [body.sourceLanguage, body.targetLanguage]);

    if (!interpreters?.length) {
      return NextResponse.json({
        error: 'No interpreters available for this language pair'
      }, { status: 404 });
    }

    // For immediate requests, find online interpreters
    let availableInterpreters = interpreters;
    
    if (body.urgency === 'immediate') {
      // Check interpreter online status (implement WebSocket or polling)
      availableInterpreters = await filterOnlineInterpreters(interpreters);
    }

    // Create booking requests for multiple interpreters (first-come-first-serve)
    const bookingPromises = availableInterpreters.slice(0, 3).map(async (interpreter) => {
      const price = interpreter.hourly_rate * (body.duration / 60);
      
      const { data: booking } = await supabase
        .from('booking_requests')
        .insert({
          client_id: clientId,
          interpreter_id: interpreter.id,
          source_language: body.sourceLanguage,
          target_language: body.targetLanguage,
          session_type: body.sessionType,
          scheduled_at: body.scheduledAt,
          duration_minutes: body.duration,
          urgency: body.urgency,
          description: body.description,
          special_requirements: body.specialRequirements,
          price,
          status: 'pending'
        })
        .select()
        .single();

      // Send notification to interpreter
      if (booking) {
        await sendInterpreterNotification(interpreter, booking);
      }

      return booking;
    });

    const bookings = await Promise.all(bookingPromises);

    return NextResponse.json({
      message: 'Booking requests sent to interpreters',
      bookings: bookings.filter(Boolean),
      interpretersNotified: availableInterpreters.length
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking request' },
      { status: 500 }
    );
  }
}

// GET /api/bookings - Get user's bookings
export async function GET(request: NextRequest) {
  const userId = request.headers.get('user-id');
  const userType = request.headers.get('user-type');
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabaseClient();

  let query = supabase.from('booking_requests').select(`
    id, source_language, target_language, session_type,
    scheduled_at, duration_minutes, status, urgency,
    description, price, created_at,
    client:users!booking_requests_client_id_fkey(name, email),
    interpreter:interpreters!booking_requests_interpreter_id_fkey(
      user:users!interpreters_user_id_fkey(name, email),
      rating
    )
  `);

  if (userType === 'client') {
    query = query.eq('client_id', userId);
  } else if (userType === 'interpreter') {
    // Get interpreter record first
    const { data: interpreter } = await supabase
      .from('interpreters')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (interpreter) {
      query = query.eq('interpreter_id', interpreter.id);
    }
  }

  const { data: bookings, error } = await query.order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookings });
}

async function filterOnlineInterpreters(interpreters: any[]) {
  // This would typically check a Redis store or WebSocket connection status
  // For now, return all interpreters (implement real-time presence later)
  return interpreters;
}

async function sendInterpreterNotification(interpreter: any, booking: any) {
  try {
    const supabase = getSupabaseClient();
    const resend = getResendClient();
    
    // Create notification record
    await supabase.from('notifications').insert({
      user_id: interpreter.user_id,
      type: 'booking_request',
      title: 'New Interpretation Request',
      message: `New ${booking.urgency} request for ${booking.source_language} → ${booking.target_language}`,
      data: { booking_id: booking.id }
    });

    // Send email notification
    if (resend) {
      await resend.emails.send({
        from: 'LanguageHelp <notifications@languagehelp.com>',
        to: interpreter.users.email,
        subject: '🔔 New Interpretation Request',
        html: `
          <div>
            <h2>New Interpretation Request</h2>
            <p><strong>Languages:</strong> ${booking.source_language} → ${booking.target_language}</p>
            <p><strong>Type:</strong> ${booking.session_type}</p>
            <p><strong>Urgency:</strong> ${booking.urgency}</p>
            <p><strong>Duration:</strong> ${booking.duration_minutes} minutes</p>
            <p><strong>Price:</strong> $${booking.price}</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/interpreter/bookings/${booking.id}" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Request
            </a>
          </div>
        `
      });
    }

    // SMS notifications disabled for now
    // TODO: Add SMS notifications when needed

  } catch (error) {
    console.error('Notification error:', error);
  }
}
