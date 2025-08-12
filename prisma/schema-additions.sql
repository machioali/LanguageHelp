-- Add these tables to your existing Prisma schema

-- Subscription Plans table
model Plan {
  id          String   @id @default(cuid())
  name        String   // "Free", "Basic", "Premium", etc.
  price       Float    // Monthly price
  currency    String   @default("USD")
  minutes     Int      // Available minutes per month
  features    Json     // Array of features
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  subscriptions UserSubscription[]
  
  @@map("plans")
}

-- User Subscriptions table
model UserSubscription {
  id                String            @id @default(cuid())
  userId            String
  planId            String
  status            SubscriptionStatus @default(ACTIVE)
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  minutesUsed       Int              @default(0)
  minutesRemaining  Int
  stripeSubscriptionId String?        // For Stripe integration
  stripePriceId     String?
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  plan Plan @relation(fields: [planId], references: [id])
  
  @@map("user_subscriptions")
  @@index([userId])
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  TRIAL
}

-- Update User model to include subscription relationship
-- Add this to your existing User model:
-- subscription UserSubscription?
