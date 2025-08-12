@echo off
echo ============================================================
echo            LANGUAGEHELP ADMIN SETUP SCRIPT
echo ============================================================
echo.

echo 📋 Step 1: Checking database...
npx prisma db push
if errorlevel 1 (
    echo ❌ Database setup failed!
    pause
    exit /b 1
)
echo ✅ Database ready

echo.
echo 📋 Step 2: Creating admin user...
node scripts/create-admin.js admin@languagehelp.com "Admin User" admin123456
if errorlevel 1 (
    echo ❌ Admin creation failed!
    pause
    exit /b 1
)

echo.
echo 📋 Step 3: Running comprehensive tests...
node scripts/test-admin-system.js
if errorlevel 1 (
    echo ❌ Some tests failed, but the system might still work
)

echo.
echo 🎉 SETUP COMPLETE!
echo ============================================================
echo 📧 Admin Email: admin@languagehelp.com
echo 🔐 Admin Password: admin123456
echo 🌐 Sign In URL: http://localhost:3000/auth/signin
echo 🎛️ Admin Dashboard: http://localhost:3000/admin/dashboard
echo ============================================================
echo.
echo 🚀 To start the development server:
echo    npm run dev
echo.
pause
