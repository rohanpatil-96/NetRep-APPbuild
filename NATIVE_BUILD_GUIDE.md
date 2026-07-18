# NextRep: Native iOS & Android Build Guide
*Tailored for Apple Silicon (M1/M2/M3 Macs), Xcode, and Android Studio*

---

> ### 💡 Pro-Tip: How to save this guide as a PDF
> Since you requested a downloadable PDF, you can easily save this guide on your Mac:
> 1. Double-click **NATIVE_BUILD_GUIDE.md** on your Mac after downloading your ZIP.
> 2. Open it in any Markdown reader, Safari, or Chrome.
> 3. Press `⌘ + P` (Print) and choose **"Save as PDF"** in the bottom-left corner of the print dialog!

---

## 📋 Table of Contents
1. [Initial Requirements & Setup](#1-initial-requirements--setup)
2. [Step-by-Step iOS App Build (Xcode)](#2-step-by-step-ios-app-build-xcode)
3. [Step-by-Step Android App Build (Android Studio)](#3-step-by-step-android-app-build-android-studio)
4. [How to Update Your App (When code changes in AI Studio)](#4-how-to-update-your-app-when-code-changes-in-ai-studio)
5. [M1 Mac Troubleshooting & Tips](#5-m1-mac-troubleshooting--tips)

---

## 1. Initial Requirements & Setup

Before getting started, make sure you have the following installed on your M1 MacBook Pro:
1. **Node.js**: The software engine that runs web builds.
   * *How to install*: Go to [nodejs.org](https://nodejs.org/) and download the recommended **LTS** version.
2. **Xcode** (from the Mac App Store) for iOS builds.
3. **Android Studio** (for Apple Silicon version) for Android builds.

### 📥 Step 1: Download your ZIP and open the folder
1. In Google AI Studio, click on **Settings** (or the export menu) and select **Download ZIP**.
2. Double-click the downloaded ZIP file to extract it.
3. Open your **Terminal** app (Press `⌘ + Space`, type "Terminal", and press Enter).
4. Type `cd ` (with a space) and drag-and-drop your extracted folder directly from Finder into the Terminal window. Press **Enter**.

---

## 2. Step-by-Step iOS App Build (Xcode)

Follow these simple commands to bundle and launch the iOS version on your M1 Mac:

### Step A: Install dependencies & build your project
Run the following commands one by one in your Terminal window:
```bash
# 1. Install the program tools needed
npm install

# 2. Bundle the user interface code
npm run build
```

### Step B: Add the iOS Platform
This initializes the native iOS directory:
```bash
npx cap add ios
```

### Step C: Sync your code and open Xcode
To package the app and launch it inside Xcode, run:
```bash
# Copy your web app elements into the native iOS folder
npx cap sync ios

# Open Xcode automatically with the project loaded
npx cap open ios
```

### Step D: Running on Simulator or Physical iPhone
Once Xcode opens:
1. In the top bar of Xcode, select **NextRep** next to the play button, and choose your preferred iPhone simulator (e.g., iPhone 15 Pro).
2. Click the **Play button** (or press `⌘ + R`) to build and run the app.
3. To run on a physical iPhone:
   * Connect your iPhone via USB.
   * Go to the left sidebar in Xcode, select **App** (the blue project icon).
   * Under **Signing & Capabilities**, select your Apple developer account as the "Team" (a free personal team works!).
   * Select your connected iPhone from the top run target list and click the **Play button**.

---

## 3. Step-by-Step Android App Build (Android Studio)

### Step A: Add the Android Platform
In your Terminal window, run:
```bash
npx cap add android
```

### Step B: Sync and open Android Studio
```bash
# Copy your web app elements into the native Android folder
npx cap sync android

# Open Android Studio with the project loaded
npx cap open android
```

### Step C: Running in Android Studio
Once Android Studio loads the project completely:
1. Wait a moment for the bottom background tasks ("Gradle Sync") to finish.
2. In the top toolbar, select a virtual device (Emulator) or connect your physical Android device (with USB debugging enabled).
3. Click the green **Run (Play)** button in the top toolbar to launch NextRep on your device!

---

## 4. How to Update Your App (When code changes in AI Studio)

Whenever you edit the design or add functions inside Google AI Studio, updating your native iOS and Android apps takes less than 60 seconds!

### Step-by-Step Update Workflow:
1. Make all your desired changes inside Google AI Studio.
2. Download the updated **ZIP** of your project.
3. Extract the ZIP and copy/overwrite your old files, or simply open the newly extracted folder in your Terminal using `cd`.
4. In your Terminal, run the update sequence:
```bash
# 1. Install any new plug-ins or dependencies
npm install

# 2. Build the updated web version
npm run build

# 3. Synchronize all updates directly to iOS and Android
npx cap sync
```
5. **That's it!** If Xcode or Android Studio is already open, simply hit the **Play (Run)** button again to load the fresh updates onto your test devices instantly. No need to recreate the platforms!

---

## 5. M1 Mac Troubleshooting & Tips

Because you are using an M1 MacBook Pro (Apple Silicon), keep these simple tips in mind:

* **Cocoapods Permission Error (iOS)**:
  If you see an error about `pod` or Cocoapods when running `npx cap add ios`, run this command in terminal:
  ```bash
  sudo gem install cocoapods
  ```
  *(Enter your Mac password when prompted)*.

* **Android Studio Version**:
  Make sure you downloaded the **"Apple Silicon"** (labeled "Apple Chip") installer for Android Studio, not the Intel/AMD one. This guarantees 10x faster compile times and flawless emulator performance.

* **Checkboxes & Button Vibration**:
  The app has built-in **tactile haptics**! When checking off workout reps or saving logs on native devices, your phone will give premium, subtle feedback. You can always disable this in the **Settings** or **Profile Onboarding** screens with the toggle switch!
