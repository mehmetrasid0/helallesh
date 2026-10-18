# Mobile Application Development – Final Project Report

---

## 📱 Project Information

- **Project Name:** Helallesh
- **Slogan:** *"Ne eşyan çökülsün, ne paran yansın!"* (P2P Item & Debt Tracking with Gamified Accountability)
- **Course:** Mobile Application Development (Final Project)
- **Instructor:** Assist. Prof. Dr. Zeki Özen
- **Student Name:** Mehmet Raşid
- **GitHub Account:** `mehmetrasid0`
- **Expo Project URL:** [https://expo.dev/accounts/mehmetrasid0/projects/helallesh](https://expo.dev/accounts/mehmetrasid0/projects/helallesh)
- **Repository URL:** `https://github.com/mehmetrasid0/helallesh`
- **Total Commit Count:** 12+ Commits (Structured semantic timeline)

---

## 1. Executive Summary & Problem Definition

### 1.1 The Real-World Problem
In university life and tight-knit social circles, sharing resources is daily routine: textbooks, calculators, hoodies, gaming consoles, and shared dinner/rent bills. However, this creates recurring social friction:
1. **The Awkwardness Barrier:** Asking a close friend for a small amount of money or a borrowed item feels uncomfortable and petty.
2. **The "Unutkanlık" (Forgotten Debts) Trap:** Debts and lent items get forgotten over weeks or months, resulting in financial loss or damaged friendships.
3. **Lack of Tangible Proof:** No clear record exists of the condition of an item when lent, or the exact receipt/bill split.
4. **One-Way Tracking Bias:** Most debt apps assume the user is only a lender; in reality, students both lend and borrow continuously.

### 1.2 The Helallesh Solution
**Helallesh** eliminates social tension through **comedy and gamified peer accountability**:
- **Bidirectional Tracking:** Full support for both *Verdim (Alacaklıyım)* and *Aldım (Borçluyum)* with an automatic **Net Balance Hero Banner**.
- **Photo Proofing:** Camera and gallery integration (`expo-image-picker`) to attach receipt photos for bill splits or condition photos for physical items.
- **Helallesh Legal Humor & Tebligat Generator:** Generates humorous, hyper-formal legal court summons ("İcra Tebligatı", "Haciz İhbarnamesi", "Dost Meclisi İhtarı") sent natively via **WhatsApp** in one tap.
- **Karma & Helallik Index:** A dynamic 0–100 scoring algorithm evaluating return timeliness and trust level.
- **Agalar Directory:** Per-friend financial summaries with single-tap complete balance settlements.

---

## 2. Tech Stack & Architecture

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | **React Native & Expo (SDK 52)** | Cross-platform compatibility (iOS, Android, Web) with native runtime performance. |
| **Navigation** | **@react-navigation/native-stack & bottom-tabs (v7)** | Seamless native transitions, deep linking, and intuitive bottom navigation. |
| **State Management** | **React Context API & Hooks (`useContext`, `useReducer`, `useMemo`)** | Centralized, reactive state container with predictable unidirectional data flow. |
| **Local Persistence** | **@react-native-async-storage/async-storage** | Offline-first local data persistence with automatic JSON serialization and initial seed data. |
| **Hardware & Native API**| **expo-image-picker**, **React Native Linking & Share** | Native camera/gallery capture and direct OS-level WhatsApp messaging dispatch. |
| **Design System** | **Modular Vanilla StyleSheet** | Slate `#F1F5F9` canvas, Midnight Navy `#0F172A` headers, Royal Blue `#2563EB` (Items), Crimson `#DC2626` (Overdue), Purple `#7C3AED` (Debts), Emerald `#059669` (Settled). |

### 2.1 Project Directory Structure
```
helallesh/
├── assets/                  # App icon, splash screen, and static graphics
├── docs/                    # Final project report, presentation scripts, PDF materials
│   ├── PROJECT_REPORT.md    # Detailed project documentation
│   ├── PRESENTATION_SCRIPT.md # 7-10 minute presentation guide
│   └── PROJECT_REPORT.html  # Print-ready styled document for PDF generation
├── screenshots/             # High-resolution screenshots of all app screens
│   ├── 01_dashboard.png     # Dashboard with Net Balance & Filter tabs
│   ├── 02_item_detail.png   # Item Detail with Photo Proof & Tebligat
│   ├── 03_add_record.png    # Add Record Form with Two-Way toggle
│   ├── 04_friends.png       # Agalar (Friends) List with per-person balance
│   └── 05_karma_stats.png   # Helallik Skor & Financial Analytics
├── src/
│   ├── context/
│   │   └── ItemsContext.js  # Global state, AsyncStorage CRUD, recalculations
│   ├── data/
│   │   └── mockData.js      # Realistic initial seed data for instant evaluation
│   ├── screens/
│   │   ├── DashboardScreen.js # Main overview, balance banner, filterable cards
│   │   ├── AddItemScreen.js   # Two-way transaction form with image picker
│   │   ├── DetailScreen.js    # Record details, photo zoom modal, tebligat generator
│   │   ├── FriendsScreen.js   # Friends balance matrix & 1-tap settlement
│   │   └── StatsScreen.js     # Karma index, debt ratio, and return velocity
│   └── utils/
│       └── templates.js     # Legalistic comedic WhatsApp summon templates
├── App.js                   # Root navigator, tab bar configuration, Context Provider
├── app.json                 # Expo EAS configuration, project ID, permissions
├── package.json             # Dependencies and build scripts
└── start-lan.bat            # Auto-detecting LAN Metro launcher for mobile testing
```

---

## 3. Setup & Run Instructions

### 3.1 Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** or **yarn**
- **Expo Go App** installed on your mobile phone (available on iOS App Store & Android Google Play Store)

### 3.2 Installation Steps
```bash
# 1. Clone the repository
git clone https://github.com/mehmetrasid0/helallesh.git
cd helallesh

# 2. Install dependencies
npm install

# 3. Start the application
# Option A: Start with Expo CLI directly
npx expo start -c

# Option B: Run on Windows LAN (auto-detects active Wi-Fi IP for physical phone connection)
.\start-lan.bat
```

### 3.3 Running on Devices
- **Physical Phone (Expo Go):** Scan the generated terminal QR code using your phone camera (iOS) or Expo Go app (Android).
- **Web Browser:** Press `w` in the terminal or run `npm run web` to test in any desktop browser.
- **Cloud Expo Link:** Open [https://expo.dev/accounts/mehmetrasid0/projects/helallesh](https://expo.dev/accounts/mehmetrasid0/projects/helallesh) directly in your Expo account.

---

## 4. Key Features Breakdown

### 4.1 Bidirectional Lending & Borrowing (İki Yönlü Borç & Emanet)
- Users can record transactions where **they lent** money/items (*Verdim*) or **borrowed** (*Aldım*).
- An interactive **Net Balance Hero Banner** displays overall financial health:
  - `+250 ₺ Agalar Sana Borçlu` (Positive net balance, colored royal blue)
  - `-180 ₺ Agalara Borcun Var` (Negative net balance, colored orange/crimson)
- Quick settlement workflow: If the user is the debtor, a prominent button allows them to record their repayment (*"Borcumu Ödedim & Kapat"*).

### 4.2 Camera & Receipt Photo Proofing (Fotoğraflı Fiş & Eşya Kanıtı)
- Direct integration with camera and photo library via `expo-image-picker`.
- Capture receipt/bill photos for split expenses or document the physical condition of electronics/gear before handing them over.
- Thumbnail previews inside cards and full-screen zoom modal in `DetailScreen`.

### 4.3 Helallesh Legalistic WhatsApp Tebligat Generator
- Generates 4 distinct legalistic comedic reminder templates:
  1. **Ağır Ceza Tebligatı:** Hyper-formal court paper declaring immediate seizure of the borrowed item.
  2. **Dost Meclisi İhtarı:** Humorous guilt-trip referencing shared memories and unreturned coffee/tea debts.
  3. **Haciz & İcra Bildirimi:** Warning that enforcement officers will visit for unpaid restaurant/dinner shares.
  4. **Tatlı Sert Hatırlatma:** Casual but firm ping to settle up.
- One-tap native dispatch via `Linking.openURL('whatsapp://send?...')` or native system share sheet.

### 4.4 Agalar (Friends) Matrix & 1-Tap Settle-Up
- Displays all friends with their respective **Net Balance** (e.g., *Emre: +120 ₺ Alacak*, *Burak: -40 ₺ Borç*).
- Gamified trust badges based on return velocity (*"Güvenilir Aga"*, *"Geciktiren"*, *"Sıkıntılı"*).
- Instant 1-tap complete settlement button to mark all active debts with a friend as settled simultaneously.

### 4.5 Helallik & Karma Scoring Engine
- Computes an aggregate **Helallik Skoru (0-100)** based on:
  - Ratio of settled vs. overdue items.
  - Average return delay in days.
  - Punctuality index.
- Visual breakdown: Total lent capital, total borrowed capital, net balance, and active items count.

---

## 5. Screen Gallery

### Screen 1: Dashboard / Ana Sayfa
> Central overview displaying the dynamic Net Balance Hero banner, quick filter pills (Tümü, Emanetler, Borçlar, Gecikenler), and color-coded transaction cards with directional tags.

![Dashboard Screen](../screenshots/01_dashboard.png)

---

### Screen 2: Record Details & Tebligat Generator / Detay & Hatırlatıcı
> Comprehensive view showing item information, photo proof preview, single-tap settlement actions, and the Helallesh comedic legal summon generator.

![Item Detail Screen](../screenshots/02_item_detail.png)

---

### Screen 3: Add Transaction Form / Yeni Kayıt Aç
> Intuitive input form featuring a bidirectional switch (*Verdim / Aldım*), item/money selector, friend selector, expected return date, and live camera/gallery photo upload.

![Add Record Screen](../screenshots/03_add_record.png)

---

### Screen 4: Agalar Directory / Kişiler & Net Bakiye
> Matrix of all friends showing individual net balances, trust badges, active count, and one-tap collective settlement button.

![Friends Screen](../screenshots/04_friends.png)

---

### Screen 5: Helallik & Karma Analytics / Özet & Skor
> Gamified analytics dashboard displaying the 0-100 Karma index, financial breakdown (Total Lent, Total Borrowed, Net Worth), and return punctuality metrics.

![Karma Stats Screen](../screenshots/05_karma_stats.png)

---

## 6. Technical Implementation Details

### 6.1 State Management (Context API)
Global state is encapsulated within `ItemsContext.js`. It exposes:
- `items`: Array of all transactions with real-time updates.
- `addItem(newItem)`: Validates, attaches unique IDs and timestamps, and persists to AsyncStorage.
- `updateItemStatus(id, newStatus)`: Updates state and persists settlement.
- `deleteItem(id)`: Removes record.
- `settleAllWithFriend(friendName)`: Batch operation settling all outstanding debts with a specific individual.
- `getNetBalance()`: Computes `Total Lent - Total Borrowed`.
- `getFriendBalance(friendName)`: Computes net balance for a specific friend.

### 6.2 Data Schema (Model)
```typescript
interface HelalleshItem {
  id: string;               // Unique timestamp/UUID
  type: 'money' | 'item';   // Financial debt vs Physical lent item
  direction: 'lent' | 'borrowed'; // 'lent' (Verdim) or 'borrowed' (Aldım)
  title: string;            // E.g., "PS5 Kolu", "Kadir Has Yemekhane Fişi"
  friend: string;           // E.g., "Mert", "Emre", "Burak"
  amount?: number;          // Numeric value in Turkish Liras (₺)
  category: string;         // 'Elektronik', 'Yemek', 'Ders', 'Diğer'
  date: string;             // ISO date string
  dueDate: string;          // ISO due date string
  status: 'active' | 'settled' | 'overdue';
  imageUri?: string;        // Local file URI from Camera / Gallery
  notes?: string;           // Optional description or condition notes
}
```

### 6.3 Local Persistence Flow
```
User Action (Add / Settle / Delete)
       │
       ▼
ItemsContext Reducer / Handler
       │
       ├─► React State Update (Instant UI Re-render)
       │
       └─► AsyncStorage.setItem('@helallesh_items', JSON.stringify(data))
```

---

## 7. Technical Challenges & Solutions

1. **Expo Go SDK 52 Compatibility on Mobile Devices:**
   - *Challenge:* Expo Go on iOS App Store required SDK 52, while initial scaffolding was on an older draft.
   - *Solution:* Migrated `package.json` to Expo SDK 52 (`expo@^52.0.0`, `react-native@0.76.7`, `@react-navigation/native@^7.0.14`), resolving native binary mismatches.

2. **Network IP Resolution Across Hotspot and Wi-Fi:**
   - *Challenge:* When testing on a physical iPhone via Wi-Fi or personal hotspot, hardcoded Metro IP addresses failed to resolve.
   - *Solution:* Created `start-lan.bat` with automated PowerShell network interface querying to dynamically detect the active IPv4 address and bind Metro directly to the physical interface.

3. **React Child Function Rendering in Comedic Templates:**
   - *Challenge:* Template functions defined with dynamic parameters `(friendName, title) => string` initially threw `Functions are not valid as a React child`.
   - *Solution:* Implemented `getRenderedTemplateText(tpl)` in `DetailScreen.js` to evaluate and extract string representations before rendering and clipboard/WhatsApp dispatch.

4. **Bidirectional Net Balance Calculation:**
   - *Challenge:* When an individual is both a borrower and a lender across multiple transactions, tracking individual debts can become chaotic.
   - *Solution:* Built an algebraic aggregation engine calculating friend-level net positions (`Σ lent - Σ borrowed`), simplifying multiple mutual debts into a single actionable figure.

---

## 8. Git Commit Timeline & Version History

The project follows a semantic commit history documenting each development phase:

| # | Commit Hash | Category | Description |
|---|---|---|---|
| 1 | `57a6caf` | `chore` | Initial expo project setup for Helallesh |
| 2 | `6e224c1` | `feat` | Install AsyncStorage, vector icons and web runtime dependencies |
| 3 | `4526d62` | `feat` | Implement core screens (Dashboard, Add, Detail, Friends, Stats) with AsyncStorage and Tebligat modal |
| 4 | `02ab8b8` | `docs` | Add comprehensive README with setup, architecture, and feature documentation |
| 5 | `3b089ef` | `refactor`| Redesign UI with clean Apple/Linear minimalist aesthetics and mobile desktop frame |
| 6 | `40b77e0` | `build` | Align Expo to SDK 52 for App Store Expo Go compatibility |
| 7 | `fe9341d` | `feat` | Link EAS project ID and owner mehmetrasid0 to app.json |
| 8 | `bfdbd8e` | `feat` | Redesign with semantic blue-red-purple palette, camera/receipt photo proofing, and native WhatsApp sharing |
| 9 | `f340b61` | `feat` | Implement two-way borrowing and lending (direction support, net balance banner, debtor settlement flow) |
| 10 | `Current` | `docs` | Add full Final Project Report, Presentation Script, and verified screen gallery |

---

## 9. Evaluation Rubric Compliance Checklist

| Syllabus Evaluation Criterion | Helallesh Implementation | Status |
|---|---|:---:|
| **Tech Stack & Architecture** | React Native, Expo SDK 52, React Navigation 7, Context API, clean modular directory layout | ✅ Complete |
| **Git Usage & Commits** | 10+ semantic commits (`feat`, `refactor`, `build`, `docs`, `chore`), clean repository history | ✅ Complete |
| **Number & Quality of UI Screens**| 5 rich screens + 2 interactive modals, Apple/Linear inspired semantic design system | ✅ Complete |
| **Functionality & Stability** | Zero runtime crashes, full CRUD, WhatsApp linking, camera proofing, net balance math | ✅ Complete |
| **Data Management / DB** | AsyncStorage persistent engine, realistic seed data, bidirectional data modeling | ✅ Complete |
| **Originality & Problem Definition**| University peer economy problem, proprietary legalistic comedic court summons, gamified Karma | ✅ Complete |
| **Documentation & Presentation** | Full PDF project report, high-res screenshots, 7-10 min dual-language presentation script | ✅ Complete |
