-- CreateTable
CREATE TABLE "InterpreterSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "interpreterProfileId" TEXT NOT NULL,
    "clientId" TEXT,
    "clientName" TEXT NOT NULL,
    "sessionType" TEXT NOT NULL,
    "languageFrom" TEXT NOT NULL DEFAULT 'English',
    "languageTo" TEXT NOT NULL,
    "specialization" TEXT,
    "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" DATETIME NOT NULL,
    "startedAt" DATETIME,
    "endedAt" DATETIME,
    "duration" INTEGER,
    "hourlyRate" REAL,
    "earnings" REAL NOT NULL DEFAULT 0.0,
    "rating" INTEGER,
    "feedback" TEXT,
    "notes" TEXT,
    "cancellationReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "InterpreterSession_interpreterProfileId_fkey" FOREIGN KEY ("interpreterProfileId") REFERENCES "InterpreterProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "InterpreterSession_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SessionBooking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "interpreterProfileId" TEXT,
    "clientId" TEXT NOT NULL,
    "sessionType" TEXT NOT NULL,
    "languageFrom" TEXT NOT NULL DEFAULT 'English',
    "languageTo" TEXT NOT NULL,
    "specialization" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "scheduledAt" DATETIME NOT NULL,
    "duration" INTEGER NOT NULL,
    "hourlyRate" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SessionBooking_interpreterProfileId_fkey" FOREIGN KEY ("interpreterProfileId") REFERENCES "InterpreterProfile" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SessionBooking_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
