import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { AgoraAPI } from '@/lib/agora';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);
const agoraAPI = new AgoraAPI();

interface BookingResponse {
  action: 'accept' | 'decline';
  message?: string;
}

// POST /api/bookings/[id]/respond - Accept or decline a booking
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, message }: BookingResponse = await request.json();
    const interpreterUserId = request.headers.get('user-id');
    const bookingId = params.id;

    if (!interpreterUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('booking_requests')
      .select(`
        *, 
        client:users!booking_requests_client_id_fkey(id, name, email, phone),
        interpreter:interpreters!booking_requests_interpreter_id_fkey(
          user_id, 
          users!interpreters_user_id_fkey(name, email)
        )
      `)
      .eq('id', bookingId)
      .eq('status', 'pending')
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Verify this interpreter owns the booking
    if (booking.interpreter.user_id !== interpreterUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (action === 'accept') {
      // Accept the booking and cancel other pending requests
      const { error: updateError } = await supabase
        .from('booking_requests')
        .update({ status: 'accepted', updated_at: new Date().toISOString() })
        .eq('id', bookingId);

      if (updateError) {
        return NextResponse.json({ error: 'Failed to accept booking' }, { status: 500 });
      }

      // Cancel other pending requests for same client/time
      await supabase
        .from('booking_requests')
        .update({ status: 'cancelled' })
        .eq('client_id', booking.client_id)
        .eq('scheduled_at', booking.scheduled_at)
        .neq('id', bookingId)
        .eq('status', 'pending');

      // Create communication session
      const session = await createCommunicationSession(booking);
      
      // Notify client
      await notifyClient(booking, 'accepted', session);

      return NextResponse.json({
        message: 'Booking accepted successfully',
        session,
        booking: { ...booking, status: 'accepted' }
      });

    } else if (action === 'decline') {
      // Decline the booking
      const { error: updateError } = await supabase
        .from('booking_requests')
        .update({ 
          status: 'declined', 
          updated_at: new Date().toISOString(),
          interpreter_message: message 
        })
        .eq('id', bookingId);

      if (updateError) {
        return NextResponse.json({ error: 'Failed to decline booking' }, { status: 500 });
      }

      // Notify client
      await notifyClient(booking, 'declined');

      // Try to find alternative interpreters
      await findAlternativeInterpreters(booking);

      return NextResponse.json({
        message: 'Booking declined',
        booking: { ...booking, status: 'declined' }
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Booking response error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking response' },
      { status: 500 }
    );
  }
}

async function createCommunicationSession(booking: any) {
  try {
    let roomId = null;
    let joinUrl = null;

    if (booking.session_type === 'video') {
      // Create Agora channel
      roomId = `session_${booking.id}_${Date.now()}`;
      
      // Generate tokens for both participants
      const clientToken = await agoraAPI.generateToken(roomId, booking.client_id);
      const interpreterToken = await agoraAPI.generateToken(roomId, booking.interpreter.user_id);
      
      joinUrl = `${process.env.NEXT_PUBLIC_APP_URL}/session/${roomId}`;

      // Store session details
      const { data: session } = await supabase
        .from('sessions')
        .insert({
          booking_id: booking.id,
          room_id: roomId,
          status: 'waiting',
          client_token: clientToken,
          interpreter_token: interpreterToken
        })
        .select()
        .single();

      return {
        id: session.id,
        roomId,
        joinUrl,
        type: 'video',
        clientToken,
        interpreterToken
      };

    } else if (booking.session_type === 'phone') {
      // Create Twilio conference
      const conference = await createTwilioConference(booking);
      
      return {
        id: conference.id,
        roomId: conference.sid,
        type: 'phone',
        conferenceId: conference.sid
      };
    }

    return null;
  } catch (error) {
    console.error('Session creation error:', error);
    return null;
  }
}

async function createTwilioConference(booking: any) {
  const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
  
  // Create conference
  const conference = await twilio.conferences.create({
    friendlyName: `Session ${booking.id}`,
    record: true,
    statusCallback: `${process.env.NEXT_PUBLIC_APP_URL}/api/twilio/conference-status`
  });

  // Call both participants
  await Promise.all([
    // Call client
    twilio.calls.create({
      to: booking.client.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      twiml: `<Response><Dial><Conference>${conference.sid}</Conference></Dial></Response>`
    }),
    // Call interpreter
    twilio.calls.create({
      to: booking.interpreter.users.phone,
      from: process.env.TWILIO_PHONE_NUMBER,
      twiml: `<Response><Dial><Conference>${conference.sid}</Conference></Dial></Response>`
    })
  ]);

  return conference;
}

async function notifyClient(booking: any, status: 'accepted' | 'declined', session?: any) {
  try {
    const isAccepted = status === 'accepted';
    
    // Create notification
    await supabase.from('notifications').insert({
      user_id: booking.client_id,
      type: `booking_${status}`,
      title: isAccepted ? '✅ Interpreter Found!' : '❌ Booking Declined',
      message: isAccepted 
        ? `${booking.interpreter.users.name} accepted your interpretation request`
        : `Your interpretation request was declined`,
      data: { booking_id: booking.id, session_id: session?.id }
    });

    // Send email
    await resend.emails.send({
      from: 'LanguageHelp <notifications@languagehelp.com>',
      to: booking.client.email,
      subject: isAccepted ? '🎉 Interpreter Found!' : 'Booking Update',
      html: isAccepted ? `
        <div>
          <h2>Great news! Your interpreter is ready</h2>
          <p><strong>Interpreter:</strong> ${booking.interpreter.users.name}</p>
          <p><strong>Languages:</strong> ${booking.source_language} → ${booking.target_language}</p>
          <p><strong>Session:</strong> ${booking.session_type}</p>
          
          ${session?.joinUrl ? `
            <a href="${session.joinUrl}" 
               style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
              Join Session Now
            </a>
          ` : ''}
          
          <p>Your session will begin shortly. Please be ready!</p>
        </div>
      ` : `
        <div>
          <h2>Booking Update</h2>
          <p>Unfortunately, your interpretation request was declined.</p>
          <p>We're searching for alternative interpreters for you.</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/bookings" 
             style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Booking Status
          </a>
        </div>
      `
    });

    // Send SMS for urgent accepted bookings
    if (isAccepted && booking.urgency === 'immediate' && booking.client.phone) {
      const twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
      
      await twilioClient.messages.create({
        body: `LanguageHelp: Interpreter found! ${session?.joinUrl ? `Join: ${session.joinUrl}` : 'Check your email for session details.'}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: booking.client.phone
      });
    }

  } catch (error) {
    console.error('Client notification error:', error);
  }
}

async function findAlternativeInterpreters(originalBooking: any) {
  // Find other interpreters and send them the request
  const { data: alternativeInterpreters } = await supabase
    .from('interpreters')
    .select('id, user_id, users!interpreters_user_id_fkey(name, email, phone)')
    .eq('verification_status', 'verified')
    .contains('languages', [originalBooking.source_language, originalBooking.target_language])
    .neq('id', originalBooking.interpreter_id)
    .limit(2);

  if (alternativeInterpreters?.length) {
    // Create new booking requests
    for (const interpreter of alternativeInterpreters) {
      const { data: newBooking } = await supabase
        .from('booking_requests')
        .insert({
          client_id: originalBooking.client_id,
          interpreter_id: interpreter.id,
          source_language: originalBooking.source_language,
          target_language: originalBooking.target_language,
          session_type: originalBooking.session_type,
          scheduled_at: originalBooking.scheduled_at,
          duration_minutes: originalBooking.duration_minutes,
          urgency: originalBooking.urgency,
          description: originalBooking.description,
          special_requirements: originalBooking.special_requirements,
          price: originalBooking.price,
          status: 'pending'
        })
        .select()
        .single();

      if (newBooking) {
        // Send notification to alternative interpreter
        await sendAlternativeInterpreterNotification(interpreter, newBooking);
      }
    }
  }
}

async function sendAlternativeInterpreterNotification(interpreter: any, booking: any) {
  // Similar to original notification but marked as "alternative request"
  await supabase.from('notifications').insert({
    user_id: interpreter.user_id,
    type: 'booking_request_alternative',
    title: 'Alternative Interpretation Request',
    message: `Backup request for ${booking.source_language} → ${booking.target_language} (original interpreter unavailable)`,
    data: { booking_id: booking.id }
  });
}
