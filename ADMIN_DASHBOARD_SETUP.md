# Admin Dashboard Setup Guide

Now that your admin dashboard is working, here's how to populate it with sample data and test all the features.

## 🚀 Quick Setup

### Step 1: Create Sample Data

Run the sample data creation script to populate your Supabase database:

```bash
# Navigate to your project directory
cd D:\projects\languagehelp

# Install dependencies if not already installed
npm install

# Run the sample data script
node scripts/create-sample-data.js
```

This script will create:
- **Admin users**: For testing admin access
- **Client users**: Various business clients
- **Interpreter users**: With different statuses and profiles
- **Interpreter applications**: In various stages (Pending, Under Review, Approved, Rejected)

### Step 2: Login as Admin

Use these credentials to access the admin dashboard:
- **Email**: `admin@languagehelp.com`
- **Password**: `password123`

Navigate to: `http://localhost:3000/admin/dashboard`

## 📊 What You Should See

After running the sample data script, your admin dashboard will display:

### User Overview Stats
- **Total Users**: ~10+ users across all roles
- **Interpreters**: 3 with various statuses
- **Admins**: 2 admin accounts
- **Clients**: 3 business clients

### Applications Tab
- **6 applications** with different statuses:
  - Sofia Rodriguez (PENDING) - Spanish/English, Healthcare & Legal
  - Ahmed Hassan (UNDER_REVIEW) - Arabic/English/French, Business & Government
  - Li Wang (APPROVED) - Chinese/English, Technical & Education
  - Pierre Dubois (REJECTED) - French/English, Conference
  - Yuki Tanaka (PENDING) - Japanese/English, Business & Technical
  - Elena Rossi (UNDER_REVIEW) - Italian/English/Spanish, Healthcare & General

### Users Tab
- **All registered users** with:
  - Role badges (Admin, Interpreter, Client)
  - Status indicators for interpreters
  - Contact information
  - Company details for clients
  - Management actions dropdown

## 🧪 Testing Features

### 1. Search Functionality
- Search by name: "Sofia", "Ahmed", "Tech Corp"
- Search by email: "applicant1@example.com"
- Search by language: "Spanish", "Arabic"
- Search by specialization: "Healthcare", "Legal"

### 2. Filtering
**Applications Tab:**
- Filter by status: Pending, Under Review, Approved, Rejected

**Users Tab:**
- Filter by role: All Users, Clients, Interpreters, Administrators

### 3. Application Management
- Click "Review" on any pending application
- View detailed information (languages, certifications, bio)
- Add admin notes
- Approve or reject applications

### 4. User Management
- Click the three-dot menu (⋮) next to any user
- Test actions like Suspend, Activate, Deactivate (not on yourself!)
- View user-specific information panels

### 5. Tab Navigation
- Switch between "Applications" and "All Users" tabs
- Watch the counters update dynamically
- Notice the different layouts and information displayed

## 🔧 Troubleshooting

### If Dashboard is Empty
1. **Check Database Connection**: 
   - Verify your `DATABASE_URL` in your environment variables
   - Ensure Supabase is running and accessible

2. **Run Debug Script**: 
   - Open browser console on the admin dashboard
   - Copy and paste the contents of `debug-admin.js`
   - Check for any error messages

3. **Check Authentication**:
   - Make sure you're logged in as an admin user
   - Verify the session by checking `/api/auth/session`

4. **Run Sample Data Script Again**:
   ```bash
   node scripts/create-sample-data.js
   ```

### If API Calls Fail
- Check the browser Network tab for failed requests
- Look at the server console for error messages
- Verify that all API endpoints are returning proper responses

### Database Issues
- Make sure Prisma is properly connected to Supabase
- Run `npx prisma db push` to ensure schema is up to date
- Check that all required environment variables are set

## 🎯 Next Steps

Once you have sample data loaded and can see users/applications:

1. **Test Application Workflow**:
   - Approve a pending application
   - See how it creates a new interpreter account
   - Check that credentials are generated

2. **Test User Management**:
   - Create additional admin users via `/admin/create-admin`
   - Create interpreter accounts via `/admin/create-interpreter`
   - Test user suspension/activation

3. **Monitor System Stats**:
   - Watch how stats update as you approve/reject applications
   - See user counts change as you create new accounts

4. **Customize for Production**:
   - Remove sample data when ready
   - Set up proper email notifications
   - Configure real authentication providers

## 📝 Sample Login Credentials

All users created by the sample script use password: `password123`

**Admin Users**:
- `admin@languagehelp.com`
- `admin2@languagehelp.com`

**Interpreter Users**:
- `interpreter1@example.com`
- `interpreter2@example.com` 
- `interpreter3@example.com`

**Client Users**:
- `client1@example.com`
- `client2@example.com`
- `client3@example.com`

---

Your admin dashboard should now be fully functional with sample data! 🎉
