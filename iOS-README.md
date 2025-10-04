# 📱 Super Productivity iOS App Development Guide

This guide covers building, running, and customizing the Super Productivity iOS app built with **Angular** + **Capacitor**.

## 🏗️ iOS Architecture Overview

### **How iOS App Works:**

- **Angular Frontend**: Complete web app in `src/app/`
- **Capacitor Bridge**: Native iOS wrapper (`ios/App/`)
- **Single Codebase**: Same Angular code runs web, desktop, and iOS
- **Native Features**: Access to iOS APIs via Capacitor plugins

---

## 📋 Prerequisites

### **Required Software:**

- ✅ **macOS** (Catalina 10.15 or newer)
- ✅ **Xcode 15+** (from Mac App Store)
- ✅ **Node.js 20+**
- ✅ **CocoaPods** (`brew install cocoapods`)
- ✅ **npm packages** (`npm install`)

### **Installation Commands:**

```bash
# Install iOS development tools
brew install cocoapods

# Install project dependencies
npm install

# Install Angular CLI globally
npm i -g @angular/cli
```

---

## 🚀 iOS Development Setup

### **1. Add iOS Platform (One-time Setup)**

```bash
cd /Users/antonioli/Desktop/super-productivity

# Add iOS platform to Capacitor
npx cap add ios

# Install CocoaPods dependencies
cd ios/App && export LANG=en_US.UTF-8 && pod install
```

### **2. Build & Sync Web Assets**

```bash
# Build production Angular app
npm run buildFrontend:prodWeb

# Sync web assets to iOS project
npx cap sync ios
```

### **3. Run iOS App in Simulator**

```bash
# Option 1: Run with specific simulator
export LANG=en_US.UTF-8 && npx cap run ios --target="iPhone 16"

# Option 2: Open in Xcode for development
npx cap open ios
```

---

## 📱 iOS File Structure

### **Core iOS Files:**

```
ios/App/
├── App.xcworkspace/           # 🎯 Open this in Xcode
├── App/
│   ├── AppDelegate.swift      # 📱 iOS app lifecycle
│   ├── Info.plist             # ⚙️ App configuration
│   ├── Assets.xcassets/       # 🖼️ App icons & images
│   ├── Base.lproj/
│   │   ├── Main.storyboard    # 📐 Main UI layout
│   │   └── LaunchScreen.storyboard # 🚀 Splash screen
│   ├── public/                # 🌐 Angular web assets
│   └── capacitor.config.json  # ⚙️ Capacitor settings
├── Podfile                    # 📦 iOS dependencies
└── Pods/                      # 📦 Cocoapods installed dependencies
```

### **Angular UI Files Used by iOS:**

```
ios/App/App/public/           # ← These files from dist/browser/
├── index.html                # 📄 Main app entry point
├── styles-*.css              # 🎨 Your custom styles (inc. gradient banner!)
├── main-*.js                 # 📦 Angular app bundle
├── chunk-*.js                # 🧩 Feature modules
├── assets/                   # 🖼️ Images, fonts, etc.
└── *.css.map                 # 🗺️ Source maps for debugging
```

---

## 🎨 iOS UI Customization Points

### **1. Native iOS UI Files:**

- **`ios/App/App/Info.plist`**: App name, bundle ID, permissions
- **`ios/App/App/Base.lproj/Main.storyboard`**: Static UI layouts
- **`ios/App/App/Assets.xcassets/`**: App icons, splash screens

### **2. Web UI Files (Primary):**

- **`src/app/features/work-view/work-view.component.*`**: Main work interface
- **`src/styles.scss`**: Global styles
- **`src/assets/`**: Images, fonts, translations

### **3. Capacitor Configuration:**

- **`capacitor.config.ts`**: App settings, plugin config
- **`ios/App/App/capacitor.config.json`**: Platform-specific settings

---

## 🔄 Development Workflow

### **Quick Development Cycle:**

