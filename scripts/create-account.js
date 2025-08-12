/**
 * Helper script to create interpreter accounts via API
 * 
 * Usage:
 * node scripts/create-account.js path/to/data.json
 * node scripts/create-account.js path/to/data.json http://localhost:3000
 */

const fs = require('fs');
const path = require('path');

async function createInterpreterAccount(dataFile, baseUrl = 'http://localhost:3000') {
  try {
    // Check if file exists
    if (!fs.existsSync(dataFile)) {
      throw new Error(`File not found: ${dataFile}`);
    }

    // Read and parse the data file
    const rawData = fs.readFileSync(dataFile, 'utf8');
    let interpreterData;
    
    try {
      interpreterData = JSON.parse(rawData);
    } catch (error) {
      throw new Error(`Invalid JSON in file: ${error.message}`);
    }

    console.log('🚀 Creating interpreter account...');
    console.log(`📧 Email: ${interpreterData.email}`);
    console.log(`👤 Name: ${interpreterData.firstName} ${interpreterData.lastName}`);
    console.log();

    // Make the API request
    const response = await fetch(`${baseUrl}/api/admin/interpreters/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interpreterData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ FAILED TO CREATE ACCOUNT');
      console.error('Status:', response.status);
      console.error('Error:', result.error);
      
      if (result.details) {
        console.error('Details:');
        result.details.forEach(detail => {
          console.error(`  - ${detail.path}: ${detail.message}`);
        });
      }
      
      process.exit(1);
    }

    // Success!
    console.log('✅ INTERPRETER ACCOUNT CREATED SUCCESSFULLY!');
    console.log('='.repeat(50));
    console.log(`ID: ${result.interpreter.id}`);
    console.log(`Email: ${result.interpreter.email}`);
    console.log(`Name: ${result.interpreter.firstName} ${result.interpreter.lastName}`);
    console.log(`Status: ${result.interpreter.status}`);
    console.log();

    if (result.credentials) {
      console.log('🔑 LOGIN CREDENTIALS');
      console.log('-'.repeat(30));
      console.log(`Login URL: ${result.credentials.loginUrl}`);
      console.log(`Temporary Password: ${result.credentials.tempPassword}`);
      console.log(`Login Token: ${result.credentials.loginToken}`);
      console.log(`Token Expires: ${new Date(result.credentials.tokenExpiry).toLocaleString()}`);
      console.log();
      
      console.log('📋 INSTRUCTIONS FOR INTERPRETER:');
      result.credentials.instructions.forEach((instruction, index) => {
        console.log(`${index + 1}. ${instruction}`);
      });
      console.log();

      // Save credentials to a file
      const credentialsDir = path.join(__dirname, '..', 'temp', 'credentials');
      if (!fs.existsSync(credentialsDir)) {
        fs.mkdirSync(credentialsDir, { recursive: true });
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const credentialsFile = path.join(
        credentialsDir, 
        `${result.interpreter.firstName.toLowerCase()}-${result.interpreter.lastName.toLowerCase()}-credentials-${timestamp}.json`
      );

      fs.writeFileSync(credentialsFile, JSON.stringify({
        interpreter: result.interpreter,
        credentials: result.credentials,
        createdAt: new Date().toISOString()
      }, null, 2));

      console.log(`💾 Credentials saved to: ${credentialsFile}`);
      console.log();
    }

    console.log('🎉 Account creation completed successfully!');
    
    // Delete the input file if requested
    const deleteInput = process.argv.includes('--delete-input');
    if (deleteInput) {
      fs.unlinkSync(dataFile);
      console.log(`🗑️  Input file deleted: ${dataFile}`);
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error();
      console.error('💡 Make sure your development server is running:');
      console.error('   npm run dev');
      console.error();
    }
    
    process.exit(1);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Usage: node scripts/create-account.js <data-file.json> [base-url]');
    console.error();
    console.error('Examples:');
    console.error('  node scripts/create-account.js temp/interpreter-data.json');
    console.error('  node scripts/create-account.js temp/interpreter-data.json http://localhost:3000');
    console.error('  node scripts/create-account.js temp/interpreter-data.json --delete-input');
    process.exit(1);
  }

  const dataFile = args[0];
  const baseUrl = args.find(arg => arg.startsWith('http')) || 'http://localhost:3000';
  
  await createInterpreterAccount(dataFile, baseUrl);
}

// Handle script execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createInterpreterAccount };
