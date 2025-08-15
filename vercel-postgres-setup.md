# Switch to Vercel Postgres

## Steps to switch to Vercel's integrated PostgreSQL:

1. **Enable Vercel Postgres**
   - Go to your Vercel project dashboard
   - Click "Storage" tab
   - Click "Create Database"
   - Select "Postgres"

2. **Automatic Environment Variables**
   - Vercel automatically adds database environment variables
   - No manual configuration needed

3. **Update Your Code**
   ```bash
   # Vercel provides these automatically:
   POSTGRES_URL="..."
   POSTGRES_PRISMA_URL="..."
   POSTGRES_URL_NO_SSL="..."
   POSTGRES_URL_NON_POOLING="..."
   ```

4. **Update Prisma Schema**
   - Use POSTGRES_PRISMA_URL for your DATABASE_URL

## Pros:
- Integrated with Vercel
- Zero configuration
- Automatic environment variables
- Good performance

## Cons:
- Tied to Vercel platform
- Limited free tier
- Less flexibility
