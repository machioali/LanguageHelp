@echo off
echo 🚀 Starting LanguageHelp Admin Dashboard...
echo.

REM Start the development server
echo 📦 Installing dependencies (if needed)...
call npm install --silent

echo 🔧 Starting development server...
start /min cmd /c "npm run dev"

echo ⏳ Waiting for server to start...
timeout /t 8 /nobreak >nul

echo 🌐 Opening admin dashboard...
start http://localhost:3000/admin/dashboard

echo.
echo ✅ Admin dashboard should now be open in your browser!
echo.
echo 📋 Available URLs:
echo    • Admin Dashboard: http://localhost:3000/admin/dashboard
echo    • Create Interpreter: http://localhost:3000/admin/create-interpreter
echo    • Main Site: http://localhost:3000
echo.
echo 🛠️  To create interpreters:
echo    • Use Web Interface: Click 'Create Interpreter' button
echo    • Use CLI: node scripts/create-interpreter.js
echo.
pause
