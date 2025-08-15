# Switch to Railway PostgreSQL

## Steps to switch from Supabase to Railway:

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   - Click "New Project"
   - Select "PostgreSQL"
   - Railway will provide you with connection details

3. **Update Environment Variables**
   - Replace DATABASE_URL with Railway's connection string
   - Format: `postgresql://username:password@host:port/database`

4. **Migrate Your Data**
   ```bash
   # Export from Supabase
   pg_dump "postgresql://postgres.iyzmkdkqgoayujxnxvov:Hamzaali@2004@aws-0-us-west-1.pooler.supabase.com:6543/postgres" > backup.sql
   
   # Import to Railway
   psql "your-railway-connection-string" < backup.sql
   ```

## Pros:
- Simple setup
- Good for development
- Integrated with Git deployments

## Cons:
- Less features than Supabase
- Smaller free tier
