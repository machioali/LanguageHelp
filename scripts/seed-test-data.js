const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTestApplications() {
  try {
    console.log('🌱 Seeding test interpreter applications...');

    // Clear existing test data (optional)
    await prisma.interpreterApplication.deleteMany({
      where: {
        email: {
          contains: 'test'
        }
      }
    });

    const testApplications = [
      {
        firstName: 'Maria',
        lastName: 'Rodriguez',
        email: 'maria.test@example.com',
        phone: '+1-555-0101',
        experience: 5,
        bio: 'Certified medical interpreter with 5 years of experience in hospital settings. Fluent in Spanish and English with specialized knowledge in medical terminology.',
        status: 'PENDING',
        languages: [
          { code: 'es', name: 'Spanish', proficiency: 'NATIVE' },
          { code: 'en', name: 'English', proficiency: 'FLUENT' }
        ],
        specializations: ['Medical', 'Healthcare'],
        certifications: [
          { name: 'Certified Medical Interpreter', organization: 'National Board of Certification' },
          { name: 'Healthcare Interpreter Certification', organization: 'CCHI' }
        ]
      },
      {
        firstName: 'Ahmed',
        lastName: 'Hassan',
        email: 'ahmed.test@example.com',
        phone: '+1-555-0102',
        experience: 8,
        bio: 'Legal interpreter with extensive experience in court proceedings and immigration cases. Specializes in Arabic-English interpretation.',
        status: 'PENDING',
        languages: [
          { code: 'ar', name: 'Arabic', proficiency: 'NATIVE' },
          { code: 'en', name: 'English', proficiency: 'FLUENT' }
        ],
        specializations: ['Legal', 'Immigration', 'Court Proceedings'],
        certifications: [
          { name: 'Court Interpreter Certification', organization: 'State Court System' }
        ]
      },
      {
        firstName: 'Li',
        lastName: 'Chen',
        email: 'li.test@example.com',
        phone: '+1-555-0103',
        experience: 3,
        bio: 'Business interpreter specializing in technology and finance sectors. Native Mandarin speaker with strong English skills.',
        status: 'UNDER_REVIEW',
        languages: [
          { code: 'zh', name: 'Mandarin Chinese', proficiency: 'NATIVE' },
          { code: 'en', name: 'English', proficiency: 'FLUENT' }
        ],
        specializations: ['Business', 'Technology', 'Finance'],
        certifications: []
      },
      {
        firstName: 'Pierre',
        lastName: 'Dubois',
        email: 'pierre.test@example.com',
        phone: null,
        experience: 12,
        bio: 'Senior conference interpreter with over a decade of experience. Specialized in international diplomacy and high-level negotiations.',
        status: 'APPROVED',
        languages: [
          { code: 'fr', name: 'French', proficiency: 'NATIVE' },
          { code: 'en', name: 'English', proficiency: 'FLUENT' },
          { code: 'de', name: 'German', proficiency: 'INTERMEDIATE' }
        ],
        specializations: ['Conference', 'Diplomacy', 'International Relations'],
        certifications: [
          { name: 'Conference Interpreter Certification', organization: 'AIIC' },
          { name: 'Diplomatic Interpreter License', organization: 'Ministry of Foreign Affairs' }
        ]
      },
      {
        firstName: 'Yuki',
        lastName: 'Tanaka',
        email: 'yuki.test@example.com',
        phone: '+1-555-0105',
        experience: 2,
        bio: 'Recent graduate with passion for community interpretation. Seeking to help Japanese-speaking communities access essential services.',
        status: 'REJECTED',
        languages: [
          { code: 'ja', name: 'Japanese', proficiency: 'NATIVE' },
          { code: 'en', name: 'English', proficiency: 'INTERMEDIATE' }
        ],
        specializations: ['Community', 'Social Services'],
        certifications: []
      },
      {
        firstName: 'Elena',
        lastName: 'Popov',
        email: 'elena.test@example.com',
        phone: '+1-555-0106',
        experience: 7,
        bio: 'Educational interpreter working with schools and universities. Experienced in academic settings and student services.',
        status: 'PENDING',
        languages: [
          { code: 'ru', name: 'Russian', proficiency: 'NATIVE' },
          { code: 'en', name: 'English', proficiency: 'FLUENT' }
        ],
        specializations: ['Educational', 'Academic', 'Student Services'],
        certifications: [
          { name: 'Educational Interpreter Certification', organization: 'Department of Education' }
        ]
      }
    ];

    for (const appData of testApplications) {
      const { languages, specializations, certifications, ...applicationData } = appData;
      
      const application = await prisma.interpreterApplication.create({
        data: {
          ...applicationData,
          languages: JSON.stringify(languages),
          specializations: JSON.stringify(specializations),
          certifications: JSON.stringify(certifications)
        }
      });

      console.log(`✅ Created application for ${appData.firstName} ${appData.lastName} (${appData.status})`);
    }

    console.log('🎉 Test data seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
seedTestApplications();
