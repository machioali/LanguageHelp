# 🧪 Subscription System Testing Guide

## How to Test the Subscription Functionality

### 1. **Start Your Development Server**

```bash
npm run dev
# or
yarn dev
```

### 2. **Navigate to the Dashboard**

1. Sign in to your application
2. Go to `/dashboard`
3. You'll see a floating test panel in the bottom-right corner

### 3. **Test Scenarios**

#### **Scenario 1: New User (No Subscription)**
- **Expected State**: Dashboard shows "Getting Started" onboarding
- **What to check**:
  - ✅ Header says "Get started by choosing a plan"
  - ✅ Large onboarding card with "Get Started with LanguageHelp"
  - ✅ All interpreter request fields are disabled
  - ✅ Button says "Choose Plan to Start" 
  - ✅ No usage stats shown
  - ✅ "No Active Plan" in sidebar

#### **Scenario 2: Select Free Trial**
- **Action**: Click "Free Trial (60 min)" in the test panel
- **Expected Changes**:
  - ✅ Dashboard transforms to show stats cards
  - ✅ Header shows "You have 60 interpretation minutes remaining"
  - ✅ Stats show: 0 sessions, 0 used, 60 remaining
  - ✅ Interpreter request form becomes enabled
  - ✅ Button changes to "Request Interpreter"
  - ✅ Sidebar shows "Free Trial" with progress bar at 100%

#### **Scenario 3: Use Some Minutes**
- **Action**: Click "Use 30 min" in test panel
- **Expected Changes**:
  - ✅ "Minutes Used" changes to 30
  - ✅ "Minutes Remaining" changes to 30
  - ✅ Progress bar updates to 50%
  - ✅ Header updates to show "30 interpretation minutes remaining"

#### **Scenario 4: Try Different Plans**
- **Action**: Click "Basic Plan (300 min)" 
- **Expected Changes**:
  - ✅ Stats update to show 300 total minutes
  - ✅ Progress bar resets to 100%
  - ✅ Sidebar shows "Basic Plan"

#### **Scenario 5: Test Interpreter Request**
- **Action**: 
  1. Select a language (e.g., Spanish)
  2. Click "Request Interpreter"
- **Expected**: 
  - ✅ Shows loading spinner with "Connecting..."
  - ✅ After 2 seconds, shows success alert

#### **Scenario 6: Cancel Subscription**
- **Action**: Click "Cancel Subscription"
- **Expected Changes**:
  - ✅ Dashboard reverts to "Getting Started" state
  - ✅ All features become disabled again
  - ✅ Stats disappear, onboarding returns

### 4. **Browser Developer Tools Testing**

#### **Check localStorage**
1. Open browser dev tools (F12)
2. Go to Application tab → localStorage
3. Look for keys like `subscription_your-email@example.com`
4. Verify data is stored and retrieved correctly

#### **Network Tab** (for future API integration)
- Check if API calls are made when subscription changes
- Verify proper error handling

### 5. **Edge Cases to Test**

#### **Multiple Browser Tabs**
- Open dashboard in 2 tabs
- Change subscription in one tab
- Refresh the other tab to see if it updates

#### **Browser Refresh**
- Select a plan
- Refresh the page
- Verify the subscription state persists

#### **Different User Accounts**
- Sign out and sign in with different account
- Verify each user has separate subscription data

### 6. **What to Look For**

#### **✅ Good Signs**
- Smooth transitions between states
- No console errors
- UI updates immediately when subscription changes
- All features work as expected based on plan
- localStorage data is properly managed

#### **❌ Red Flags**
- Console errors or warnings
- UI doesn't update after plan selection
- Features enabled when they shouldn't be
- Data not persisting across page refreshes
- Multiple users sharing subscription data

### 7. **Remove Test Panel Before Production**

When ready for production:

1. Remove the import and usage of `SubscriptionDemo` from the dashboard
2. Replace localStorage logic with real API calls
3. Connect to actual payment processor

```typescript
// Remove this line from dashboard
import { SubscriptionDemo } from '@/components/demo/SubscriptionDemo';

// Remove this from JSX
<div className="fixed bottom-4 right-4 z-50">
  <SubscriptionDemo />
</div>
```

### 8. **Test Commands**

```bash
# Check for TypeScript errors
npm run type-check

# Run linting
npm run lint

# Build for production to catch any issues
npm run build
```

---

## 🎯 **Quick Test Checklist**

- [ ] Dashboard loads without errors
- [ ] New user sees onboarding
- [ ] Can select different plans
- [ ] UI updates properly for each plan
- [ ] Can simulate usage
- [ ] Can cancel subscription
- [ ] Data persists across refreshes
- [ ] Different users have separate data
- [ ] No console errors
- [ ] All buttons and forms work as expected

---

**Happy Testing! 🚀**
