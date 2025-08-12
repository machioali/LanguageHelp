/**
 * CLI Script for Creating Interpreter Accounts
 * 
 * Usage:
 * node scripts/create-interpreter.js
 * 
 * This script allows administrators to create interpreter accounts
 * directly from the backend without using the public signup flow.
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

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

// Helper function to ask yes/no questions
async function askYesNo(question) {
  let answer;
  do {
    answer = (await askQuestion(`${question} (y/n): `)).toLowerCase();
  } while (answer !== 'y' && answer !== 'n' && answer !== 'yes' && answer !== 'no');
  
  return answer === 'y' || answer === 'yes';
}

// Helper function to ask for multiple items
async function askMultiple(question, validator = null) {
  console.log(`\n${question}`);
  console.log('Enter items one by one. Press Enter with empty input to finish.\n');
  
  const items = [];
  let index = 1;
  
  while (true) {
    const item = await askQuestion(`Item ${index}: `);
    
    if (!item.trim()) {
      if (items.length === 0) {
        console.log('At least one item is required. Please try again.');
        continue;
      }
      break;
    }
    
    if (validator) {
      const validationResult = validator(item.trim());
      if (!validationResult.valid) {
        console.log(`Invalid input: ${validationResult.message}`);
        continue;
      }
    }
    
    items.push(item.trim());
    index++;
  }
  
  return items;
}

// Validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return {
    valid: emailRegex.test(email),
    message: 'Please enter a valid email address'
  };
}

function validateNumber(value, min = 0) {
  const num = parseFloat(value);
  return {
    valid: !isNaN(num) && num >= min,
    message: `Please enter a valid number${min > 0 ? ` (minimum ${min})` : ''}`
  };
}

function validateLanguageCode(code) {
  const validCodes = /^[a-z]{2,3}(-[A-Z]{2})?$/; // e.g., en, es, zh-CN
  return {
    valid: validCodes.test(code),
    message: 'Please enter a valid language code (e.g., en, es, zh-CN)'
  };
}

async function main() {
  console.log('='.repeat(50));
  console.log('   INTERPRETER ACCOUNT CREATION TOOL');
  console.log('='.repeat(50));
  console.log();

  try {
    // Collect basic information
    console.log('📋 BASIC INFORMATION');
    console.log('-'.repeat(30));
    
    let email;
    do {
      email = await askQuestion('Email Address: ');
      if (!validateEmail(email).valid) {
        console.log('❌ Please enter a valid email address');
        email = '';
      }
    } while (!email);

    const firstName = await askQuestion('First Name: ');
    const lastName = await askQuestion('Last Name: ');
    const phone = await askQuestion('Phone Number (optional): ');

    // Collect languages
    console.log('\n🌍 LANGUAGES');
    console.log('-'.repeat(30));
    console.log('Please provide languages the interpreter can work with:');
    
    const languages = [];
    let addingLanguages = true;
    let langIndex = 1;
    
    while (addingLanguages) {
      console.log(`\nLanguage ${langIndex}:`);
      
      let languageCode;
      do {
        languageCode = await askQuestion('  Language Code (e.g., en, es): ');
        if (!validateLanguageCode(languageCode).valid) {
          console.log('  ❌ Please enter a valid language code');
          languageCode = '';
        }
      } while (!languageCode);
      
      const languageName = await askQuestion('  Language Name (e.g., English, Spanish): ');
      
      console.log('  Proficiency Level:');
      console.log('    1. NATIVE');
      console.log('    2. FLUENT');
      console.log('    3. ADVANCED');
      console.log('    4. INTERMEDIATE');
      console.log('    5. BASIC');
      
      let proficiencyChoice;
      do {
        proficiencyChoice = await askQuestion('  Choose proficiency (1-5): ');
      } while (!/^[1-5]$/.test(proficiencyChoice));
      
      const proficiencyLevels = ['NATIVE', 'FLUENT', 'ADVANCED', 'INTERMEDIATE', 'BASIC'];
      const proficiency = proficiencyLevels[parseInt(proficiencyChoice) - 1];
      
      const isNative = await askYesNo('  Is this a native language?');
      
      languages.push({
        languageCode: languageCode.toLowerCase(),
        languageName,
        proficiency,
        isNative
      });
      
      langIndex++;
      addingLanguages = await askYesNo('\nAdd another language?');
    }

    // Collect specializations
    console.log('\n🎯 SPECIALIZATIONS');
    console.log('-'.repeat(30));
    console.log('Available specializations:');
    console.log('1. HEALTHCARE    2. LEGAL        3. BUSINESS');
    console.log('4. EDUCATION     5. GOVERNMENT   6. TECHNICAL');
    console.log('7. CONFERENCE    8. EMERGENCY    9. GENERAL');
    console.log();
    
    const specializationOptions = [
      'HEALTHCARE', 'LEGAL', 'BUSINESS', 'EDUCATION', 'GOVERNMENT',
      'TECHNICAL', 'CONFERENCE', 'EMERGENCY', 'GENERAL'
    ];
    
    const specializations = [];
    let addingSpecs = true;
    
    while (addingSpecs && specializations.length < specializationOptions.length) {
      let specChoice;
      do {
        specChoice = await askQuestion('Choose specialization (1-9): ');
      } while (!/^[1-9]$/.test(specChoice) || specializations.includes(specializationOptions[parseInt(specChoice) - 1]));
      
      const selectedSpec = specializationOptions[parseInt(specChoice) - 1];
      specializations.push(selectedSpec);
      console.log(`✓ Added: ${selectedSpec}`);
      
      if (specializations.length < specializationOptions.length) {
        addingSpecs = await askYesNo('Add another specialization?');
      }
    }

    // Optional professional information
    console.log('\n💼 PROFESSIONAL INFORMATION (Optional)');
    console.log('-'.repeat(30));
    
    let hourlyRate;
    const rateInput = await askQuestion('Hourly Rate ($): ');
    if (rateInput && validateNumber(rateInput, 0).valid) {
      hourlyRate = parseFloat(rateInput);
    }
    
    let experience;
    const expInput = await askQuestion('Years of Experience: ');
    if (expInput && validateNumber(expInput, 0).valid) {
      experience = parseInt(expInput);
    }
    
    const bio = await askQuestion('Bio/Description: ');

    // Certifications (optional)
    const addCertifications = await askYesNo('\nAdd certifications?');
    const certifications = [];
    
    if (addCertifications) {
      console.log('\n📜 CERTIFICATIONS');
      console.log('-'.repeat(30));
      
      let addingCerts = true;
      let certIndex = 1;
      
      while (addingCerts) {
        console.log(`\nCertification ${certIndex}:`);
        
        const certName = await askQuestion('  Certificate Name: ');
        const issuingOrg = await askQuestion('  Issuing Organization: ');
        const certNumber = await askQuestion('  Certificate Number (optional): ');
        const issueDate = await askQuestion('  Issue Date (YYYY-MM-DD, optional): ');
        const expiryDate = await askQuestion('  Expiry Date (YYYY-MM-DD, optional): ');
        const isVerified = await askYesNo('  Is this certification verified?');
        
        const certification = {
          name: certName,
          issuingOrganization: issuingOrg,
          isVerified
        };
        
        if (certNumber) certification.certificateNumber = certNumber;
        if (issueDate) certification.issueDate = issueDate;
        if (expiryDate) certification.expiryDate = expiryDate;
        
        certifications.push(certification);
        certIndex++;
        
        addingCerts = await askYesNo('\nAdd another certification?');
      }
    }

    // Options
    console.log('\n⚙️  OPTIONS');
    console.log('-'.repeat(30));
    
    const autoApprove = await askYesNo('Auto-approve this interpreter?');
    const sendCredentials = await askYesNo('Include login credentials in output?');

    // Prepare the data
    const interpreterData = {
      email: email.toLowerCase(),
      firstName,
      lastName,
      languages,
      specializations,
      autoApprove,
      sendCredentials
    };

    if (phone) interpreterData.phone = phone;
    if (hourlyRate) interpreterData.hourlyRate = hourlyRate;
    if (experience) interpreterData.experience = experience;
    if (bio) interpreterData.bio = bio;
    if (certifications.length > 0) interpreterData.certifications = certifications;

    // Display summary
    console.log('\n📄 SUMMARY');
    console.log('='.repeat(50));
    console.log(`Name: ${firstName} ${lastName}`);
    console.log(`Email: ${email}`);
    console.log(`Languages: ${languages.map(l => `${l.languageName} (${l.proficiency})`).join(', ')}`);
    console.log(`Specializations: ${specializations.join(', ')}`);
    if (hourlyRate) console.log(`Hourly Rate: $${hourlyRate}`);
    if (experience) console.log(`Experience: ${experience} years`);
    console.log(`Auto-approve: ${autoApprove ? 'Yes' : 'No'}`);
    console.log(`Send credentials: ${sendCredentials ? 'Yes' : 'No'}`);
    console.log();

    const confirm = await askYesNo('Create this interpreter account?');
    
    if (!confirm) {
      console.log('\n❌ Operation cancelled.');
      return;
    }

    // Save the data to a file that can be used with the API
    const outputDir = path.join(__dirname, '..', 'temp');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `interpreter-${firstName.toLowerCase()}-${lastName.toLowerCase()}-${timestamp}.json`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(interpreterData, null, 2));
    
    console.log('\n✅ ACCOUNT DATA PREPARED');
    console.log('='.repeat(50));
    console.log(`Data saved to: ${filepath}`);
    console.log();
    console.log('TO CREATE THE ACCOUNT:');
    console.log('1. Start your development server (npm run dev)');
    console.log('2. Use this curl command:');
    console.log();
    console.log(`curl -X POST http://localhost:3000/api/admin/interpreters/create \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d @"${filepath}"`);
    console.log();
    console.log('OR use the provided Node.js script:');
    console.log(`node scripts/create-account.js "${filepath}"`);
    console.log();
    console.log('The API will return the login credentials if sendCredentials is true.');

  } catch (error) {
    console.error('\n❌ Error occurred:', error.message);
  } finally {
    rl.close();
  }
}

// Handle script execution
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
