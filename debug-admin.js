// Debug script for admin dashboard
// Run this in the browser console when logged in as admin

async function debugAdminDashboard() {
    console.log("🔍 Starting Admin Dashboard Debug...");
    
    // Test 1: Check current session
    try {
        const sessionResponse = await fetch('/api/auth/session');
        const sessionData = await sessionResponse.json();
        console.log("✅ Session Data:", sessionData);
        
        if (!sessionData.user || sessionData.user.role !== 'ADMIN') {
            console.error("❌ User is not admin. Current role:", sessionData.user?.role);
            return;
        }
    } catch (error) {
        console.error("❌ Session check failed:", error);
        return;
    }
    
    // Test 2: Check stats endpoint
    try {
        console.log("🔄 Testing /api/admin/stats...");
        const statsResponse = await fetch('/api/admin/stats');
        const statsData = await statsResponse.json();
        
        if (statsResponse.ok) {
            console.log("✅ Stats API Response:", statsData);
        } else {
            console.error("❌ Stats API Error:", statsResponse.status, statsData);
        }
    } catch (error) {
        console.error("❌ Stats API request failed:", error);
    }
    
    // Test 3: Check users endpoint  
    try {
        console.log("🔄 Testing /api/admin/users...");
        const usersResponse = await fetch('/api/admin/users');
        const usersData = await usersResponse.json();
        
        if (usersResponse.ok) {
            console.log("✅ Users API Response:", usersData);
            console.log(`📊 Found ${usersData.users?.length || 0} users`);
        } else {
            console.error("❌ Users API Error:", usersResponse.status, usersData);
        }
    } catch (error) {
        console.error("❌ Users API request failed:", error);
    }
    
    // Test 4: Check applications endpoint
    try {
        console.log("🔄 Testing /api/admin/applications...");
        const appsResponse = await fetch('/api/admin/applications');
        const appsData = await appsResponse.json();
        
        if (appsResponse.ok) {
            console.log("✅ Applications API Response:", appsData);
            console.log(`📊 Found ${appsData.applications?.length || 0} applications`);
        } else {
            console.error("❌ Applications API Error:", appsResponse.status, appsData);
        }
    } catch (error) {
        console.error("❌ Applications API request failed:", error);
    }
    
    // Test 5: Check database connection
    try {
        console.log("🔄 Testing database connection via stats...");
        const dbTestResponse = await fetch('/api/admin/stats');
        if (dbTestResponse.ok) {
            console.log("✅ Database connection appears to be working");
        } else {
            console.error("❌ Database connection may be failing");
        }
    } catch (error) {
        console.error("❌ Database test failed:", error);
    }
    
    console.log("🏁 Debug completed. Check the logs above for issues.");
}

// Run the debug
debugAdminDashboard();
