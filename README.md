# 📱 Our Little World — Mobile App (iOS & Android)

A commemorative 6-month anniversary mobile application connecting **Santa Tecla 🇸🇻** and **Manila 🇵🇭**.

---

## 🌟 How it Works as a Mobile App

This project is configured as both a **Progressive Web App (PWA)** and a **Native Hybrid App (Capacitor)**, allowing it to run smoothly on both **iOS (iPhone/iPad)** and **Android**.

### Option 1: Direct Mobile Install (Instant & Recommended)
You can deploy this folder to any free static host (GitHub Pages, Netlify, Vercel, Firebase) or run a local server:

- **On iOS (iPhone / iPad)**:
  1. Open the page in **Safari**.
  2. Tap the **Share** button (`📤`) in the bottom bar.
  3. Scroll down and choose **"Add to Home Screen"** (`➕`).
  4. Tap **Add**. The app will appear on your Home Screen as an independent, fullscreen app with no browser address bar, custom icon, and safe-area notch support!

- **On Android (Samsung, Pixel, Xiaomi, etc.)**:
  1. Open the page in **Google Chrome**.
  2. Tap the **"Install App"** button at the top or tap Chrome's menu (`⋮`) and select **"Install app"** / **"Add to Home screen"**.
  3. The app is installed into your app drawer and home screen with native icon, offline support, and haptic feedback.

---

### Option 2: Native App Compilation (Xcode / Android Studio)
If you wish to compile an actual `.apk` for Android or `.ipa` for iOS:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Generate or verify app icons:
   ```bash
   npm run generate-icons
   ```

3. Initialize platforms:
   - **For Android**:
     ```bash
     npx cap add android
     npx cap open android
     ```
     *(Opens in Android Studio to build APK or run on connected device)*

   - **For iOS (requires macOS & Xcode)**:
     ```bash
     npx cap add ios
     npx cap open ios
     ```
     *(Opens in Xcode to test on iOS Simulator or deploy to iPhone)*

---

## 📂 Project Structure

- [`index.html`](file:///c:/Users/David_Alfredo/Documents/antigravity/goofy-bardeen/index.html): Complete application with responsive UI, canvas animations, and dual clocks.
- [`manifest.json`](file:///c:/Users/David_Alfredo/Documents/antigravity/goofy-bardeen/manifest.json): Web App Manifest for mobile installation on Android and iOS.
- [`sw.js`](file:///c:/Users/David_Alfredo/Documents/antigravity/goofy-bardeen/sw.js): Service Worker providing 100% offline functionality.
- [`capacitor.config.json`](file:///c:/Users/David_Alfredo/Documents/antigravity/goofy-bardeen/capacitor.config.json): Configuration for building native Android & iOS packages.
- [`icons/`](file:///c:/Users/David_Alfredo/Documents/antigravity/goofy-bardeen/icons/): High-resolution application icons (`icon.svg`, `icon-192.png`, `icon-512.png`).
