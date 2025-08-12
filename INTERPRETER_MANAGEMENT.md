# Interpreter Management System

This document explains how to manage interpreter accounts in the LanguageHelp platform, including creating accounts from the backend and understanding the sign-in process.

## Overview

The interpreter management system is designed with security in mind:
- **No public signup**: Interpreters cannot create their own accounts
- **Admin-only creation**: Only administrators can create interpreter accounts
- **Secure onboarding**: Interpreters receive temporary credentials or tokens for first login
- **Password reset flow**: Interpreters must set their own secure password on first login

## System Components

### 1. Interpreter Sign-In Page
- **Location**: `/auth/interpreter-signin`
- **File**: `src/app/auth/interpreter-signin/page.tsx`
- **Features**:
  - Email + password authentication
  - Login token support for first-time access
  - Password change flow for new interpreters
  - Secure credential handling

### 2. Admin API for Creating Interpreters
- **Endpoint**: `POST /api/admin/interpreters/create`
- **File**: `src/app/api/admin/interpreters/create/route.ts`
- **Features**:
  - Complete interpreter profile creation
  - Automatic credential generation
  - Language and specialization management
  - Certification tracking

### 3. CLI Tools for Account Management
- **Interactive CLI**: `scripts/create-interpreter.js`
- **API Helper**: `scripts/create-account.js`
- **Features**:
  - Guided account creation process
  - Automatic credential generation
  - JSON data file generation

## Creating Interpreter Accounts

### Method 1: Interactive CLI Tool (Recommended)

1. **Run the interactive CLI**:
   ```bash
   node scripts/create-interpreter.js
   ```

2. **Follow the prompts** to enter:
   - Basic information (name, email, phone)
   - Languages with proficiency levels
   - Specializations
   - Professional details (rate, experience, bio)
   - Certifications (optional)
   - Creation options

3. **Confirm and create**: The tool will generate a JSON file with the interpreter data

4. **Execute the creation**:
   ```bash
   # Make sure your dev server is running first
   npm run dev

   # Then use the generated file
   node scripts/create-account.js temp/interpreter-jane-doe-2024-01-15T10-30-00-000Z.json
   ```

### Method 2: Direct API Call

1. **Prepare JSON data** (see example below)
2. **Make API request**:
   ```bash
   curl -X POST http://localhost:3000/api/admin/interpreters/create \
     -H "Content-Type: application/json" \
     -d @interpreter-data.json
   ```

### Method 3: Using HTTP Client (Postman, Insomnia, etc.)

- **URL**: `POST http://localhost:3000/api/admin/interpreters/create`
- **Headers**: `Content-Type: application/json`
- **Body**: JSON data (see schema below)

## JSON Data Schema

```json
{
  "email": "jane.doe@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "+1-555-0123",
  "languages": [
    {
      "languageCode": "en",
      "languageName": "English",
      "proficiency": "NATIVE",
      "isNative": true
    },
    {
      "languageCode": "es",
      "languageName": "Spanish",
      "proficiency": "FLUENT",
      "isNative": false
    }
  ],
  "specializations": ["HEALTHCARE", "LEGAL"],
  "hourlyRate": 85.00,
  "bio": "Experienced medical and legal interpreter with 10+ years in the field.",
  "experience": 10,
  "certifications": [
    {
      "name": "Certified Healthcare Interpreter",
      "issuingOrganization": "National Board of Certification for Medical Interpreters",
      "issueDate": "2020-06-15",
      "expiryDate": "2025-06-15",
      "certificateNumber": "CHI-12345",
      "isVerified": true
    }
  ],
  "sendCredentials": true,
  "autoApprove": false
}
```

### Required Fields

- `email`: Valid email address (unique)
- `firstName`: Interpreter's first name
- `lastName`: Interpreter's last name
- `languages`: Array of at least one language object
  - `languageCode`: ISO language code (e.g., "en", "es")
  - `languageName`: Full language name
  - `proficiency`: One of `NATIVE`, `FLUENT`, `ADVANCED`, `INTERMEDIATE`, `BASIC`
  - `isNative`: Boolean indicating if it's a native language
- `specializations`: Array of at least one specialization from:
  - `HEALTHCARE`, `LEGAL`, `BUSINESS`, `EDUCATION`, `GOVERNMENT`
  - `TECHNICAL`, `CONFERENCE`, `EMERGENCY`, `GENERAL`

### Optional Fields

- `phone`: Phone number
- `hourlyRate`: Hourly rate in USD
- `bio`: Professional biography/description
- `experience`: Years of experience (integer)
- `availability`: JSON string for availability schedule
- `certifications`: Array of certification objects
- `sendCredentials`: Whether to include login credentials in response (default: true)
- `autoApprove`: Whether to auto-approve the interpreter (default: false)

## Interpreter Onboarding Process

### 1. Account Creation
- Administrator creates the interpreter account using one of the methods above
- System generates temporary credentials:
  - Temporary password (12-character secure password)
  - Login token (64-character hex string)
  - Token expiry (48 hours from creation)

