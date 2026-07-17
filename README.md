# NextRep

NextRep is an intuitive, offline-first weekly workout routine checklist and weight tracking application designed with a beautiful, responsive Scandinavian Minimalist layout. It supports gym-goers from beginners to intermediate levels with common and highly recognizable compound and isolation exercises.

---

## 🚀 Live App Links

* **Development / Testing App (Live Preview):** [https://ais-dev-6agvf6eme57mvsa2lfsvre-911933498314.europe-west2.run.app](https://ais-dev-6agvf6eme57mvsa2lfsvre-911933498314.europe-west2.run.app)
* **Shared / Preview App:** [https://ais-pre-6agvf6eme57mvsa2lfsvre-911933498314.europe-west2.run.app](https://ais-pre-6agvf6eme57mvsa2lfsvre-911933498314.europe-west2.run.app)

---

## ✨ Features Overview

### 1. 🏋️ Workouts Checklist & Plan Generator
* **Tailored Splits:** Generate 4-day, 5-day, or 6-day training splits depending on your availability.
* **Smart Equipment Filter:** Filter plans by Home/Gym location and equipment preferences (weights, bodyweight, machines, or a mix of all).
* **Comprehensive Exercise Database:** Over 100+ generic, highly recognized compound and isolation exercises covering chest, back, shoulders, quads, hamstrings, biceps, triceps, abs, and calves.
* **Interactive Checklist:** Mark off exercises as you finish them during your session, keeping you on track.
* **Flexible Re-Planning:** Easily regenerate or adjust your split structure at any time.

### 2. 📉 Weight Tracking & Metrics
* **Continuous History Log:** Record your body weight over time, including precise date timestamps.
* **Interactive Weight Progress Chart:** A sleek, animated line chart (powered by Recharts) mapping your weight journey against your target weight line.
* **Automatic Progress Statistics:** Instantly calculates weight lost/gained, distance to your goal, and overall weight changes.

### 3. ⏱️ Speedometer BMI Gauge
* **Dynamic Visualization:** Displays a custom-built, SVG-powered speedometer needle that points exactly to your current BMI score.
* **Live Health Feedback:** Categorizes your score instantly (Underweight, Normal, Overweight, Obese) using color-coded indicator ranges to keep you informed.

### 4. 🎨 Scandinavian Minimalist Design
* **Double Theme Support:**
  * **Light Mode:** Warm cream sand backdrop (`#faf3dd`) paired with subtle chocolate charcoal text (`#563635`) for an eye-friendly, calm feel.
  * **Dark Mode:** Deep navy charcoal (`#0b111e`) with clean white-gray text and electric teal accents (`#2dd4bf`).
* **Motion-Enabled Animations:** Powered by `motion/react` for buttery smooth tab transitions and modular expansions.

### 5. 🛠️ Hidden Developer Gates (Admin Console)
* **7-Tap Seeder:** Click the NextRep logo in the header **7 times** to unlock the hidden admin panel.
* **Sample Data Seeding:** Instantly populates the local state with 5 weeks of weight logs, customized physical settings, and a 4-day muscle build routine.
* **Local Recovery Option:** Provides a permanent app wipe function to restore the app to its onboarding state.

---

## 🛠️ Technology Stack

* **UI Framework:** React 19 & TypeScript
* **Bundler & Dev Server:** Vite 6
* **Styling Engine:** Tailwind CSS v4 (configured natively via `@tailwindcss/vite` plugin)
* **Motion Engine:** `motion` (imported from `motion/react`)
* **Charts/Graphs:** Recharts
* **Icons:** Lucide React

---

## 💻 Local Setup & Development

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your local computer.

### 2. Installation
Clone the repository and install all dependencies:
```bash
npm install
```

### 3. Run Development Server
Spin up the hot-reloading dev server on port `3000`:
```bash
npm run dev
```
Open your browser to `http://localhost:3000` to preview the app.

### 4. Building for Production
Compile the React code into highly optimized static production assets in the `dist/` directory:
```bash
npm run build
```

### 5. Run Linter
Verify code style and TypeScript correctness:
```bash
npm run lint
```

---

## 📱 Native Mobile Builds (iOS & Android)

NextRep includes native support for mobile platforms powered by **Capacitor**. The viewport fits perfectly underneath modern notches, and interactive panels adapt flawlessly to mobile dimensions.

### 1. Requirements for Mobile Builds
* **For iOS:** macOS with Xcode installed and CocoaPods setup.
* **For Android:** Android Studio with the Android SDK installed.

### 2. Add Native Mobile Platforms
Install the required platform plugins:
```bash
npm install @capacitor/ios @capacitor/android
```

Initialize your iOS and Android native platforms in the project root:
```bash
npx cap add ios
npx cap add android
```

### 3. Sync & Build Pipeline
Whenever you modify your React code, you must build the web assets and copy them into the native containers:
```bash
# Compile React code
npm run build

# Synchronize assets and plugins to iOS & Android containers
npm run cap:sync
```

### 4. Open and Run in Native Simulators or Devices
Launch Xcode or Android Studio to run the app directly on an emulator or plugged-in physical device:
```bash
# Open Xcode Project
npm run cap:open-ios

# Open Android Studio Project
npm run cap:open-android
```
