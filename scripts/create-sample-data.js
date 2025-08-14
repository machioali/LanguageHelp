// Script to create sample data for testing admin dashboard
// Run this with: node scripts/create-sample-data.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createSampleData() {
    console.log('🚀 Creating sample data for admin dashboard...');

    try {
        // 1. Create sample users
        const hashedPassword = await bcrypt.hash('password123', 12);

        // Create admin user if doesn't exist
        let adminUser = await prisma.user.findUnique({
            where: { email: 'admin@languagehelp.com' }
        });

        if (!adminUser) {
            adminUser = await prisma.user.create({
                data: {
                    email: 'admin@languagehelp.com',
                    name: 'Admin User',
                    password: hashedPassword,
                    role: 'ADMIN',
                }
            });
            console.log('✅ Created admin user');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Create sample client users
        const clientUsers = [
            {
                email: 'client1@example.com',
                name: 'John Client',
                role: 'CLIENT',
                companyName: 'Tech Corp',
                phoneNumber: '+1234567890'
            },
            {
                email: 'client2@example.com',
                name: 'Jane Client',
                role: 'CLIENT',
                companyName: 'Healthcare Inc',
                phoneNumber: '+1234567891'
            },
            {
                email: 'client3@example.com',
                name: 'Bob Johnson',
                role: 'CLIENT',
                companyName: 'Legal Associates',
                phoneNumber: '+1234567892'
            }
        ];

        for (const clientData of clientUsers) {
            const existing = await prisma.user.findUnique({
                where: { email: clientData.email }
            });

            if (!existing) {
                await prisma.user.create({
                    data: {
                        ...clientData,
                        password: hashedPassword,
                    }
                });
                console.log(`✅ Created client user: ${clientData.email}`);
            }
        }

        // Create sample interpreter users
        const interpreterUsers = [
            {
                email: 'interpreter1@example.com',
                name: 'Maria Interpreter',
                role: 'INTERPRETER',
                phoneNumber: '+1234567893'
            },
            {
                email: 'interpreter2@example.com',
                name: 'Carlos Interpreter',
                role: 'INTERPRETER',
                phoneNumber: '+1234567894'
            },
            {
                email: 'interpreter3@example.com',
                name: 'Anna Schmidt',
                role: 'INTERPRETER',
                phoneNumber: '+1234567895'
            }
        ];

        for (const interpreterData of interpreterUsers) {
            let interpreterUser = await prisma.user.findUnique({
                where: { email: interpreterData.email }
            });

            if (!interpreterUser) {
                interpreterUser = await prisma.user.create({
                    data: {
                        ...interpreterData,
                        password: hashedPassword,
                    }
                });
                console.log(`✅ Created interpreter user: ${interpreterData.email}`);

                // Create interpreter profile
                const statuses = ['PENDING', 'APPROVED', 'ACTIVE', 'INACTIVE'];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                
                await prisma.interpreterProfile.create({
                    data: {
                        userId: interpreterUser.id,
                        firstName: interpreterData.name.split(' ')[0],
                        lastName: interpreterData.name.split(' ')[1],
                        phone: interpreterData.phoneNumber,
                        status: randomStatus,
                        isVerified: Math.random() > 0.3,
                        bio: 'Experienced interpreter with 5+ years in the field.',
                        experience: Math.floor(Math.random() * 10) + 1,
                        hourlyRate: 40 + Math.random() * 60,
                    }
                });
                console.log(`✅ Created interpreter profile for: ${interpreterData.email} (Status: ${randomStatus})`);
            }
        }

        // 2. Create sample interpreter applications
        const sampleApplications = [
            {
                email: 'applicant1@example.com',
                firstName: 'Sofia',
                lastName: 'Rodriguez',
                phone: '+1234567896',
                languages: JSON.stringify([
                    { code: 'es', name: 'Spanish', proficiency: 'NATIVE' },
                    { code: 'en', name: 'English', proficiency: 'FLUENT' }
                ]),
                specializations: JSON.stringify(['HEALTHCARE', 'LEGAL']),
                experience: 7,
                certifications: JSON.stringify([
                    { name: 'Certified Medical Interpreter', organization: 'NCIHC' },
                    { name: 'Court Interpreter Certification', organization: 'State Court' }
                ]),
                bio: 'Dedicated interpreter with extensive experience in medical and legal settings.',
                status: 'PENDING'
            },
            {
                email: 'applicant2@example.com',
                firstName: 'Ahmed',
                lastName: 'Hassan',
                phone: '+1234567897',
                languages: JSON.stringify([
                    { code: 'ar', name: 'Arabic', proficiency: 'NATIVE' },
                    { code: 'en', name: 'English', proficiency: 'FLUENT' },
                    { code: 'fr', name: 'French', proficiency: 'ADVANCED' }
                ]),
                specializations: JSON.stringify(['BUSINESS', 'GOVERNMENT']),
                experience: 5,
                certifications: JSON.stringify([
                    { name: 'Business Interpreter Certification', organization: 'ATA' }
                ]),
                bio: 'Professional interpreter specializing in business and government settings.',
                status: 'UNDER_REVIEW'
            },
            {
                email: 'applicant3@example.com',
                firstName: 'Li',
                lastName: 'Wang',
                phone: '+1234567898',
                languages: JSON.stringify([
                    { code: 'zh', name: 'Chinese (Mandarin)', proficiency: 'NATIVE' },
                    { code: 'en', name: 'English', proficiency: 'FLUENT' }
                ]),
                specializations: JSON.stringify(['TECHNICAL', 'EDUCATION']),
                experience: 3,
                certifications: JSON.stringify([]),
                bio: 'Emerging interpreter with strong technical background.',
                status: 'APPROVED'
            },
            {
                email: 'applicant4@example.com',
                firstName: 'Pierre',
                lastName: 'Dubois',
                phone: '+1234567899',
                languages: JSON.stringify([
                    { code: 'fr', name: 'French', proficiency: 'NATIVE' },
                    { code: 'en', name: 'English', proficiency: 'FLUENT' }
                ]),
                specializations: JSON.stringify(['CONFERENCE']),
                experience: 2,
                certifications: JSON.stringify([]),
                bio: 'Conference interpreter with focus on international events.',
                status: 'REJECTED'
            },
            {
                email: 'applicant5@example.com',
                firstName: 'Yuki',
                lastName: 'Tanaka',
                phone: '+1234567800',
                languages: JSON.stringify([
                    { code: 'ja', name: 'Japanese', proficiency: 'NATIVE' },
                    { code: 'en', name: 'English', proficiency: 'FLUENT' }
                ]),
                specializations: JSON.stringify(['BUSINESS', 'TECHNICAL']),
                experience: 6,
                certifications: JSON.stringify([
                    { name: 'Technical Translation Certificate', organization: 'JTA' }
                ]),
                bio: 'Business and technical interpreter with focus on Japanese-English translations.',
                status: 'PENDING'
            },
            {
                email: 'applicant6@example.com',
                firstName: 'Elena',
                lastName: 'Rossi',
                phone: '+1234567801',
                languages: JSON.stringify([
                    { code: 'it', name: 'Italian', proficiency: 'NATIVE' },
                    { code: 'en', name: 'English', proficiency: 'FLUENT' },
                    { code: 'es', name: 'Spanish', proficiency: 'ADVANCED' }
                ]),
                specializations: JSON.stringify(['HEALTHCARE', 'GENERAL']),
                experience: 4,
                certifications: JSON.stringify([]),
                bio: 'Healthcare interpreter with experience in emergency and clinical settings.',
                status: 'UNDER_REVIEW'
            }
        ];

        for (const appData of sampleApplications) {
            const existing = await prisma.interpreterApplication.findUnique({
                where: { email: appData.email }
            });

            if (!existing) {
                await prisma.interpreterApplication.create({
                    data: appData
                });
                console.log(`✅ Created application: ${appData.firstName} ${appData.lastName} (${appData.status})`);
            }
        }

        // 3. Create additional admin user for testing
        const secondAdmin = await prisma.user.findUnique({
            where: { email: 'admin2@languagehelp.com' }
        });

        if (!secondAdmin) {
            await prisma.user.create({
                data: {
                    email: 'admin2@languagehelp.com',
                    name: 'Secondary Admin',
                    password: hashedPassword,
                    role: 'ADMIN',
                }
            });
            console.log('✅ Created secondary admin user');
        }

        console.log('');
        console.log('🎉 Sample data creation completed!');
        console.log('📊 Your admin dashboard should now show:');
        console.log('   - Multiple users with different roles');
        console.log('   - Interpreter applications with various statuses');
        console.log('   - System stats with proper counts');
        console.log('   - Search functionality test data');
        console.log('');
        console.log('🔐 Admin login credentials:');
        console.log('   Email: admin@languagehelp.com');
        console.log('   Password: password123');
        console.log('');
        console.log('📱 Test the dashboard by:');
        console.log('   1. Switching between Applications and Users tabs');
        console.log('   2. Using the search functionality');
        console.log('   3. Filtering by status/role');
        console.log('   4. Reviewing and approving/rejecting applications');
        console.log('   5. Managing user accounts');

    } catch (error) {
        console.error('❌ Error creating sample data:', error);
        console.error('Stack trace:', error.stack);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the function
createSampleData();
