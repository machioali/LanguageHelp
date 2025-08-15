// This script will run on Vercel to verify environment variables
console.log('🚀 Production Environment Check');
console.log('================================');

const checks = [
  { name: 'NEXTAUTH_URL', value: process.env.NEXTAUTH_URL, required: true },
  { name: 'NEXTAUTH_SECRET', value: process.env.NEXTAUTH_SECRET, required: true },
  { name: 'DATABASE_URL', value: process.env.DATABASE_URL, required: true },
  { name: 'JWT_SECRET', value: process.env.JWT_SECRET, required: true },
  { name: 'NODE_ENV', value: process.env.NODE_ENV, required: true },
  { name: 'NEXT_PUBLIC_APP_URL', value: process.env.NEXT_PUBLIC_APP_URL, required: false },
];

let allGood = true;

checks.forEach(check => {
  if (check.required && !check.value) {
    console.log(`❌ ${check.name}: MISSING`);
    allGood = false;
  } else if (check.value) {
    const displayValue = check.value.length > 30 
      ? check.value.substring(0, 30) + '...' 
      : check.value;
    console.log(`✅ ${check.name}: ${displayValue}`);
  } else {
    console.log(`⚠️ ${check.name}: Optional, not set`);
  }
});

if (allGood) {
  console.log('\n✅ All required environment variables are configured!');
} else {
  console.log('\n❌ Some required environment variables are missing!');
  process.exit(1);
}

// Test database connection briefly
if (process.env.DATABASE_URL) {
  console.log('\n🔍 Testing database connection...');
  try {
    // This is a very basic check - just parsing the URL
    const url = new URL(process.env.DATABASE_URL);
    console.log(`✅ Database URL is valid: ${url.hostname}:${url.port}`);
  } catch (error) {
    console.log(`❌ Invalid database URL: ${error.message}`);
    allGood = false;
  }
}

console.log('\n🏁 Environment check complete!');
