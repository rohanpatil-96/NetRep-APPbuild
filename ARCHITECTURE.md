# System Architecture Document: NextRep

This document describes the high-level architecture, directory organization, state management system, and structural components of **NextRep**. It is designed to help engineers understand and expand the codebase.

---

## 🗺️ Architectural Paradigm

NextRep is engineered as a **Full-Client Single Page Application (SPA)** with an **Offline-First, Zero-Latency Design**. 

### Core Architectural Decisions:
1. **Durable Client-Side Persistence:** There is no remote backend, database server, or OAuth session layer needed. All user preferences, daily workout checklists, historical weight logs, and profile statistics are stored directly in the user's browser via high-speed, synchronous `localStorage` engines.
2. **Lazy Initialization:** To prevent costly DOM-blocking read cycles on app startup, all local storage retrievals are wrapped in **state initializer functions** inside React's `useState` hooks.
3. **Unidirectional Data Flow:** App-level state is maintained in `/src/App.tsx` and propagated downwards as immutable properties (`props`). Leaf components communicate changes back to the root via specialized callback handlers.

---

## 📂 Codebase Directory Layout

The workspace is organized to promote modularity, clear separation of concerns, and seamless scaling:

```
├── /src
│   ├── /components
│   │   ├── BmiGauge.tsx           # Custom speedometer-style SVG gauge for BMI
│   │   ├── Dashboard.tsx          # Live weekly workout checklist and session controls
│   │   ├── PlanBuilder.tsx        # Split generation wizard and equipment configurations
│   │   ├── ProfileOnboarding.tsx  # Initial onboarding gate for physical metrics
│   │   ├── Settings.tsx           # Settings adjuster and master data wipe modal
│   │   └── WeightTracker.tsx      # Weight log history, statistics cards, and chart view
│   ├── /data
│   │   └── exercises.ts           # Curated generic exercise database and split generator
│   ├── App.tsx                    # Main controller, router hub, and dark mode state
│   ├── index.css                  # Global Tailwind CSS custom theme and color definitions
│   └── main.tsx                   # React root mount point and DOM connector
├── index.html                     # Standard Vite HTML entry point
├── package.json                   # Project dependencies and script config
└── vite.config.ts                 # Vite compiler config
```

---

## 🗃️ Core Data Structures & Type Definitions

The foundational type contracts are defined in `/src/data/exercises.ts`.

### 1. `Exercise`
Defines an individual, static exercise template within the universal database.
```typescript
export interface Exercise {
  id: string;
  name: string;
  muscle: string;      // "Chest" | "Back" | "Shoulders" | "Quads" | etc.
  equipment: 'machine' | 'weights' | 'bodyweight';
  location: 'gym' | 'home';
  category: 'compound' | 'isolation';
  suggestedReps: string;
}
```

### 2. `DayPlan`
Defines a specific calendar day in a user's weekly split. A day can either be an active workout session or a recovery day.
```typescript
export interface DayPlan {
  day: string;         // e.g., "Monday", "Tuesday"
  title: string;       // e.g., "Push Day", "Rest Day"
  note: string;        // e.g., "Focus on heavy compound movements"
  badge: 'Workout' | 'Recovery';
  rest?: boolean;
  exercises?: {
    id: string;
    name: string;
    muscle: string;
    suggestedReps: string;
    done: boolean;     // Interactive tick status
    slotId: string;    // Keeps track of slot targets for random shuffles
  }[];
}
```

### 3. `UserSettings`
Contains the user's permanent physical profile parameters, initialized on onboarding.
```typescript
export interface UserSettings {
  age: number;
  height: number;         // Represented in centimeters (cm)
  gender: string;         // e.g., "Male", "Female", "Prefer not to say"
  startingWeight: number; // Stored natively in chosen unit
  targetWeight: number;   // Stored natively in chosen unit
  weightUnit: 'kg' | 'lbs';
}
```

### 4. `WeightLog`
Chronological snapshot tracking weight trends over time.
```typescript
export interface WeightLog {
  id: string;
  date: string;  // Format: YYYY-MM-DD
  weight: number;
}
```

---

## 🔁 State Synchronization Lifecycle

NextRep acts as a self-contained state engine with reactive pipelines:

