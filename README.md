# Finance & Budget Tracker — MCA Semester III End-of-Semester (EoS) Practical Exam

**Student Name:** Priyadharshini K  
**Register No:** 1P25MC041  
**Course:** MCA Semester III  
**Subject:** Mobile Application Development (React Native)  
**Total Marks:** 75 Marks  
**Duration:** 6 Hours  

---

## 📱 Project Overview
**Finance & Budget Tracker** is a full-featured, production-ready React Native application built with Expo. The application provides personal financial tracking, multi-period budgeting analytics, category spending breakdowns, and comprehensive month-wise transaction management with role-based access control (**Admin** vs **Customer**).

---

## 🛠️ Technology Stack
- **Framework:** React Native (Expo SDK 58)
- **Language:** JavaScript (ES6+ / React 19)
- **Navigation Architecture:** React Navigation 7.x
  - **Stack Navigation:** Native Stack for Authentication and deep screen transitions (`@react-navigation/native-stack`)
  - **Bottom Tab Navigation:** 5 core interactive tabs (`@react-navigation/bottom-tabs`)
  - **Drawer Navigation:** Side drawer with user profile banner and role switching (`@react-navigation/drawer`)
- **State Management:** React Context API (`FinanceContext`) with local state persistence
- **Icons & Styling:** `@expo/vector-icons` (Ionicons) with responsive, modern fintech UI

---

## 🚀 Quick Start Instructions

### 1. Prerequisites
- Node.js (v18 or higher installed)
- Expo Go app installed on your physical mobile device (Android / iOS)

### 2. Start the Application
Open a terminal inside the project directory:
```bash
cd "D:\Semester 3\React Native\Sem Exam"
npx expo start -c
```
- Scan the displayed QR code with **Expo Go** on Android, or the Camera app on iOS.
- Press `w` to run on Web browser if needed.
- Press `a` for Android emulator or `i` for iOS simulator.

---

## 🔑 Demo Credentials (One-Tap Testing)

The Sign-In screen includes **one-tap demo buttons** for immediate exam testing:

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Customer** | `priya@example.com` | `password123` | Full access: Dashboard, Analysis, Month Transactions, Categories, Category Details, Profile Editing, Add/Delete Tx with Alerts |
| **Admin** | `admin@financetracker.com` | `admin123` | Global financial auditing, system overview metrics. Customer-only profile editing and wallet actions are securely restricted |

---

## 📋 Comprehensive Requirements Checklist (75 Marks)

### PART I — React Native Screens (30 Marks)
- [x] **Screen 1: Home Screen with Sign Up and Sign In (5 Marks)**
  - Welcome screen with modern finance branding.
  - Role selection toggle (Admin vs Customer).
  - Form validation with descriptive error messages.
  - One-tap demo login shortcuts.
- [x] **Screen 2: Analysis Screen — Admin and Customer (5 Marks)**
  - Financial analysis dashboard accessible to both roles.
  - Total Income, Total Expenses, and Net Balance calculations.
  - Visual Category Spending Breakdown progress bars.
  - Cashflow Inflow vs Outflow ratio indicator.
  - Timeframe filter pills (All Months, October, September, August).
- [x] **Screen 3: Profile and Edit Profile — Customer Only (5 Marks)**
  - Displays customer name, email, phone, account number, monthly budget.
  - Visual monthly budget utilization bar.
  - Edit Profile mode with input validation (email regex, 10-digit phone).
  - Saves updates to state and fires personalized alert.
  - Admin access restriction enforced with warning banners.
- [x] **Screen 4: Month-wise Transaction Screen — Customer Only (5 Marks)**
  - Organizes transactions by month (October 2026, September 2026, August 2026, All Months).
  - Month selection pills and Type filter tabs (All, Expenses, Income).
  - Monthly net savings, income, and expense totals.
  - Add and delete transaction capability.
- [x] **Screen 5: Overall Categories Screen — Customer Only (5 Marks)**
  - Displays 8 spending categories: Food, Travel, Shopping, Bills, Health, Entertainment, Education, Investments.
  - Dynamic spending totals, budget limits, remaining balance, and utilization percentage.
  - Category status tags (On Track, Near Limit, Over Budget).
  - Selectable cards navigating to Category Details.
- [x] **Screen 6: Category Details Screen — Customer (5 Marks)**
  - Receives route parameters (`categoryId`, `categoryName`).
  - Displays category hero banner, icon, total spent, and budget progress.
  - Lists transactions strictly belonging to the selected category.
  - Working back navigation button.

### PART II — React Navigation (30 Marks)
- [x] **7. Stack Navigation (10 Marks):** Native stack handling `SignIn`, `SignUp`, `DrawerRoot`, `CategoryDetails`, `EditProfile`, and direct routes with smooth transitions and back navigation.
- [x] **8. Bottom Tab Navigation (10 Marks):** 5-tab bar (`Home`, `Analysis`, `Transactions`, `Categories`, `Profile`) with active/inactive tints and role-based handling.
- [x] **9. Drawer Navigation (10 Marks):** Side drawer with profile avatar, user info, role badge, navigation links, quick role toggle, and logout confirmation.
- [x] **Integrated Architecture:** Stack contains Drawer; Drawer nests Tabs; Tabs host top-level screens; Stack pushes detail screens.

### PART III — Functional Requirements (15 Marks)
- [x] **10. Navigation Between Screens (5 Marks):** Flawless navigation without crashes, blank screens, or unauthorized route access.
- [x] **11. Personalized Transaction Change Alerts (5 Marks):**
  - Triggers native `Alert.alert` + floating in-app toast on Add, Edit, Delete.
  - Sample: *"Hi Priya, your ₹1,250 Food expense has been added successfully."*
- [x] **12. Daily, Weekly, and Monthly Reports on Home Screen (5 Marks):**
  - Segmented period switch (`Daily` | `Weekly` | `Monthly`).
  - Dynamically calculates Income, Expenses, Balance, and Savings Rate from mock data.
  - Visual comparative cashflow bar.

---

## 📸 Viva & Submission Guide

### Capturing Screenshots for Exam Submission:
1. **Screen 1:** Sign In / Sign Up screen with Demo credentials.
2. **Screen 2:** Analysis screen showing category spending bars and date filters.
3. **Screen 3:** Profile screen & Edit Profile screen showing updated details.
4. **Screen 4:** Month-wise Transactions screen filtered by month.
5. **Screen 5:** Overall Categories screen showing category cards and progress bars.
6. **Screen 6:** Category Details screen with filtered transactions and back button.
7. **Personalized Alert:** Triggering an alert when adding/deleting a transaction showing *"Hi Priya, your ... has been added successfully."*
8. **Drawer Menu:** Side drawer open showing user avatar, role switcher, and navigation items.
9. **Bottom Tabs:** Bottom navigation bar active across screens.

### Uploading to Public GitHub Repository:
```bash
git init
git add .
git commit -m "Complete Finance & Budget Tracker - MCA Sem 3 EoS Exam"
git branch -M main
git remote add origin https://github.com/PriyadharshiniK0207/Finance-Budget-Tracker.git
git push -u origin main
```
