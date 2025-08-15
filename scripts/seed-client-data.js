const { PrismaClient } = require('@prisma/client');

async function seedClientData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🌱 Starting data seeding for client profiles and sessions...');
    
    // Get all users with CLIENT role who don't have profiles
    const clientUsers = await prisma.user.findMany({
      where: {
        role: 'CLIENT',
        clientProfile: null
      }
    });
    
    console.log(`Found ${clientUsers.length} client users without profiles`);
    
    for (const user of clientUsers) {
      console.log(`Creating profile for ${user.email}...`);
      
      // Create client profile
      const clientProfile = await prisma.clientProfile.create({
        data: {
          userId: user.id,
          firstName: user.name?.split(' ')[0] || 'User',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          primaryLanguage: 'English',
          emailNotifications: true,
          smsNotifications: false,
          sessionReminders: true,
          marketingEmails: false,
          isActive: true,
          lastLoginAt: new Date()
        }
      });
      
      // Create usage tracking
      await prisma.clientUsage.create({
        data: {
          clientProfileId: clientProfile.id,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          minutesUsed: Math.floor(Math.random() * 50), // Random usage 0-50 minutes
          minutesRemaining: 50,
          sessionsThisPeriod: Math.floor(Math.random() * 5),
          totalMinutesAllTime: Math.floor(Math.random() * 200),
          totalSessionsAllTime: Math.floor(Math.random() * 15),
          totalSpentAllTime: Math.floor(Math.random() * 500),
          vriMinutes: Math.floor(Math.random() * 30),
          opiMinutes: Math.floor(Math.random() * 20)
        }
      });
      
      // Create a free trial subscription
      await prisma.clientSubscription.create({
        data: {
          clientProfileId: clientProfile.id,
          planId: 'free-trial',
          planName: 'Free Trial',
          status: 'TRIAL',
          monthlyPrice: 0.00,
          currency: 'USD',
          billingCycle: 'monthly',
          minutesIncluded: 100,
          minutesUsed: Math.floor(Math.random() * 30),
          minutesRemaining: 100 - Math.floor(Math.random() * 30),
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          startDate: new Date()
        }
      });
      
      // Create some sample sessions
      const sampleSessions = [
        {
          sessionType: 'VRI',
          languageFrom: 'English',
          languageTo: 'Spanish',
          specialization: 'Medical',
          status: 'COMPLETED',
          interpreterName: 'Maria Rodriguez',
          duration: 45,
          clientRating: 5,
          totalCost: 37.50,
          scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          endedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
          hasRecording: true,
          clientFeedback: 'Excellent interpreter, very professional'
        },
        {
          sessionType: 'OPI',
          languageFrom: 'English',
          languageTo: 'French',
          specialization: 'Business',
          status: 'COMPLETED',
          interpreterName: 'Jean Dupont',
          duration: 30,
          clientRating: 4,
          totalCost: 25.00,
          scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          endedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000),
          hasRecording: false,
          clientFeedback: 'Good session, clear communication'
        },
        {
          sessionType: 'VRI',
          languageFrom: 'English',
          languageTo: 'German',
          specialization: 'Legal',
          status: 'CONFIRMED',
          interpreterName: 'Hans Mueller',
          duration: null,
          scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          hasRecording: false,
          notes: 'Contract review session'
        }
      ];
      
      for (const sessionData of sampleSessions) {
        await prisma.clientSession.create({
          data: {
            clientProfileId: clientProfile.id,
            ...sessionData,
            requestedAt: sessionData.scheduledAt || new Date(),
            hourlyRate: 50.00,
            minutesCharged: sessionData.duration || 0
          }
        });
      }
      
      console.log(`✅ Created profile and sample data for ${user.email}`);
    }
    
    console.log('🎉 Data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Only run if called directly
if (require.main === module) {
  seedClientData();
}

module.exports = { seedClientData };
