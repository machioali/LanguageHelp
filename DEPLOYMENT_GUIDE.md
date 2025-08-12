# Language Help - Deployment Guide

This guide will help you deploy your language interpretation application online so your friends can access it on their phones.

## Prerequisites

Before deploying, make sure you have:
- A GitHub account (for code hosting)
- Git installed on your computer
- Your project code committed to a Git repository

## Option 1: Vercel Deployment (Recommended - Easiest)

Vercel is the easiest way to deploy Next.js applications with automatic CI/CD.

### Steps:

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/languagehelp.git
   git push -u origin main
   ```

2. **Sign up for Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

3. **Deploy from GitHub:**
   - Click "New Project" in Vercel dashboard
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

4. **Set up Environment Variables in Vercel:**
   Go to your project settings and add these environment variables:
   ```
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=your-very-long-random-secret-key
   DATABASE_URL=postgresql://username:password@hostname:5432/database
   ```

5. **Set up Production Database:**
   - Use [Supabase](https://supabase.com) (free PostgreSQL)
   - Or [PlanetScale](https://planetscale.com) (free MySQL)
   - Or [Railway](https://railway.app) (PostgreSQL)

### Supabase Database Setup (Recommended):
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your database URL from Settings > Database
4. Add it as `DATABASE_URL` in Vercel environment variables

## Option 2: Railway Deployment (Good Alternative)

Railway is another easy deployment platform.

### Steps:
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables
6. Deploy!

## Option 3: Digital Ocean App Platform

Good for more control and scaling.

### Steps:
1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Create new app from GitHub
3. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
4. Add environment variables
5. Deploy!

## Option 4: Docker + VPS (Advanced)

If you want to use your own server or VPS.

### Prerequisites:
- A VPS (like DigitalOcean Droplet, AWS EC2, etc.)
- Docker installed on the server

### Steps:
1. **Build and run with Docker:**
   ```bash
   # Build the image
   docker build -t languagehelp .
   
   # Run with docker-compose
   docker-compose up -d
   ```

2. **Set up reverse proxy (Nginx):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
       
       location /socket.io/ {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

## Database Migration for Production

Since you're currently using SQLite, you'll need to migrate to PostgreSQL for production:

1. **Update your schema.prisma:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## Environment Variables You Need

Create these environment variables in your deployment platform:

### Required:
- `NEXTAUTH_URL` - Your app's URL (e.g., https://your-app.vercel.app)
- `NEXTAUTH_SECRET` - A long random string for JWT encryption
- `DATABASE_URL` - Your PostgreSQL connection string

### Optional:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` - For email functionality
- `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` - If using payments

## Testing Your Deployment

1. **Check if the app loads:**
   - Visit your deployed URL
   - Test user registration/login
   - Test interpreter portal

2. **Test video calling:**
   - Create test accounts (client and interpreter)
   - Test video call functionality
   - Verify the persistent room features work

3. **Mobile testing:**
   - Open the app on different phones
   - Test video calls between phones
   - Check responsive design

## Making Your App Mobile-Friendly

Your app should work on mobile browsers, but you can also:

1. **Add PWA support:**
   ```bash
   npm install next-pwa
   ```

2. **Create a manifest.json:**
   ```json
   {
     "name": "Language Help",
     "short_name": "LangHelp",
     "theme_color": "#000000",
     "background_color": "#ffffff",
     "display": "standalone",
     "start_url": "/"
   }
   ```

## Troubleshooting

### Common Issues:

1. **Environment variables not working:**
   - Make sure they're set in your deployment platform
   - Restart your deployment after adding variables

2. **Database connection errors:**
   - Verify your DATABASE_URL is correct
   - Make sure your database allows connections from your deployment platform

3. **Socket.IO not working:**
   - Check that both ports (3000 and 3001) are accessible
   - Verify WebSocket support in your deployment platform

4. **Video calls not working:**
   - Ensure HTTPS is enabled (required for WebRTC)
   - Check browser permissions for camera/microphone

## Security Considerations

1. **Use HTTPS everywhere** (most platforms provide this automatically)
2. **Set strong NEXTAUTH_SECRET**
3. **Use environment variables for all secrets**
4. **Enable database SSL in production**
5. **Set up CORS properly for your domain**

## Recommended Deployment Path

For the easiest deployment that will work immediately:

1. **Use Vercel + Supabase:**
   - Vercel for app hosting (free tier available)
   - Supabase for PostgreSQL database (free tier available)
   - Both are beginner-friendly with good documentation

2. **Steps:**
   1. Push code to GitHub
   2. Create Supabase project and get database URL
   3. Deploy to Vercel from GitHub
   4. Add environment variables in Vercel
   5. Your app will be live at `https://your-project.vercel.app`

## Need Help?

If you run into issues:
1. Check the deployment platform's logs
2. Test locally first with production environment variables
3. Verify all environment variables are set correctly
4. Make sure your database is accessible from your deployment platform

Your friends will be able to access the app on their phones once deployed!
