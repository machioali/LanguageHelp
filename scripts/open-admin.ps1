# LanguageHelp Admin Dashboard Launcher
# This script starts the development server and opens the admin dashboard

Write-Host "🚀 Starting LanguageHelp Admin Dashboard..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is available
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Not in the LanguageHelp project directory" -ForegroundColor Red
    Write-Host "Please run this script from the project root directory" -ForegroundColor Yellow
    exit 1
}

# Start the development server in the background
Write-Host "📦 Installing dependencies (if needed)..." -ForegroundColor Cyan
npm install --silent

Write-Host "🔧 Starting development server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-Command", "cd '$PWD'; npm run dev" -WindowStyle Minimized

# Wait a moment for the server to start
Write-Host "⏳ Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Open the admin dashboard in the default browser
$adminUrl = "http://localhost:3000/admin/dashboard"
Write-Host "🌐 Opening admin dashboard at: $adminUrl" -ForegroundColor Green

try {
    Start-Process $adminUrl
    Write-Host "✅ Admin dashboard should now be open in your browser!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Available Admin URLs:" -ForegroundColor Cyan
    Write-Host "   • Admin Dashboard: http://localhost:3000/admin/dashboard" -ForegroundColor White
    Write-Host "   • Create Interpreter (Web): http://localhost:3000/admin/create-interpreter" -ForegroundColor White
    Write-Host "   • Main Site: http://localhost:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "🛠️  To create interpreters:" -ForegroundColor Cyan
    Write-Host "   • Use Web Interface: Click 'Create Interpreter' button in dashboard" -ForegroundColor White
    Write-Host "   • Use CLI: node scripts/create-interpreter.js" -ForegroundColor White
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
} catch {
    Write-Host "❌ Could not open browser automatically" -ForegroundColor Red
    Write-Host "Please manually open: $adminUrl" -ForegroundColor Yellow
}
