const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedSessionData() {
  try {
    console.log('🌱 Starting session data seeding...');

    // Get all interpreters
    const interpreters = await prisma.interpreterProfile.findMany({
      include: {
        user: true,
        languages: true,
        specializations: true
      }
    });

    console.log(`Found ${interpreters.length} interpreters to seed data for`);

    if (interpreters.length === 0) {
      console.log('❌ No interpreters found. Please create interpreter profiles first.');
      return;
    }

    // Sample client names for realistic sessions
    const clients = [
      'Mercy General Hospital',
      'Downtown Medical Center', 
      'City Superior Court',
      'Immigration Law Office',
      'Community Health Clinic',
      'State Insurance Company',
      'Tech Support Solutions',
      'University Medical Center',
      'Family Services Agency',
      'Regional Government Office',
      'International Business Corp',
      'Emergency Services Dept',
      'Legal Aid Society',
      'Healthcare Network',
      'Social Services Department',
      'Municipal Court',
      'Private Practice Clinic',
      'Corporate Training Center',
      'Educational District',
      'Community Outreach Program'
    ];

    const sessionTypes = ['VRI', 'OPI'];
    const sessionStatuses = ['COMPLETED', 'CANCELLED', 'NO_SHOW'];
    const specializations = ['HEALTHCARE', 'LEGAL', 'BUSINESS', 'EDUCATION', 'GOVERNMENT'];
    
    // For each interpreter, create realistic session history
    for (const interpreter of interpreters) {
      console.log(`📊 Creating sessions for ${interpreter.firstName} ${interpreter.lastName}`);
      
      const languages = interpreter.languages;
      const hourlyRate = interpreter.hourlyRate || 65; // Default rate
      
      // Create sessions over the past 6 months
      const sessions = [];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 6); // 6 months ago
      
      // Generate 20-80 sessions per interpreter (realistic range)
      const sessionCount = Math.floor(Math.random() * 60) + 20;
      
      for (let i = 0; i < sessionCount; i++) {
        // Random date between 6 months ago and now
        const sessionDate = new Date(
          startDate.getTime() + Math.random() * (Date.now() - startDate.getTime())
        );
        
        // Random time during business hours (8 AM - 8 PM)
        const startHour = Math.floor(Math.random() * 12) + 8; // 8-19 (8 AM - 7 PM)
        const startMinute = Math.floor(Math.random() * 60);
        
        sessionDate.setHours(startHour, startMinute, 0, 0);
        
        const status = sessionStatuses[Math.floor(Math.random() * sessionStatuses.length)];
        const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
        const language = languages[Math.floor(Math.random() * languages.length)];
        const client = clients[Math.floor(Math.random() * clients.length)];
        const specialization = interpreter.specializations[Math.floor(Math.random() * interpreter.specializations.length)]?.specialization;
        
        // Generate realistic session duration and earnings
        let duration = null;
        let earnings = 0;
        let startedAt = null;
        let endedAt = null;
        let rating = null;
        
        if (status === 'COMPLETED') {
          // Completed sessions: 15-90 minutes
          duration = Math.floor(Math.random() * 75) + 15;
          earnings = (duration / 60) * hourlyRate;
          startedAt = new Date(sessionDate);
          endedAt = new Date(sessionDate.getTime() + duration * 60000);
          
          // 90% get 4-5 stars, 10% get 1-3 stars
          rating = Math.random() > 0.9 ? 
            Math.floor(Math.random() * 3) + 1 : // 1-3 stars
            Math.floor(Math.random() * 2) + 4;  // 4-5 stars
        } else if (status === 'CANCELLED') {
          // Cancelled sessions might have a cancellation fee (20% of hourly rate)
          if (Math.random() > 0.7) {
            earnings = hourlyRate * 0.2; // 20% cancellation fee
          }
        }
        // NO_SHOW sessions have 0 earnings and duration
        
        sessions.push({
          interpreterProfileId: interpreter.id,
          clientName: client,
          sessionType,
          languageFrom: 'English',
          languageTo: language.languageName,
          specialization,
          status,
          scheduledAt: sessionDate,
          startedAt,
          endedAt,
          duration,
          hourlyRate,
          earnings: Math.round(earnings * 100) / 100, // Round to 2 decimal places
          rating,
          notes: status === 'COMPLETED' ? 
            getRandomSessionNote(specialization) : null,
          cancellationReason: status === 'CANCELLED' ? 
            getRandomCancellationReason() : null
        });
      }
      
      // Insert sessions for this interpreter
      await prisma.interpreterSession.createMany({
        data: sessions
      });
      
      console.log(`✅ Created ${sessions.length} sessions for ${interpreter.firstName} ${interpreter.lastName}`);
      
      // Calculate and log summary for verification
      const completedSessions = sessions.filter(s => s.status === 'COMPLETED');
      const totalEarnings = completedSessions.reduce((sum, s) => sum + s.earnings, 0);
      const avgRating = completedSessions.length > 0 ? 
        completedSessions.reduce((sum, s) => sum + (s.rating || 0), 0) / completedSessions.length : 0;
      
      console.log(`   📈 Summary: ${completedSessions.length} completed, $${totalEarnings.toFixed(2)} earned, ${avgRating.toFixed(1)} avg rating`);
    }
    
    console.log('🎉 Session data seeding completed successfully!');
    
    // Display overall statistics
    const totalSessions = await prisma.interpreterSession.count();
    const totalCompleted = await prisma.interpreterSession.count({
      where: { status: 'COMPLETED' }
    });
    const totalEarningsResult = await prisma.interpreterSession.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { earnings: true }
    });
    
    console.log(`📊 Overall Statistics:`);
    console.log(`   Total Sessions: ${totalSessions}`);
    console.log(`   Completed Sessions: ${totalCompleted}`);
    console.log(`   Total Earnings: $${(totalEarningsResult._sum.earnings || 0).toFixed(2)}`);
    console.log(`   Completion Rate: ${totalSessions > 0 ? ((totalCompleted / totalSessions) * 100).toFixed(1) : 0}%`);
    
  } catch (error) {
    console.error('❌ Error seeding session data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function getRandomSessionNote(specialization) {
  const notes = {
    HEALTHCARE: [
      'Patient consultation - family discussion about treatment options',
      'Emergency room interpretation for patient intake',
      'Doctor appointment - routine checkup with elderly patient',
      'Medical procedure explanation and consent forms',
      'Pharmacy consultation about medication instructions',
      'Mental health therapy session interpretation',
      'Specialist consultation - cardiology appointment',
      'Lab results discussion with patient and family'
    ],
    LEGAL: [
      'Court hearing - family law proceedings',
      'Attorney consultation for immigration case',
      'Legal document review and explanation',
      'Deposition for personal injury case',
      'Criminal court arraignment hearing',
      'Contract negotiation meeting',
      'Immigration interview preparation',
      'Legal aid consultation for tenant rights'
    ],
    BUSINESS: [
      'International client meeting - contract discussion',
      'Corporate training session interpretation',
      'Business negotiation with overseas partners',
      'Employee orientation for multilingual staff',
      'Insurance claim processing meeting',
      'Real estate transaction closing',
      'Banking services consultation',
      'Customer service call resolution'
    ],
    EDUCATION: [
      'Parent-teacher conference interpretation',
      'IEP meeting for special needs student',
      'School enrollment and registration',
      'Academic counseling session',
      'University admission interview',
      'Student disciplinary hearing',
      'Educational assessment meeting',
      'Graduation ceremony participation'
    ],
    GOVERNMENT: [
      'Social services eligibility interview',
      'DMV services and license renewal',
      'Immigration services appointment',
      'Court-appointed interpretation services',
      'Public assistance application review',
      'Voter registration assistance',
      'City council meeting interpretation',
      'Government benefits explanation'
    ]
  };
  
  const specialtyNotes = notes[specialization] || notes.BUSINESS;
  return specialtyNotes[Math.floor(Math.random() * specialtyNotes.length)];
}

function getRandomCancellationReason() {
  const reasons = [
    'Client cancelled 2 hours before scheduled time',
    'Technical difficulties with video connection',
    'Emergency situation - client had to reschedule',
    'Interpreter became unavailable due to illness',
    'Client no-show - waited 15 minutes past start time',
    'Last-minute schedule conflict',
    'Weather-related cancellation',
    'Client requested different language pair'
  ];
  
  return reasons[Math.floor(Math.random() * reasons.length)];
}

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedSessionData()
    .then(() => {
      console.log('✅ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedSessionData };
