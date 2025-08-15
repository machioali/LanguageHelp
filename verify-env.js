// Verify critical environment variables for production
const requiredEnvVars = {
  'NEXTAUTH_URL': process.env.NEXTAUTH_URL,
  'NEXTAUTH_SECRET': process.env.NEXTAUTH_SECRET,
  'DATABASE_URL': process.env.DATABASE_URL,
  'JWT_SECRET': process.env.JWT_SECRET,
  'NEXT_PUBLIC_APP_URL': process.env.NEXT_PUBLIC_APP_URL,
};

console.log('🔍 Verifying environment variables...\n');

let hasErrors = false;

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    console.error(`❌ Missing: ${key}`);
    hasErrors = true;
  } else if (value.includes('placeholder') || value.includes('your-')) {
    console.error(`❌ Placeholder value: ${key} = ${value}`);
    hasErrors = true;
  } else {
    console.log(`✅ ${key} = ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`);
  }
});

if (hasErrors) {
  console.error('\n❌ Environment configuration has errors. Please fix before deploying.');
  process.exit(1);
} else {
  console.log('\n✅ All environment variables are properly configured!');
}
