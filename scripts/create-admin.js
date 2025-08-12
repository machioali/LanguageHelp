/**
 * Script to create the first admin user
 * 
 * Usage:
 * node scripts/create-admin.js
 * node scripts/create-admin.js admin@company.com "Admin User" mypassword123
 */

const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

// Create interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

// Helper function to validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function createAdmin(email, name, password) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      if (existingUser.role === 'ADMIN') {
        console.log('✅ Admin user already exists with this email');
        console.log(`📧 Email: ${existingUser.email}`);
        console.log(`👤 Name: ${existingUser.name}`);
        console.log(`🔑 Role: ${existingUser.role}`);
        return existingUser;
      } else {
        throw new Error(`User with email ${email} already exists but is not an admin (role: ${existingUser.role})`);
      }
    }

    // Hash the password
    console.log('🔐 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the admin user
    console.log('👤 Creating admin user...');
    const adminUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name,
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(), // Mark as verified since it's created by script
      }
    });

    console.log('');
    console.log('🎉 ADMIN USER CREATED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log(`📧 Email: ${adminUser.email}`);
    console.log(`👤 Name: ${adminUser.name}`);
    console.log(`🔑 Role: ${adminUser.role}`);
    console.log(`🆔 ID: ${adminUser.id}`);
    console.log(`📅 Created: ${adminUser.createdAt.toLocaleString()}`);
    console.log('');
    console.log('🚀 You can now sign in at: http://localhost:3000/auth/signin');
    console.log('🔗 Access admin dashboard at: http://localhost:3000/admin/dashboard');
    console.log('');

    return adminUser;

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('   ADMIN USER CREATION SCRIPT');
  console.log('='.repeat(60));
  console.log();

  try {
    let email, name, password;

    // Check if arguments were provided
    const args = process.argv.slice(2);
    
    if (args.length >= 3) {
      // Use provided arguments
      [email, name, password] = args;
      console.log('📋 Using provided arguments...');
    } else {
      // Interactive mode
      console.log('📋 Please provide admin user details:');
      console.log();

      // Get email
      do {
        email = await askQuestion('📧 Admin email: ');
        if (!validateEmail(email)) {
          console.log('❌ Please enter a valid email address');
        }
      } while (!validateEmail(email));

      // Get name
      do {
        name = await askQuestion('👤 Admin name: ');
        name = name.trim();
      } while (!name);

      // Get password
      do {
        password = await askQuestion('🔐 Admin password: ');
        if (password.length < 8) {
          console.log('❌ Password must be at least 8 characters long');
          password = '';
        }
      } while (!password);
    }

    console.log();
    console.log('Creating admin user with:');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${name}`);
    console.log(`🔐 Password: ${'*'.repeat(password.length)}`);
    console.log();

    // Create the admin user
    await createAdmin(email, name, password);

  } catch (error) {
    console.error('💥 Failed to create admin user:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  main().catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
}

module.exports = { createAdmin };
