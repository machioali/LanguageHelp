# LanguageHelp Deployment Script for Vercel
# Run this script to prepare and deploy your application to Vercel

param(
    [switch]$Setup,
    [switch]$Deploy,
    [switch]$Database,
    [switch]$All
)

Write-Host "🚀 LanguageHelp Deployment Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

function Show-Help {
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\scripts\deploy.ps1 -Setup    # Initial setup and checks"
    Write-Host "  .\scripts\deploy.ps1 -Database # Setup database migration"
    Write-Host "  .\scripts\deploy.ps1 -Deploy   # Deploy to Vercel"
    Write-Host "  .\scripts\deploy.ps1 -All      # Complete deployment process"
    Write-Host ""
}

function Test-Prerequisites {
    Write-Host "🔍 Checking prerequisites..." -ForegroundColor Blue
    
    # Check if npm is installed
    try {
        $npmVersion = npm --version
        Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
        return $false
    }
    
    # Check if Vercel CLI is installed
    try {
        $vercelVersion = vercel --version
        Write-Host "✅ Vercel CLI version: $vercelVersion" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Vercel CLI not found. Installing..." -ForegroundColor Yellow
        npm install -g vercel
        Write-Host "✅ Vercel CLI installed" -ForegroundColor Green
    }
    
    return $true
}

function Setup-Environment {
    Write-Host "🔧 Setting up environment..." -ForegroundColor Blue
    
    # Install dependencies
    Write-Host "📦 Installing dependencies..."
    npm install
    
    # Generate Prisma client
    Write-Host "🔄 Generating Prisma client..."
    npx prisma generate
    
    # Type check
    Write-Host "📝 Running type check..."
    npm run type-check
    
    # Build check
    Write-Host "🏗️ Testing build..."
    npm run build
    
    Write-Host "✅ Environment setup complete!" -ForegroundColor Green
}

function Setup-Database {
    Write-Host "🗄️ Setting up database..." -ForegroundColor Blue
    
    Write-Host ""
    Write-Host "📋 Database Setup Instructions:" -ForegroundColor Yellow
    Write-Host "1. Create a PostgreSQL database with one of these providers:"
    Write-Host "   - Supabase (Recommended): https://supabase.com"
    Write-Host "   - PlanetScale: https://planetscale.com" 
    Write-Host "   - Railway: https://railway.app"
    Write-Host "   - Neon: https://neon.tech"
    Write-Host ""
    Write-Host "2. Get your DATABASE_URL connection string"
    Write-Host "3. Add it to your Vercel environment variables"
    Write-Host ""
    
    $dbChoice = Read-Host "Which database provider are you using? (supabase/planetscale/railway/neon/other)"
    
    switch ($dbChoice.ToLower()) {
        "supabase" {
            Write-Host "📖 Supabase Setup:" -ForegroundColor Cyan
            Write-Host "1. Go to https://supabase.com and create a project"
            Write-Host "2. Go to Settings > Database"
            Write-Host "3. Copy the connection string (URI)"
            Write-Host "4. Add ?sslmode=require to the end"
        }
        "planetscale" {
            Write-Host "📖 PlanetScale Setup:" -ForegroundColor Cyan
            Write-Host "1. Go to https://planetscale.com and create a database"
            Write-Host "2. Create a production branch"
            Write-Host "3. Generate a password"
            Write-Host "4. Use the provided connection string"
        }
        "railway" {
            Write-Host "📖 Railway Setup:" -ForegroundColor Cyan
            Write-Host "1. Go to https://railway.app"
            Write-Host "2. Create a new project with PostgreSQL"
            Write-Host "3. Copy the DATABASE_URL from variables"
        }
        default {
            Write-Host "📖 Make sure your DATABASE_URL includes ?sslmode=require for PostgreSQL" -ForegroundColor Cyan
        }
    }
    
    Write-Host ""
    Write-Host "Once you have your DATABASE_URL, run:" -ForegroundColor Yellow
    Write-Host "npx prisma db push" -ForegroundColor White
    Write-Host ""
}

function Deploy-ToVercel {
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Blue
    
    # Check if user is logged in to Vercel
    try {
        $vercelUser = vercel whoami
        Write-Host "✅ Logged in as: $vercelUser" -ForegroundColor Green
    }
    catch {
        Write-Host "🔐 Please log in to Vercel..."
        vercel login
    }
    
    Write-Host "📤 Starting deployment..."
    
    # Deploy to Vercel
    vercel --prod
    
    Write-Host ""
    Write-Host "✅ Deployment complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔧 Don't forget to set environment variables in Vercel dashboard:" -ForegroundColor Yellow
    Write-Host "   - NEXTAUTH_URL (your Vercel app URL)"
    Write-Host "   - NEXTAUTH_SECRET (long random string)"
    Write-Host "   - DATABASE_URL (your PostgreSQL connection string)"
    Write-Host "   - JWT_SECRET (another long random string)"
    Write-Host ""
}

# Main execution
if (-not ($Setup -or $Deploy -or $Database -or $All)) {
    Show-Help
    exit 1
}

if (-not (Test-Prerequisites)) {
    Write-Host "❌ Prerequisites check failed" -ForegroundColor Red
    exit 1
}

if ($Setup -or $All) {
    Setup-Environment
}

if ($Database -or $All) {
    Setup-Database
}

if ($Deploy -or $All) {
    Deploy-ToVercel
}

Write-Host ""
Write-Host "🎉 Deployment process completed!" -ForegroundColor Green
Write-Host "📖 Check the DEPLOYMENT_GUIDE.md for detailed instructions" -ForegroundColor Blue