```
[ User Onboarding / Settings Input ]
                 │
                 ▼
     [ App.tsx Local States ] ───► Syncs to ───► [ LocalStorage ]
                 │                                      │
        (Downwards Propagated)                   (Restored on Load)
                 │                                      │
                 ▼                                      ▼
     [ Interactive Dashboards ] ◄────────── Reacts dynamically to state edits
```

Every update to `settings`, `weightLogs`, `plan`, or `theme` triggers a targeted `useEffect` subscription that persists changes to localStorage in real-time. This guarantees zero data loss on browser refreshes or background sleep modes.

---

## 🎨 Visual Styling and Design Specifications

NextRep uses **Tailwind CSS v4** combined with custom native theme declarations for precise aesthetic rendering.

### 🌞 Light Mode: "Scandinavian Warm Sand"
Provides an organic, calm, tactile, and highly legible background resembling natural architectural materials.
* **Base Canvas Color:** `#faf3dd`
* **Core Contrast Text:** `#563635` (Deep warm dark chocolate brown)
* **Surface Cards:** `#ffffff` (Floating crisp white boxes with soft borders)
* **Accent Color:** `#3f612d` (Tactical deep pine forest green)

### 🌑 Dark Mode: "Technical Space"
Offers an ultra-modern, high-contrast, technical grid canvas for low-light training spaces.
* **Base Canvas Color:** `#0b111e` (Deep midnight slate)
* **Core Contrast Text:** `#f1f5f9` (Crisp cool white)
* **Surface Cards:** `#141d30` (Clean dark slate panels)
* **Accent Color:** `#2dd4bf` (Electric neon teal)

---

## 🔗 Environment Deployment Configuration

NextRep is continuously built and served using highly-scalable Dockerized containers on Cloud Run behind a reverse proxy router.

* **Main Port Target:** Port `3000` (Hardcoded container boundary)
* **Development / Testing Link:** [https://ais-dev-6agvf6eme57mvsa2lfsvre-911933498314.europe-west2.run.app](https://ais-dev-6agvf6eme57mvsa2lfsvre-911933498314.europe-west2.run.app)
* **Shared Production Link:** [https://ais-pre-6agvf6eme57mvsa2lfsvre-911933498314.europe-west2.run.app](https://ais-pre-6agvf6eme57mvsa2lfsvre-911933498314.europe-west2.run.app)

---

## 📱 Hybrid Native Mobile Architecture (Capacitor)

NextRep implements a standard hybrid application compilation framework utilizing **Capacitor** by Ionic. This allows the fully responsive, offline-first client-side webapp bundle to run natively on iOS and Android devices with high-performance WebViews.

```
                  ┌──────────────────────────────────────────────┐
                  │            NextRep Native Shell              │
                  │  (iOS WKWebView  /  Android System WebView)  │
                  │                                              │
                  │   ┌──────────────────────────────────────┐   │
                  │   │      React & Tailwind SPA Bundle     │   │
                  │   │   ┌──────────────────────────────┐   │   │
                  │   │   │      Local Storage Engine    │   │   │
                  │   │   └──────────────────────────────┘   │   │
                  │   └──────────────────────────────────────┘   │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                             Capacitor Bridge Layer
                    (Device Native API / Plugin Bindings)
```

### Key Native Integration Mechanisms:
1. **Device WebViews:**
   On iOS, the React bundle is loaded into a hardware-accelerated `WKWebView` sandbox. On Android, it mounts inside the Chromium-based `Android System WebView`. This gives native-level Javascript rendering performance.
2. **Local Storage Persistence inside Webview:**
   WebViews enforce sandbox local storage policies. All local keys (e.g., weights history logs, onboarding settings, and selected splits) remain isolated and persistent across native app launches.
3. **Hardware Notch Adaptation (Safe Areas):**
   The `<meta name="viewport" content="...viewport-fit=cover">` allows the app background to flow cleanly behind device physical notches. In parallel, native safe-area inset environment variables (`env(safe-area-inset-top)` & `env(safe-area-inset-bottom)`) dynamically pad the header, navigation tabs, and actions to avoid collisions with physical hardware notches or the iOS home indicator bar.

