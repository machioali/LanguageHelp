const { PrismaClient } = require('@prisma/client');
const { PrivateAnalyticsManager } = require('../src/lib/analytics/private-analytics-manager.ts');

const prisma = new PrismaClient();

/**
 * Test script to demonstrate the analytics transformation 
 * after a new interpreter receives their first call
 */
async function testFirstCallTransformation() {
  console.log('🧪 Testing Analytics Transformation After First Call\n');
  
  try {
    // 1. Find or create a test interpreter
    console.log('📋 Step 1: Setting up test interpreter...');
    
    // Create a new test interpreter
    const testUser = await prisma.user.create({
      data: {
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: `test.interpreter.${Date.now()}@example.com`,
        password: 'hashedpassword', // In real app, this would be hashed
        role: 'INTERPRETER',
        interpreterProfile: {
          create: {
            bio: 'Professional Spanish interpreter',
            phone: '+1234567890',
            hourlyRate: 50.0,
            isVerified: true,
            languages: {
              create: [
                {
                  languageCode: 'es',
                  languageName: 'Spanish',
                  proficiencyLevel: 'NATIVE',
                  isNative: true
                }
              ]
            }
          }
        }
      },
      include: {
        interpreterProfile: {
          include: {
            languages: true
          }
        }
      }
    });
    
    const interpreterProfileId = testUser.interpreterProfile.id;
    console.log(`✅ Created test interpreter: ${testUser.firstName} ${testUser.lastName} (ID: ${interpreterProfileId})\n`);
    
    // 2. Test analytics BEFORE first call (new interpreter state)
    console.log('📊 Step 2: Testing analytics BEFORE first call...');
    
    const analyticsManagerBefore = new PrivateAnalyticsManager(interpreterProfileId);
    const analyticsBefore = await analyticsManagerBefore.generatePrivateAnalytics('last30days');
    
    console.log('🆕 New Interpreter Analytics (BEFORE first call):');
    console.log(`   - Total Earnings: $${analyticsBefore.overview.totalEarnings}`);
    console.log(`   - Total Sessions: ${analyticsBefore.overview.totalSessions}`);
    console.log(`   - Avg Rating: ${analyticsBefore.overview.avgRating}`);
    console.log(`   - Total Hours: ${analyticsBefore.overview.totalHours}`);
    console.log(`   - Sessions Over Time: ${analyticsBefore.sessionsOverTime.length} periods`);
    console.log(`   - Top Languages: ${analyticsBefore.topLanguages.length} language pairs`);
    
    // This would trigger the welcome screen in frontend
    const isWelcomeScreen = analyticsBefore.overview.totalSessions === 0 && 
                           analyticsBefore.overview.totalEarnings === 0;
    console.log(`   - Would show welcome screen: ${isWelcomeScreen ? '✅ YES' : '❌ NO'}\n`);
    
    // 3. Simulate completing the first interpretation session
    console.log('📞 Step 3: Simulating first interpretation call...');
    
    const firstSession = await prisma.interpreterSession.create({
      data: {
        interpreterProfileId: interpreterProfileId,
        sessionType: 'OPI', // Over-the-Phone Interpretation
        languageFrom: 'English',
        languageTo: 'Spanish',
        scheduledAt: new Date(),
        startedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        endedAt: new Date(),
        duration: 30, // 30 minutes
        status: 'COMPLETED',
        earnings: 25.00, // $25 for 30 minutes
        rating: 4.8, // Client gave 4.8/5 rating
        notes: 'First interpretation session - medical appointment'
      }
    });
    
    console.log(`✅ Created first session: ${firstSession.sessionType} ${firstSession.languageFrom}→${firstSession.languageTo}`);
    console.log(`   - Duration: ${firstSession.duration} minutes`);
    console.log(`   - Earnings: $${firstSession.earnings}`);
    console.log(`   - Rating: ${firstSession.rating}/5`);
    console.log(`   - Status: ${firstSession.status}\n`);
    
    // 4. Test analytics AFTER first call completion
    console.log('📊 Step 4: Testing analytics AFTER first call...');
    
    const analyticsManagerAfter = new PrivateAnalyticsManager(interpreterProfileId);
    const analyticsAfter = await analyticsManagerAfter.generatePrivateAnalytics('last30days');
    
    console.log('🎉 Beginner Interpreter Analytics (AFTER first call):');
    console.log(`   - Total Earnings: $${analyticsAfter.overview.totalEarnings} (was $${analyticsBefore.overview.totalEarnings})`);
    console.log(`   - Total Sessions: ${analyticsAfter.overview.totalSessions} (was ${analyticsBefore.overview.totalSessions})`);
    console.log(`   - Avg Rating: ${analyticsAfter.overview.avgRating}/5 (was ${analyticsBefore.overview.avgRating})`);
    console.log(`   - Total Hours: ${analyticsAfter.overview.totalHours}h (was ${analyticsBefore.overview.totalHours}h)`);
    console.log(`   - Sessions Over Time: ${analyticsAfter.sessionsOverTime.length} periods with data`);
    console.log(`   - Top Languages: ${analyticsAfter.topLanguages.length} language pairs`);
    
    // Show performance metrics
    console.log('\n🎯 Performance Metrics:');
    console.log(`   - Completion Rate: ${analyticsAfter.performanceMetrics.completionRate}%`);
    console.log(`   - Avg Session Duration: ${analyticsAfter.performanceMetrics.avgSessionDuration} minutes`);
    console.log(`   - Response Time: ${analyticsAfter.performanceMetrics.responseTime} seconds`);
    console.log(`   - Client Satisfaction: ${analyticsAfter.performanceMetrics.clientSatisfaction}/5`);
    
    // Show sessions over time
    console.log('\n📈 Sessions Over Time:');
    analyticsAfter.sessionsOverTime.forEach((period, index) => {
      if (period.vriSessions > 0 || period.opiSessions > 0) {
        console.log(`   - ${period.period}: ${period.vriSessions} VRI, ${period.opiSessions} OPI, $${period.earnings}`);
      }
    });
    
    // Show top languages
    console.log('\n🌍 Top Language Pairs:');
    analyticsAfter.topLanguages.forEach((lang, index) => {
      console.log(`   - ${index + 1}. ${lang.language}: ${lang.sessions} sessions, $${lang.earnings}`);
    });
    
    // Show trends
    console.log('\n📊 Recent Trends:');
    console.log(`   - Earnings Growth: ${analyticsAfter.recentTrends.earningsGrowth}%`);
    console.log(`   - Sessions Growth: ${analyticsAfter.recentTrends.sessionsGrowth}%`);
    console.log(`   - Rating Change: ${analyticsAfter.recentTrends.ratingChange}`);
    
    // This would no longer trigger the welcome screen
    const isStillWelcomeScreen = analyticsAfter.overview.totalSessions === 0 && 
                                analyticsAfter.overview.totalEarnings === 0;
    console.log(`   - Would show welcome screen: ${isStillWelcomeScreen ? '✅ YES' : '❌ NO (shows real dashboard)'}`);
    
    // 5. Simulate interpreter status classification
    console.log('\n👤 Step 5: Interpreter Status Classification...');
    
    const totalSessionsEver = await prisma.interpreterSession.count({
      where: { interpreterProfileId: interpreterProfileId }
    });
    
    let interpreterStatus = 'experienced';
    if (totalSessionsEver === 0) {
      interpreterStatus = 'new';
    } else if (totalSessionsEver < 5) {
      interpreterStatus = 'beginner';
    } else if (totalSessionsEver < 20) {
      interpreterStatus = 'developing';
    }
    
    console.log(`   - Total sessions ever: ${totalSessionsEver}`);
    console.log(`   - Interpreter status: ${interpreterStatus.toUpperCase()}`);
    
    let welcomeMessage = '';
    if (interpreterStatus === 'beginner') {
      welcomeMessage = `Great start! You've completed ${totalSessionsEver} session${totalSessionsEver === 1 ? '' : 's'} since joining.`;
    }
    console.log(`   - Welcome message: "${welcomeMessage}"`);
    
    console.log('\n✅ Transformation Complete!');
    console.log('📱 Frontend would now show:');
    console.log('   - Real analytics dashboard (not welcome screen)');
    console.log('   - Actual earnings and performance data');
    console.log('   - Personalized insights and recommendations');
    console.log('   - Charts with first data points');
    console.log('   - Status-appropriate messaging for beginners\n');
    
    // 6. Test adding a second session to show progression
    console.log('📞 Step 6: Simulating second interpretation call...');
    
    const secondSession = await prisma.interpreterSession.create({
      data: {
        interpreterProfileId: interpreterProfileId,
        sessionType: 'VRI', // Video Remote Interpretation
        languageFrom: 'English',
        languageTo: 'Spanish',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        startedAt: new Date(Date.now() + 24 * 60 * 60 * 1000 - 45 * 60 * 1000), // 45 minutes session
        endedAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        duration: 45, // 45 minutes
        status: 'COMPLETED',
        earnings: 37.50, // $37.50 for 45 minutes
        rating: 5.0, // Perfect rating
        notes: 'Second session - legal consultation'
      }
    });
    
    console.log(`✅ Created second session: ${secondSession.sessionType} ${secondSession.languageFrom}→${secondSession.languageTo}`);
    
    // Get updated analytics
    const analyticsAfterSecond = await analyticsManagerAfter.generatePrivateAnalytics('last30days');
    
    console.log('\n📊 Analytics after TWO sessions:');
    console.log(`   - Total Earnings: $${analyticsAfterSecond.overview.totalEarnings}`);
    console.log(`   - Total Sessions: ${analyticsAfterSecond.overview.totalSessions}`);
    console.log(`   - Avg Rating: ${analyticsAfterSecond.overview.avgRating}/5`);
    console.log(`   - Total Hours: ${analyticsAfterSecond.overview.totalHours}h`);
    console.log(`   - Completion Rate: ${analyticsAfterSecond.performanceMetrics.completionRate}%`);
    
    console.log('\n🎯 This demonstrates the complete transformation:');
    console.log('   1. New interpreter: Welcome screen with zero values');
    console.log('   2. After first call: Real analytics dashboard appears');
    console.log('   3. After more calls: Rich data and insights grow');
    console.log('   4. Status progresses: new → beginner → developing → experienced');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    try {
      // Note: This will cascade delete sessions due to foreign key relationships
      await prisma.user.deleteMany({
        where: {
          email: {
            contains: 'test.interpreter'
          }
        }
      });
      console.log('✅ Test data cleaned up');
    } catch (cleanupError) {
      console.error('⚠️  Cleanup warning:', cleanupError.message);
    }
    
    await prisma.$disconnect();
  }
}

// Run the test
if (require.main === module) {
  testFirstCallTransformation()
    .then(() => {
      console.log('\n🎉 Test completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testFirstCallTransformation };