### 2. Credential Delivery
- Credentials are returned in the API response (if `sendCredentials: true`)
- Administrator shares credentials with the interpreter via secure method
- Credentials include login URL and instructions

### 3. First Login
- Interpreter visits the sign-in page
- Can use either temporary password OR login token
- System verifies credentials and interpreter role

### 4. Password Setup
- On first successful authentication, interpreter is prompted to set a new password
- Must provide new password (minimum 8 characters)
- System updates account and clears temporary credentials

### 5. Access Granted
- Interpreter can now access their dashboard
- Can use regular email + password authentication
- Session management handled by NextAuth

## Security Features

### Authentication
- Separate authentication flow from regular clients
- JWT-based session management
- Secure credential generation using crypto functions
- Password hashing with bcrypt (12 salt rounds)

### Access Control
- Interpreters cannot access client-only areas
- Role-based routing and API protection
- Secure token validation

### Credential Management
- Temporary passwords expire after first use
- Login tokens expire after 48 hours
- Forced password change on first login
- All sensitive operations are logged

## Database Schema

The system uses the following main tables:

- **User**: Core user account with role and basic info
- **InterpreterProfile**: Extended interpreter information
- **InterpreterCredential**: Authentication and login tracking
- **InterpreterLanguage**: Language proficiencies
- **InterpreterSpecialization**: Areas of expertise
- **InterpreterCertification**: Professional certifications

## API Responses

### Successful Creation
```json
{
  "success": true,
  "message": "Interpreter account created successfully",
  "interpreter": {
    "id": "clr8abc123def456",
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "status": "PENDING",
    "languages": [...],
    "specializations": [...],
    "certifications": [...]
  },
  "credentials": {
    "tempPassword": "K9m#Lp2@Qw8x",
    "loginToken": "a1b2c3d4e5f6...",
    "tokenExpiry": "2024-01-17T10:30:00.000Z",
    "loginUrl": "http://localhost:3000/auth/interpreter-signin",
    "instructions": [
      "1. Go to the interpreter sign-in page",
      "2. Enter your email address",
      "3. Use either the temporary password or login token to sign in",
      "4. You'll be prompted to set a new password on first login",
      "5. After setting your password, you'll have access to your dashboard"
    ]
  }
}
```

### Error Response
```json
{
  "error": "An account with this email already exists"
}
```

Or with validation details:
```json
{
  "error": "Invalid input data",
  "details": [
    {
      "path": "email",
      "message": "Invalid email address"
    }
  ]
}
```

## Managing Existing Interpreters

### Status Management
Interpreter statuses include:
- `PENDING`: Awaiting approval
- `APPROVED`: Approved but not yet active
- `ACTIVE`: Currently active and available
- `INACTIVE`: Temporarily inactive
- `SUSPENDED`: Account suspended
- `REJECTED`: Application rejected

### Updating Profiles
Use the database directly or create additional API endpoints for:
- Updating profile information
- Managing certifications
- Adjusting rates and availability
- Status changes

## Security Considerations

1. **Admin Authentication**: In production, add proper admin authentication to the creation API
2. **Rate Limiting**: Implement rate limiting on authentication endpoints
3. **Audit Logging**: Log all account creation and authentication events
4. **Credential Transmission**: Use secure channels for delivering credentials to interpreters
5. **Token Expiry**: Consider shorter token expiry times for higher security environments
6. **Database Security**: Ensure database connections are encrypted and properly secured

## Troubleshooting

### Common Issues

1. **"Invalid email or not an interpreter account"**
   - Email doesn't exist in database
   - User exists but role is not INTERPRETER
   - Check database for user record

2. **"Invalid or expired login token"**
   - Token has expired (48-hour limit)
   - Token was already used
   - Generate new credentials

3. **"Account credentials not found"**
   - InterpreterCredential record missing
   - Database integrity issue
   - Contact administrator

### Checking Account Status

```sql
-- Check user and interpreter profile
SELECT u.id, u.email, u.role, ip.status, ip.isVerified
FROM users u
LEFT JOIN InterpreterProfile ip ON u.id = ip.userId
WHERE u.email = 'interpreter@example.com';

-- Check credentials
SELECT ic.isFirstLogin, ic.tokenExpiry, ic.lastLoginAt
FROM users u
JOIN InterpreterProfile ip ON u.id = ip.userId
JOIN InterpreterCredential ic ON ip.id = ic.interpreterProfileId
WHERE u.email = 'interpreter@example.com';
```

## Future Enhancements

1. **Email Integration**: Automatic credential delivery via email
2. **Admin Dashboard**: Web interface for managing interpreters
3. **Bulk Import**: CSV/Excel import functionality
4. **Advanced Scheduling**: Availability management system
5. **Performance Metrics**: Tracking and reporting system
6. **Multi-factor Authentication**: Enhanced security options
