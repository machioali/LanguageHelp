# Database Configuration - Supabase

## Connection Types

### 1. Transaction Pooler (Port 6543) - **NOT COMPATIBLE**
```
postgresql://postgres.iyzmkdkqgoayujxnxvov:Hamza@2025@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```
- ❌ **Do not use** - Does not support prepared statements
- ❌ Causes `prepared statement "s0" already exists` errors
- ✅ Good for simple serverless functions only

### 2. Session Pooler (Port 5432) - **RECOMMENDED FOR THIS PROJECT**
```
postgresql://postgres.iyzmkdkqgoayujxnxvov:Hamza@2025@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```
- ✅ **Currently using** - Works with Prisma ORM
- ✅ Supports prepared statements
- ✅ IPv4 compatible
- ✅ Good for Next.js applications

### 3. Direct Connection (Port 5432) - **NOT AVAILABLE**
```
postgresql://postgres:Hamza@2025@db.iyzmkdkqgoayujxnxvov.supabase.co:5432/postgres
```
- ❌ Not reachable (likely restricted on free tier)

## Database Schema Status
- ✅ All tables created successfully using `npx prisma db push`
- ✅ Database schema is in sync with Prisma schema
- ✅ Authentication tables ready

## Environment Files
- `.env` - Production configuration
- `.env.local` - Local development configuration
- Both configured to use Session Pooler (port 5432)

## Troubleshooting
If you see prepared statement errors, ensure you're using:
- **Session Pooler** (port 5432) - NOT Transaction Pooler (port 6543)
