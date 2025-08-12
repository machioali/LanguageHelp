const fetch = require('node-fetch');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function testAnalyticsAPI() {
  try {
    console.log('🧪 Testing Analytics API with real session data...\n');

    // Find an interpreter in the database
    const interpreter = await prisma.user.findFirst({
      where: { role: 'INTERPRETER' },
      include: {
        interpreterProfile: {
          include: {
            sessions: true,
            languages: true,
            specializations: true
          }
        }
      }
    });

    if (!interpreter || !interpreter.interpreterProfile) {
      console.log('❌ No interpreter found in database');
      return;
    }

    console.log(`👤 Testing with interpreter: ${interpreter.interpreterProfile.firstName} ${interpreter.interpreterProfile.lastName}`);
    console.log(`📊 Sessions in database: ${interpreter.interpreterProfile.sessions.length}`);
    console.log(`🗣️ Languages: ${interpreter.interpreterProfile.languages.map(l => l.languageName).join(', ')}`);
    console.log(`🎯 Specializations: ${interpreter.interpreterProfile.specializations.map(s => s.specialization).join(', ')}\n`);

    // Create a JWT token for authentication (simulating login)
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      {
        userId: interpreter.id,
        email: interpreter.email,
        role: interpreter.role
      },
      secret,
      { expiresIn: '1h' }
    );

    // Test Analytics API
    console.log('🔍 Testing Analytics API...');
    const analyticsResponse = await fetch('http://localhost:3000/api/interpreter/analytics?timeRange=last30days', {
      method: 'GET',
      headers: {
        'Cookie': `auth-token=${token}`
      }
    });

    if (analyticsResponse.ok) {
      const analyticsData = await analyticsResponse.json();
      console.log('✅ Analytics API Response:');
      console.log(`   📈 Success: ${analyticsData.success}`);
      console.log(`   💰 Total Earnings: $${analyticsData.data.overview.totalEarnings}`);
      console.log(`   🎯 Total Sessions: ${analyticsData.data.overview.totalSessions}`);
      console.log(`   ⭐ Average Rating: ${analyticsData.data.overview.avgRating}`);
      console.log(`   ⏰ Total Hours: ${analyticsData.data.overview.totalHours}`);
      console.log(`   📊 Completion Rate: ${analyticsData.data.performanceMetrics.completionRate}%`);
      console.log(`   🏆 Top Languages: ${analyticsData.data.topLanguages.map(l => `${l.language} (${l.sessions} sessions)`).join(', ')}`);
    } else {
      const error = await analyticsResponse.text();
      console.log('❌ Analytics API Error:', error);
    }

    console.log('\n🔍 Testing Sessions API...');
    const sessionsResponse = await fetch('http://localhost:3000/api/interpreter/sessions?dateRange=last30days', {
      method: 'GET',
      headers: {
        'Cookie': `auth-token=${token}`
      }
    });

    if (sessionsResponse.ok) {
      const sessionsData = await sessionsResponse.json();
      console.log('✅ Sessions API Response:');
      console.log(`   📈 Success: ${sessionsData.success}`);
      console.log(`   📊 Total Sessions: ${sessionsData.data.summary.totalSessions}`);
      console.log(`   ✅ Completed: ${sessionsData.data.summary.completedSessions}`);
      console.log(`   💰 Total Earnings: $${sessionsData.data.summary.totalEarnings}`);
      console.log(`   ⭐ Average Rating: ${sessionsData.data.summary.avgRating}`);
      console.log(`   📝 Reports Count: ${sessionsData.data.reports.length}`);
      
      if (sessionsData.data.reports.length > 0) {
        console.log('   📋 Sample Sessions:');
        sessionsData.data.reports.slice(0, 3).forEach((session, i) => {
          console.log(`     ${i+1}. ${session.date} - ${session.client} (${session.language}) - ${session.status} - ${session.earnings}`);
        });
      }
    } else {
      const error = await sessionsResponse.text();
      console.log('❌ Sessions API Error:', error);
    }

    console.log('\n🎉 API Testing completed!');

  } catch (error) {
    console.error('❌ Error testing APIs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  testAnalyticsAPI()
    .then(() => {
      console.log('✅ Testing completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Testing failed:', error);
      process.exit(1);
    });
}

module.exports = { testAnalyticsAPI };