```bash
# 1. Make changes to Angular files (src/app/, src/styles.scss)
# 2. Sync changes to iOS
export LANG=en_US.UTF-8 && npx cap sync ios

# 3. Run in simulator
export ЛANG=en_US.UTF-8 && npx cap run ios

# 4. Your customizations appear in iOS app!
```

### **Testing Changes:**

1. **Edit**: Modify files in `src/app/features/work-view/`
2. **Build**: Run `npm run buildFrontend:prodWeb`
3. **Sync**: Run `export LANG=en_US.UTF-8 && npx cap sync ios`
4. **Test**: Launch simulator with `npx cap run ios`

---

## 🛠️ Building for Distribution

### **Development Build:**

```bash
# Build web assets + sync to iOS + run simulator
export LANG=en_US.UTF-8 && npm run ios:build
```

### **Production Build (Requires Apple Developer Account $99/year):**

```bash
# 1. Configure signing in Xcode
# 2. Set development team in "Signing & Capabilities"
# 3. Build archive
npx cap build ios

# 4. Archive in Xcode for App Store submission
# File → Export → App Store Connect
```

---

## 🎯 Your Customizations in iOS

### **✅ What's Already Included:**

- **🎨 Custom Welcome Banner**: Gradient background with emoji
- **🎭 Enhanced Work View**: Modified `work-view.component.html/scss`
- **📱 iOS Native Features**: Notifications, file system, background tasks
- **🔄 Real-time Sync**: Changes automatically sync from web to iOS

### **✅ Custom Files in iOS Build:**

```scss
/* Your custom styles in iOS app */
.custom-welcome-message {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  margin-bottom: 16px;

  h1 {
    color: white;
    font-size: 1.5rem;
    font-weight: 300;
  }
}
```

---

## 🚨 Troubleshooting

### **Common Issues:**

#### **1. CocoaPods Encoding Error:**

```bash
# Fix: Set UTF-8 encoding
export LANG=en_US.UTF-8 && export LC_ALL=en_US.UTF-8
```

#### **2. Build Failures:**

```bash
# Clean and rebuild
cd ios/App && pod install
# In Xcode: Product → Clean Build Folder
```

#### **3. Simulator Not Launching:**

```bash
# Kill existing simulators
xcrun simctl shutdown all
xcrun simctl erase all

# Restart simulator
npx cap run ios
```

#### **4. Code Signing Issues:**

- Open `ios/App.xcworkspace` in Xcode
- Go to "Signing & Capabilities"
- Add Apple Developer account
- Or set "Automatically manage signing"

---

## 📊 Available iOS Build Scripts

### **Custom Scripts Added:**

```json
{
  "ios:add": "npm run buildFrontend:prodWeb && npx cap add ios",
  "ios:sync": "npm run buildFrontend:prodWeb && npx cap sync ios",
  "ios:build": "npm run buildFrontend:prodWeb && npx cap sync ios && npx cap build ios",
  "ios:open": "npm run ios:sync && npx cap open ios"
}
```

### **Usage:**

```bash
npm run ios:sync    # Quick sync after Angular changes
npm run ios:build   # Full build + sync + archive
npm run ios:open    # Open project in Xcode
```

---

## 📈 Next Steps

### **Ready for App Store:**

1. ✅ **Apple Developer Account** ($99/year)
2. ✅ **App Store Connect** setup
3. ✅ **TestFlight** beta testing
4. ✅ **Production** App Store submission

### **Advanced Customization:**

- **Add native iOS features** via Capacitor plugins
- **Custom splash screens** in `Assets.xcassets/`
- **App icon variations** for iOS system integration
- **Push notifications** configuration

---

## 🎉 Success!

**Your customized Super Productivity iOS app is ready!** 🚀

- ✅ **Native iOS app** (not just a browser shell)
- ✅ **Your customizations included**
- ✅ **Real iOS capabilities** (notifications, files, etc.)
- ✅ **Ready for TestFlight/App Store**

**Files to remember:**

- **🎨 Customizations**: `src/app/features/work-view/work-view.component.*`
- **📱 iOS Project**: `ios/App.xcworkspace`
- **⚙️ Config**: `capacitor.config.ts`

Happy coding! 🎊📱✨
