import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Free booking system using JSON file storage (no database costs)
const BOOKINGS_FILE = path.join(process.cwd(), 'data', 'bookings.json');
const INTERPRETERS_FILE = path.join(process.cwd(), 'data', 'interpreters.json');
const NOTIFICATIONS_FILE = path.join(process.cwd(), 'data', notifications.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read JSON file with error handling
const readJsonFile = (filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

// Write JSON file with error handling
const writeJsonFile = (filePath: string, data: any) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Generate unique ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

interface BookingRequest {
  sourceLanguage: string;
  targetLanguage: string;
  sessionType: 'video' | 'phone';
  urgency: 'immediate' | 'within_hour' | 'scheduled';
  scheduledAt?: string;
  duration: number;
  description?: string;
  clientName: string;
  clientEmail: string;
}

// POST /api/free-bookings - Create a new booking request
export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();
    const bookingId = generateId();
    
    // Read existing data
    const bookings = readJsonFile(BOOKINGS_FILE);
    const interpreters = readJsonFile(INTERPRETERS_FILE);
    
    // Find interpreters for language pair
    const availableInterpreters = interpreters.filter((interpreter: any) => 
      interpreter.languages.includes(body.sourceLanguage) && 
      interpreter.languages.includes(body.targetLanguage) &&
      interpreter.status === 'available'
    );

    if (availableInterpreters.length === 0) {
      return NextResponse.json({
        error: 'No interpreters available for this language pair'
      }, { status: 404 });
    }

    // Create booking entry
    const newBooking = {
      id: bookingId,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      sourceLanguage: body.sourceLanguage,
      targetLanguage: body.targetLanguage,
      sessionType: body.sessionType,
      urgency: body.urgency,
      scheduledAt: body.scheduledAt,
      duration: body.duration,
      description: body.description,
      status: 'pending',
      interpretersNotified: availableInterpreters.map((i: any) => i.id),
      createdAt: new Date().toISOString(),
      sessionLink: null
    };

    // Add to bookings
    bookings.push(newBooking);
    writeJsonFile(BOOKINGS_FILE, bookings);

    // Create notifications for interpreters (simple in-app notifications)
    const notifications = readJsonFile(NOTIFICATIONS_FILE);
    availableInterpreters.forEach((interpreter: any) => {
      notifications.push({
        id: generateId(),
        userId: interpreter.id,
        type: 'booking_request',
        title: 'New Interpretation Request',
        message: `${body.clientName} needs ${body.sourceLanguage} → ${body.targetLanguage} interpretation`,
        bookingId: bookingId,
        read: false,
        createdAt: new Date().toISOString()
      });
    });
    writeJsonFile(NOTIFICATIONS_FILE, notifications);

    // Send simple email notification (console log for demo)
    console.log('📧 Email Notification (Free Mode):');
    console.log(`To: ${availableInterpreters.map((i: any) => i.email).join(', ')}`);
    console.log(`Subject: New Interpretation Request - ${body.sourceLanguage} to ${body.targetLanguage}`);
    console.log(`Booking ID: ${bookingId}`);
    console.log(`Client: ${body.clientName}`);
    console.log(`---`);

    return NextResponse.json({
      message: 'Booking request created successfully',
      bookingId,
      interpretersNotified: availableInterpreters.length,
      // In free mode, provide direct contact info instead of automated system
      interpreters: availableInterpreters.map((i: any) => ({
        id: i.id,
        name: i.name,
        email: i.email,
        rating: i.rating,
        languages: i.languages
      }))
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking request' },
      { status: 500 }
    );
  }
}

// GET /api/free-bookings - Get all bookings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userType = searchParams.get('userType');
    const userId = searchParams.get('userId');
    
    const bookings = readJsonFile(BOOKINGS_FILE);
    const interpreters = readJsonFile(INTERPRETERS_FILE);
    
    let filteredBookings = bookings;
    
    if (userType === 'interpreter' && userId) {
      // Show bookings where this interpreter was notified or accepted
      filteredBookings = bookings.filter((booking: any) => 
        booking.interpretersNotified?.includes(userId) || 
        booking.acceptedBy === userId
      );
    }
    
    // Add interpreter details to bookings
    const enrichedBookings = filteredBookings.map((booking: any) => {
      if (booking.acceptedBy) {
        const interpreter = interpreters.find((i: any) => i.id === booking.acceptedBy);
        return {
          ...booking,
          interpreter: interpreter ? {
            name: interpreter.name,
            email: interpreter.email,
            rating: interpreter.rating
          } : null
        };
      }
      return booking;
    });
    
    return NextResponse.json({ 
      bookings: enrichedBookings.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    });

  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// PUT /api/free-bookings/[id] - Update booking status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, action, interpreterId, interpreterName } = body;
    
    const bookings = readJsonFile(BOOKINGS_FILE);
    const interpreters = readJsonFile(INTERPRETERS_FILE);
    
    const bookingIndex = bookings.findIndex((b: any) => b.id === bookingId);
    if (bookingIndex === -1) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    
    const booking = bookings[bookingIndex];
    
    if (action === 'accept') {
      // Accept booking
      booking.status = 'accepted';
      booking.acceptedBy = interpreterId;
      booking.acceptedAt = new Date().toISOString();
      
      // Generate session link (free video session)
      const sessionId = generateId();
      booking.sessionLink = `/free-session/${sessionId}`;
      booking.sessionId = sessionId;
      
      // Update interpreter status
      const interpreterIndex = interpreters.findIndex((i: any) => i.id === interpreterId);
      if (interpreterIndex !== -1) {
        interpreters[interpreterIndex].status = 'busy';
        interpreters[interpreterIndex].currentBooking = bookingId;
      }
      
      console.log('✅ Booking Accepted (Free Mode):');
      console.log(`Booking: ${bookingId}`);
      console.log(`Interpreter: ${interpreterName}`);
      console.log(`Session Link: ${booking.sessionLink}`);
      console.log(`📧 Email would be sent to client: ${booking.clientEmail}`);
      console.log(`---`);
      
    } else if (action === 'decline') {
      // Remove this interpreter from notified list
      booking.interpretersNotified = booking.interpretersNotified?.filter(
        (id: string) => id !== interpreterId
      ) || [];
      
      // If no more interpreters, mark as no_interpreters_available
      if (booking.interpretersNotified.length === 0) {
        booking.status = 'no_interpreters_available';
      }
      
      console.log('❌ Booking Declined (Free Mode):');
      console.log(`Booking: ${bookingId}`);
      console.log(`Interpreter: ${interpreterName}`);
      console.log(`---`);
    }
    
    // Save updated data
    bookings[bookingIndex] = booking;
    writeJsonFile(BOOKINGS_FILE, bookings);
    writeJsonFile(INTERPRETERS_FILE, interpreters);
    
    return NextResponse.json({
      message: `Booking ${action}ed successfully`,
      booking,
      sessionLink: booking.sessionLink
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
