#!/usr/bin/env node

/**
 * Create sample analytics data for interpreter testing
 * This script adds sample interpretation sessions to the database for testing
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createSampleData() {
  try {
    console.log('🚀 Starting to create sample analytics data...');
    
    // Find interpreter by email
    const interpreterEmail = 'machio2020@gmail.com';
    console.log(`📧 Looking for interpreter: ${interpreterEmail}`);
    
    const interpreter = await prisma.user.findUnique({
      where: { email: interpreterEmail },
      include: {
        interpreterProfile: true
      }
    });

    if (!interpreter) {
      console.error(`❌ No user found with email: ${interpreterEmail}`);
      console.log('Please make sure the interpreter account exists first.');
      process.exit(1);
    }

    if (!interpreter.interpreterProfile) {
      console.error(`❌ User found but no interpreter profile exists for: ${interpreterEmail}`);
      process.exit(1);
    }

    console.log(`✅ Found interpreter: ${interpreter.name || interpreter.email}`);
    console.log(`📊 Profile ID: ${interpreter.interpreterProfile.id}`);

    const interpreterProfileId = interpreter.interpreterProfile.id;

    // Clear existing sample sessions for this interpreter
    console.log('🧹 Clearing existing sample sessions...');
    await prisma.interpreterSession.deleteMany({
      where: {
        interpreterProfileId,
        notes: 'Sample data for testing'
      }
    });

    // Create sample sessions over the last 30 days
    const today = new Date();
    const sampleSessions = [];

    // Languages to rotate through
    const languages = ['Spanish', 'French', 'Arabic', 'Mandarin', 'Japanese', 'Portuguese'];
    const specializations = ['HEALTHCARE', 'LEGAL', 'BUSINESS', 'GENERAL'];
    const sessionTypes = ['VRI', 'OPI'];
    const statuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'CANCELLED']; // Mostly completed

    // Generate 45 sessions over the last 30 days
    for (let i = 0; i < 45; i++) {
      const daysAgo = Math.floor(Math.random() * 30);
      const scheduledAt = new Date(today);
      scheduledAt.setDate(today.getDate() - daysAgo);
      scheduledAt.setHours(Math.floor(Math.random() * 12) + 8); // 8 AM to 8 PM
      scheduledAt.setMinutes(Math.floor(Math.random() * 60));

      const duration = Math.floor(Math.random() * 120) + 30; // 30-150 minutes
      const hourlyRate = 85.0; // Fixed rate for consistency
      const earnings = (duration / 60) * hourlyRate;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const sessionType = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
      const language = languages[Math.floor(Math.random() * languages.length)];
      const specialization = specializations[Math.floor(Math.random() * specializations.length)];

      // Calculate end time
      const startedAt = new Date(scheduledAt);
      startedAt.setMinutes(startedAt.getMinutes() + Math.floor(Math.random() * 5)); // Started 0-5 mins after scheduled

      const endedAt = new Date(startedAt);
      endedAt.setMinutes(endedAt.getMinutes() + duration);

      sampleSessions.push({
        interpreterProfileId,
        clientName: `Client ${i + 1}`,
        sessionType,
        languageFrom: 'English',
        languageTo: language,
        specialization,
        status,
        scheduledAt,
        startedAt: status === 'COMPLETED' ? startedAt : null,
        endedAt: status === 'COMPLETED' ? endedAt : null,
        duration: status === 'COMPLETED' ? duration : null,
        hourlyRate,
        earnings: status === 'COMPLETED' ? Math.round(earnings * 100) / 100 : 0,
        rating: status === 'COMPLETED' ? Math.floor(Math.random() * 2) + 4 : null, // 4-5 stars
        feedback: status === 'COMPLETED' ? 'Excellent interpretation service. Very professional and accurate.' : null,
        notes: 'Sample data for testing',
        createdAt: scheduledAt,
        updatedAt: new Date()
      });
    }

    // Insert sample sessions in batches
    console.log(`📝 Creating ${sampleSessions.length} sample sessions...`);
    
    for (const session of sampleSessions) {
      await prisma.interpreterSession.create({
        data: session
      });
    }

    console.log('✅ Sample sessions created successfully!');

    // Display summary
    const completedCount = sampleSessions.filter(s => s.status === 'COMPLETED').length;
    const totalEarnings = sampleSessions
      .filter(s => s.status === 'COMPLETED')
      .reduce((sum, s) => sum + s.earnings, 0);
    const totalHours = sampleSessions
      .filter(s => s.status === 'COMPLETED')
      .reduce((sum, s) => sum + (s.duration || 0), 0) / 60;

    console.log('\n📊 Sample Data Summary:');
    console.log(`   Total Sessions: ${sampleSessions.length}`);
    console.log(`   Completed Sessions: ${completedCount}`);
    console.log(`   Total Earnings: $${totalEarnings.toFixed(2)}`);
    console.log(`   Total Hours: ${totalHours.toFixed(1)}`);
    console.log(`   Languages: ${languages.join(', ')}`);
    console.log(`   Specializations: ${specializations.join(', ')}`);

    console.log('\n🎉 Sample analytics data created successfully!');
    console.log('You can now visit the analytics page to see the data.');

  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSampleData();
