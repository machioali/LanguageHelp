const { PrismaClient } = require('@prisma/client');
// We'll simulate the token creation instead
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production';

function createJWTToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

function verifyJWTToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

const prisma = new PrismaClient();

async function debugSessionsAPI() {
  try {
    console.log('🔍 Debugging interpreter sessions API...\n');

    // Get the first interpreter
    const interpreter = await prisma.user.findFirst({
      where: { role: 'INTERPRETER' },
      include: {
        interpreterProfile: {
          include: {
            languages: true,
            sessions: {
              take: 5,
              orderBy: { scheduledAt: 'desc' }
            }
          }
        }
      }
    });

    if (!interpreter || !interpreter.interpreterProfile) {
      console.log('❌ No interpreter found');
      return;
    }

    console.log(`👤 Found interpreter: ${interpreter.interpreterProfile.firstName} ${interpreter.interpreterProfile.lastName}`);
    console.log(`📧 Email: ${interpreter.email}`);
    console.log(`🆔 User ID: ${interpreter.id}`);
    console.log(`🆔 Profile ID: ${interpreter.interpreterProfile.id}`);

    // Create a test JWT token (simulate what would happen during login)
    const testToken = createJWTToken({
      userId: interpreter.id,
      email: interpreter.email,
      role: interpreter.role,
      interpreterProfileId: interpreter.interpreterProfile.id
    });

    console.log(`🔐 Test JWT Token created: ${testToken.substring(0, 50)}...`);

    // Verify the token
    try {
      const decoded = verifyJWTToken(testToken);
      console.log('✅ Token verification successful');
      console.log('📋 Token payload:', {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        interpreterProfileId: decoded.interpreterProfileId
      });
    } catch (error) {
      console.log('❌ Token verification failed:', error.message);
      return;
    }

    // Get session count for this interpreter
    const totalSessions = await prisma.interpreterSession.count({
      where: { interpreterProfileId: interpreter.interpreterProfile.id }
    });

    console.log(`\n📊 Session data for this interpreter:`);
    console.log(`   Total sessions: ${totalSessions}`);

    if (totalSessions > 0) {
      // Get last 30 days sessions
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentSessions = await prisma.interpreterSession.findMany({
        where: {
          interpreterProfileId: interpreter.interpreterProfile.id,
          scheduledAt: {
            gte: thirtyDaysAgo
          }
        },
        orderBy: { scheduledAt: 'desc' },
        take: 5
      });

      console.log(`   Sessions in last 30 days: ${recentSessions.length}`);
      console.log('\n   Sample sessions:');
      
      recentSessions.forEach((session, index) => {
        console.log(`   ${index + 1}. ${session.sessionType}: ${session.languageFrom} → ${session.languageTo}`);
        console.log(`      Client: ${session.clientName}`);
        console.log(`      Status: ${session.status}`);
        console.log(`      Date: ${session.scheduledAt.toISOString().split('T')[0]}`);
        console.log(`      Earnings: $${session.earnings}`);
        console.log('');
      });

      // Test the same logic as the API
      const reports = recentSessions.map((session) => {
        const sessionDate = new Date(session.scheduledAt);
        const startTime = sessionDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
        
        let endTime = '-';
        if (session.endedAt) {
          const endDate = new Date(session.endedAt);
          endTime = endDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          });
        }
        
        const statusMap = {
          'COMPLETED': 'Completed',
          'CANCELLED': 'Cancelled',
          'NO_SHOW': 'No-Show',
          'SCHEDULED': 'Scheduled',
          'IN_PROGRESS': 'In Progress'
        };
        
        return {
          id: session.id,
          date: sessionDate.toISOString().split('T')[0],
          startTime,
          endTime,
          duration: session.duration ? `${session.duration} min` : '-',
          type: session.sessionType,
          language: `${session.languageFrom} → ${session.languageTo}`,
          client: session.clientName,
          status: statusMap[session.status] || session.status,
          rating: session.rating,
          earnings: '$' + session.earnings.toFixed(2),
          notes: session.notes,
          cancellationReason: session.cancellationReason
        };
      });

      console.log('\n🔧 API Response Preview (first 2 sessions):');
      reports.slice(0, 2).forEach((report, index) => {
        console.log(`   Session ${index + 1}:`);
        console.log(`     Date: ${report.date}`);
        console.log(`     Type: ${report.type}`);
        console.log(`     Language: ${report.language}`);
        console.log(`     Client: ${report.client}`);
        console.log(`     Status: ${report.status}`);
        console.log(`     Earnings: ${report.earnings}`);
        console.log('');
      });

      // Calculate summary (same as API)
      const completedSessions = reports.filter(r => r.status === 'Completed').length;
      const totalEarnings = reports
        .filter(r => r.status === 'Completed')
        .reduce((sum, r) => sum + parseFloat(r.earnings.replace('$', '')), 0);
      
      const summary = {
        totalSessions: reports.length,
        completedSessions,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        avgRating: 4.2, // Sample
        totalHours: 10.5, // Sample
        completionRate: reports.length > 0 ? Math.round((completedSessions / reports.length) * 100) : 0
      };

      console.log('\n📈 Summary that would be returned:');
      console.log(`     Total Sessions: ${summary.totalSessions}`);
      console.log(`     Completed: ${summary.completedSessions}`);
      console.log(`     Total Earnings: $${summary.totalEarnings}`);
      console.log(`     Completion Rate: ${summary.completionRate}%`);
      
    } else {
      console.log('   ⚠️ No session data found for this interpreter');
      console.log('   💡 Try running: node scripts/seed-session-data.js');
    }

    console.log('\n✅ API debug complete');
    console.log('\n🔗 To test the actual API:');
    console.log('1. Sign in as interpreter through the web interface');
    console.log('2. Check browser dev tools → Network tab when visiting reports page');
    console.log('3. Look for the /api/interpreter/sessions request');
    console.log('4. Check if cookies (auth-token) are being sent');

  } catch (error) {
    console.error('❌ Debug failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugSessionsAPI();
