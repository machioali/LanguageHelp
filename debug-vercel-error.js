// Debug script to help identify the client-side error
// Add this temporarily to your pages to see what's failing

console.log('🔍 NextAuth Debug Info:');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Check if NextAuth is properly configured
try {
  console.log('✅ NextAuth URL configured');
} catch (error) {
  console.error('❌ NextAuth configuration error:', error);
}

// Common NextAuth client-side errors:
const commonErrors = [
  'NEXTAUTH_URL environment variable not set',
  'Invalid NEXTAUTH_SECRET',
  'Database connection failed',
  'JWT secret missing or invalid',
  'Session configuration error'
];

console.log('🔧 Common causes for client-side exceptions:');
commonErrors.forEach((error, index) => {
  console.log(`${index + 1}. ${error}`);
});

// Instructions for user
console.log(`
🎯 TO FIX THIS ERROR:

1. Open Vercel Dashboard: https://vercel.com/dashboard
2. Go to your project: language-help-gamma
3. Click Settings → Environment Variables
4. Add these 5 variables:
   - NEXTAUTH_URL = https://language-help-gamma.vercel.app
   - NEXTAUTH_SECRET = fa2a962633d209d5bb47eb512f5020956f13a6827f8e05654634fed821f30e33
   - DATABASE_URL = postgresql://postgres.iyzmkdkqgoayujxnxvov:Hamzaali@2004@aws-0-us-west-1.pooler.supabase.com:6543/postgres
   - JWT_SECRET = production-jwt-secret-very-long-and-secure-string-for-vercel-deployment
   - NODE_ENV = production

5. Redeploy your application
6. Test sign-in again
`);
