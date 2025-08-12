/**
 * Script to create the admin user
 * Usage: node scripts/create-admin-user.js
 */

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdminUser() {
  console.log('🔧 Creating admin user...');
  
  const adminEmail = 'machio2024@hotmail.com';
  const adminPassword = 'Hamza@2004';
  const adminName = 'Admin';

  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      
      // Update password if needed
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          name: adminName
        }
      });
      
      console.log('✅ Admin user password updated');
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      // Create admin user
      const admin = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: 'ADMIN',
          emailVerified: new Date(), // Mark as verified
        }
      });

      console.log('✅ Admin user created successfully!');
      console.log(`Email: ${admin.email}`);
      console.log(`Role: ${admin.role}`);
    }

    console.log('\n📋 Admin Login Details:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`Login URL: http://localhost:3000/auth/signin`);
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
