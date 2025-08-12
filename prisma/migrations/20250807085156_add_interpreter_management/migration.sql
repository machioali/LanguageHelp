-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "companyName" TEXT,
    "phoneNumber" TEXT
);

-- CreateTable
CREATE TABLE "InterpreterProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "hourlyRate" REAL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "bio" TEXT,
    "experience" INTEGER,
    "availability" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InterpreterProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InterpreterCredential" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "interpreterProfileId" TEXT NOT NULL,
    "tempPassword" TEXT,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
    "loginToken" TEXT,
    "tokenExpiry" DATETIME,
    "lastLoginAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InterpreterCredential_interpreterProfileId_fkey" FOREIGN KEY ("interpreterProfileId") REFERENCES "InterpreterProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InterpreterLanguage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "interpreterProfileId" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "languageName" TEXT NOT NULL,
    "proficiency" TEXT NOT NULL,
    "isNative" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InterpreterLanguage_interpreterProfileId_fkey" FOREIGN KEY ("interpreterProfileId") REFERENCES "InterpreterProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InterpreterSpecialization" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "interpreterProfileId" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InterpreterSpecialization_interpreterProfileId_fkey" FOREIGN KEY ("interpreterProfileId") REFERENCES "InterpreterProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InterpreterCertification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "interpreterProfileId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuingOrganization" TEXT NOT NULL,
    "issueDate" DATETIME,
    "expiryDate" DATETIME,
    "certificateNumber" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "InterpreterCertification_interpreterProfileId_fkey" FOREIGN KEY ("interpreterProfileId") REFERENCES "InterpreterProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InterpreterApplication" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "languages" TEXT NOT NULL,
    "specializations" TEXT NOT NULL,
    "experience" INTEGER,
    "certifications" TEXT,
    "bio" TEXT,
    "resume" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "reviewedBy" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "InterpreterProfile_userId_key" ON "InterpreterProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InterpreterCredential_interpreterProfileId_key" ON "InterpreterCredential"("interpreterProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "InterpreterLanguage_interpreterProfileId_languageCode_key" ON "InterpreterLanguage"("interpreterProfileId", "languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "InterpreterSpecialization_interpreterProfileId_specialization_key" ON "InterpreterSpecialization"("interpreterProfileId", "specialization");

-- CreateIndex
CREATE UNIQUE INDEX "InterpreterApplication_email_key" ON "InterpreterApplication"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
