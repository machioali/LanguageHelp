# Vercel Deployment Error Fix Guide

## 🚨 Current Issue: Client-Side Exception

The error "Application error: a client-side exception has occurred" indicates a runtime error in the production build on Vercel.

## 🔧 Required Environment Variables for Vercel

### **CRITICAL - Must be set in Vercel Dashboard:**

```bash
# Authentication (REQUIRED)
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-secure-secret-key-here-make-it-long-and-random

# Database (REQUIRED - choose one)
DATABASE_URL=your-production-database-url

# For Supabase (RECOMMENDED):
DATABASE_URL=postgresql://postgres.[PROJECT_ID]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres

# For Railway/Render/Other PostgreSQL:
DATABASE_URL=postgresql://username:password@host:port/database

# Email (OPTIONAL)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 🛠️ Step-by-Step Fix Process

### 1. **Set Environment Variables in Vercel**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable for all environments (Production, Preview, Development)

### 2. **Update Next.js Configuration**
The `next.config.js` might need updates for the new Next.js version:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Simplified webpack config for Vercel compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
  // Environment variables for client-side
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
}

module.exports = nextConfig
```

### 3. **Update Vercel Configuration**
Update `vercel.json` for better compatibility:

```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "buildCommand": "npx prisma generate && npm run build",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 4. **Database Setup**
- **Option A: Supabase (Recommended)**
  1. Create project at [supabase.com](https://supabase.com)
  2. Get connection string from Settings → Database
  3. Add to Vercel as `DATABASE_URL`

- **Option B: Railway**
  1. Create PostgreSQL database at [railway.app](https://railway.app)
  2. Copy connection string
  3. Add to Vercel as `DATABASE_URL`

### 5. **Force Redeploy**
After setting environment variables:
1. Go to Deployments tab in Vercel
2. Click "..." on latest deployment
3. Click "Redeploy"

## 🔍 Common Issues & Solutions

### Issue 1: NEXTAUTH_SECRET Missing
**Error:** Authentication not working
**Solution:** Generate a secure secret:
```bash
openssl rand -base64 32
```
Add as `NEXTAUTH_SECRET` in Vercel

### Issue 2: Database Connection
**Error:** Prisma connection errors
**Solution:** 
- Ensure DATABASE_URL is correct
- For Supabase: Use connection pooling URL
- Test connection locally first

### Issue 3: Client-Side Hydration Errors
**Error:** Hydration mismatches
**Solution:**
- Clear Vercel cache
- Ensure all environment variables are set
- Check for SSR/client-side differences

### Issue 4: Build Failures
**Error:** Build command fails
**Solution:**
- Update build command: `npx prisma generate && npm run build`
- Ensure all dependencies are in package.json
- Check Node.js version compatibility

## 🚀 Quick Setup Commands

### For Supabase Database:
```sql
-- Run in Supabase SQL Editor after connecting
-- This will create all necessary tables
-- (Prisma will handle this automatically on first deploy)
```

### For Testing Locally:
```bash
# Test production build locally
npm run build
npm start

# Test with production database
export DATABASE_URL="your-production-url"
npx prisma db push
npm run build
npm start
```

## 📋 Environment Variables Checklist

Copy these exact variable names to Vercel:

- [ ] `NEXTAUTH_URL` (your Vercel app URL)
- [ ] `NEXTAUTH_SECRET` (secure random string)
- [ ] `DATABASE_URL` (PostgreSQL connection string)
- [ ] `SMTP_HOST` (optional, for emails)
- [ ] `SMTP_PORT` (optional, for emails) 
- [ ] `SMTP_USER` (optional, for emails)
- [ ] `SMTP_PASS` (optional, for emails)

## 🔧 Debugging Steps

1. **Check Vercel Function Logs:**
   - Go to Vercel Dashboard → Functions tab
   - Look for error messages

2. **Check Browser Console:**
   - Press F12 in browser
   - Look for JavaScript errors
   - Check Network tab for failed requests

3. **Test API Routes:**
   - Try: `https://your-app.vercel.app/api/auth/session`
   - Should return authentication status

4. **Database Connection:**
   - Check if Prisma can connect
   - Verify DATABASE_URL format

## 🎯 Most Likely Solutions

1. **Missing NEXTAUTH_SECRET** - Generate and add this first
2. **Wrong NEXTAUTH_URL** - Must match your Vercel app URL exactly
3. **Database URL format** - Ensure proper PostgreSQL format
4. **Environment Variables** - Must be set for Production environment

After setting these, redeploy and the error should be resolved.
