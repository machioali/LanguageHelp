const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkInterpreter() {
  try {
    console.log('🔍 Checking for interpreter accounts...\n');
    
    const interpreters = await prisma.user.findMany({
      where: {
        role: 'INTERPRETER'
      },
      include: {
        interpreterProfile: {
          include: {
            credentials: true,
            languages: true,
            specializations: true,
          }
        }
      }
    });

    if (interpreters.length === 0) {
      console.log('❌ No interpreter accounts found in the database.');
      return;
    }

    console.log(`✅ Found ${interpreters.length} interpreter account(s):\n`);

    for (const interpreter of interpreters) {
      console.log(`📧 Email: ${interpreter.email}`);
      console.log(`👤 Name: ${interpreter.name}`);
      console.log(`🆔 User ID: ${interpreter.id}`);
      
      if (interpreter.interpreterProfile) {
        const profile = interpreter.interpreterProfile;
        console.log(`📋 Profile ID: ${profile.id}`);
        console.log(`⭐ Status: ${profile.status}`);
        console.log(`✅ Verified: ${profile.isVerified}`);
        
        if (profile.credentials) {
          const cred = profile.credentials;
          console.log(`🔑 Has temp password: ${!!cred.tempPassword}`);
          console.log(`🎫 Has login token: ${!!cred.loginToken}`);
          console.log(`🆕 Is first login: ${cred.isFirstLogin}`);
          console.log(`⏰ Token expires: ${cred.tokenExpiry}`);
          console.log(`🕐 Last login: ${cred.lastLoginAt}`);
          
          if (cred.loginToken) {
            console.log(`\n🔐 LOGIN CREDENTIALS:`);
            console.log(`Token: ${cred.loginToken}`);
          }
        }
        
        console.log(`🌐 Languages: ${profile.languages.map(l => `${l.languageName} (${l.proficiency})`).join(', ')}`);
        console.log(`🎯 Specializations: ${profile.specializations.map(s => s.specialization).join(', ')}`);
      }
      
      console.log(`\n${'='.repeat(60)}\n`);
    }
    
  } catch (error) {
    console.error('❌ Error checking interpreters:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkInterpreter();
