# Modern Wealth Studio — Finance & Budget Tracker
## MCA Semester III End-of-Semester (EoS) Practical Examination

**Student Name:** Priyadharshini K  
**Register No:** 1P25MC041  
**Course:** MCA Semester III  
**Subject:** Mobile Application Development (React Native)  
**Total Marks:** 75 Marks | **Exam Duration:** 6 Hours  
**Design System:** Modern Wealth Studio (Editorial Financial Identity)

---

## 🏛️ Distinctive Visual Identity: "Modern Wealth Studio"

To stand out among 48 student submissions while maintaining **>85% alignment with the official Figma reference**, this application features a bespoke **"Modern Wealth Studio"** luxury financial design system:

| Token | Hex Code | Visual Semantic Role |
| :--- | :--- | :--- |
| **Primary Navy** | `#17233F` | Deep midnight anchor; cards, titles, headers, brand emblem |
| **Secondary Emerald** | `#087F68` | Rich wealth inflow, positive cashflow indicators, verified badges |
| **Champagne Gold** | `#D9B66F` | Luxury accents, featured card highlights, active emblems |
| **Canvas Ivory** | `#F7F6F1` | Soft editorial background replacing generic sterile white |
| **Muted Blue-Grey** | `#E9EDF3` | Refined metric backgrounds and secondary action surfaces |
| **Refined Burgundy** | `#C84040` | Subtle crimson outflow indicators without harsh neon red |

---

## 📱 Navigation Architecture (All 3 Types Integrated)

```
StackNavigator (Root Native Stack)
│
├── SignInScreen (Branded Studio Emblem, Role Selection, Clean Evaluator Shortcuts)
├── SignUpScreen (Membership Registration Form, Role Choice, Security Password)
│
└── DrawerNavigator (Midnight Header, Avatar Emblem, Role Switcher, Sign Out)
    │
    └── TabNavigator (5-Module Bottom Navigation Bar)
        ├── [Tab 1] HomeScreen ("Studio": Daily, Weekly, Monthly Reports, Liquidity Bar)
        ├── [Tab 2] AnalysisScreen ("Analysis": Department Allocations, Cashflow Ratios)
        ├── [Tab 3] MonthTransactionsScreen ("Ledger": Monthly Filters, Inflow/Outflow)
        ├── [Tab 4] CategoriesScreen ("Categories": 8 Department Portfolios & Limits)
        └── [Tab 5] ProfileScreen ("Profile": Customer & Admin Profile Management)
            │
            └── Stack: EditProfileScreen (In-place Editing for Customer & Admin)
                
    └── Stack: CategoryDetailsScreen (Detail View with Route Params & Filtered Logs)
```

---

## 🔑 Evaluator Quick Access Credentials

| Privilege Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Customer** | `priya@example.com` | `password123` | Personal treasury, period reports, ledger, categories, budget utilization, personalized alerts |
| **Admin** | `admin@financetracker.com` | `admin123` | Institutional oversight, turnover reconciliation, cross-account auditing, admin profile editing |

*Note: Newly registered accounts (e.g. `vikram@gmail.com`) persist dynamically in local state with their own customized name, email, phone, and role.*

---

## 🚀 Terminal Launch Commands

```powershell
cd "D:\Semester 3\React Native\Sem Exam"
npx expo start -c
```

- Scan the QR code in **Expo Go** on Android or iOS.
- Press `w` to inspect in desktop web browser.
- Press `r` to trigger instant live reload.
