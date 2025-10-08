# 📱 iOS Developer Guide - Super Productivity

## 🏗️ Architecture Overview

**Hybrid iOS App**: Angular web app wrapped in Capacitor native iOS shell

- **Source**: `src/app/` (Angular TypeScript)
- **iOS Wrapper**: `ios/App/` (Native iOS project)
- **Single Codebase**: Same Angular code runs web, desktop, and iOS
- **Native Features**: iOS APIs via Capacitor plugins

## 🔄 Development Workflow

### **Quick Development Cycle:**

```bash
# 1. Edit Angular files (src/app/, src/styles.scss)
# 2. Sync changes to iOS
npm run ios:sync

# 3. Run in simulator
npm run ios:build
```

### **Available Scripts:**

```bash
npm run ios:sync    # Builds + syncs web assets to iOS
npm run ios:build   # Builds + syncs + runs iOS app
npm run ios:open    # Opens project in Xcode
```

## 🏗️ Build Process

### **3-Step Pipeline:**

1. **Web Build**: `npm run buildFrontend:prodWeb` → `dist/browser/`
2. **Sync**: `npx cap sync ios` → Copies to `ios/App/App/public/`
3. **Run**: `npx cap run ios` → Native iOS app

### **Key Files:**

- **Angular Source**: `src/app/features/work-view/work-view.component.*`
- **iOS Project**: `ios/App.xcworkspace` (open in Xcode)
- **Config**: `capacitor.config.ts`

## 📱 iOS-Specific Features

### **Safe Area Handling:**

```scss
.app-container {
  padding-top: env(safe-area-inset-top, 0px);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  margin-top: max(env(safe-area-inset-top, 0px), 50px);
  margin-bottom: max(env(safe-area-inset-bottom, 0px), 60px);
}
```

### **Capacitor Plugins:**

- **App**: Lifecycle management
- **Filesystem**: File system access
- **Local Notifications**: Push notifications
- **Background Task**: Background processing

## 🚨 Important Notes

### **What NOT to Edit:**

- **`ios/App/App/public/`**: Auto-generated from Angular build
- **`ios/App/Pods/`**: Auto-managed by CocoaPods
- **`ios/App/DerivedData/`**: Xcode build cache

### **Required Encoding:**

```bash
export LANG=en_US.UTF-8  # Fixes CocoaPods encoding issues
```

### **File Quality Checks:**

```bash
npm run checkFile <filepath>  # Runs prettier and lint
```

## 🎯 Development Focus

**For most iOS app editing, focus on Angular source files** (`src/app/`, `src/styles.scss`) rather than iOS-specific files. The Capacitor bridge automatically syncs your web app changes to the native iOS app.

**Key Development Files:**

- **Main UI**: `src/app/features/work-view/work-view.component.*`
- **Global Styles**: `src/styles.scss`
- **Assets**: `src/assets/` (images, fonts, translations)

## 🔧 Troubleshooting

### **Common Issues:**

```bash
# CocoaPods encoding error
export LANG=en_US.UTF-8 && export LC_ALL=en_US.UTF-8

# Clean rebuild
cd ios/App && pod install
# In Xcode: Product → Clean Build Folder

# Simulator issues
xcrun simctl shutdown all
xcrun simctl erase all
```

## 🎯 Key Development Patterns

### **State Management (NgRx)**

- **Actions**: `src/app/features/*/store/*.actions.ts` - Define user actions
- **Reducers**: `src/app/features/*/store/*.reducer.ts` - Handle state changes
- **Effects**: `src/app/features/*/store/*.effects.ts` - Handle side effects
- **Selectors**: `src/app/features/*/store/*.selectors.ts` - Access state

### **Component Architecture**

- **Angular Signals**: Use `computed()`, `signal()`, `toSignal()` for reactive state
- **Standalone Components**: Modern Angular pattern (no NgModules)
- **Input/Output**: Use `input()` and `output()` for component communication
- **Lifecycle**: `OnInit`, `OnDestroy`, `AfterViewInit` for component management

### **Focus Mode Development**

- **Main Component**: `src/app/features/focus-mode/focus-mode-main/`
- **Store Integration**: Actions like `startFocusSession`, `pauseFocusSession`, `incrementCycle`
- **Timer Logic**: Handled in effects with proper state management
- **UI Updates**: Cycle dots, progress circles, control buttons

### **Task Management**

- **Service**: `src/app/features/tasks/task.service.ts` - Core task operations
- **Effects**: `src/app/features/tasks/store/task-internal.effects.ts` - Auto-start logic
- **Auto-Creation**: Dialog integration for seamless task creation

## 🚨 Critical Development Gotchas

### **Angular Signals in Templates**

```typescript
// ✅ CORRECT: Signal functions must be called with ()
focusModeService.isRunning(); // Returns boolean

// ❌ WRONG: Missing () causes TypeScript errors
focusModeService.isRunning; // Returns function reference
```

### **Test Mocking Patterns**

```typescript
// ✅ CORRECT: Mock signal functions properly
const focusModeServiceSpy = jasmine.createSpyObj('FocusModeService', [], {
  isRunning: jasmine.createSpy().and.returnValue(false),
  currentCycle: jasmine.createSpy().and.returnValue(1),
  mode: jasmine.createSpy().and.returnValue('Pomodoro'),
});
```

### **NgRx Effects Integration**

```typescript
// ✅ CORRECT: Handle no-tasks scenario in effects
if (action.type === toggleStart.type && !state.currentTaskId) {
  return this._handleNoTasksAvailable();
}
```

### **Dialog Integration**

```typescript
// ✅ CORRECT: Listen to component outputs for dialog actions
dialogRef.componentInstance.afterTaskAdd.subscribe(({ taskId }) => {
  this._store$.dispatch(setCurrentTask({ id: taskId }));
  this._store$.dispatch(showFocusOverlay());
  dialogRef.close();
});
```

## 🔧 Debugging & Testing

### **Common Test Failures**

- **Signal Mocking**: Always mock signal functions with `jasmine.createSpy()`
- **TypeScript Errors**: Use `isRunning()` not `isRunning` for signal calls
- **Effect Testing**: Mock store selectors properly for effects

### **Build Issues**

- **CocoaPods Encoding**: Always prefix with `export LANG=en_US.UTF-8`
- **File Quality**: Run `npm run checkFile <filepath>` after every edit
- **Test Failures**: Check if service mocks include all required methods

## 🔄 Real-World Development Workflow

### **Feature Development Process**

1. **Plan**: Identify NgRx actions needed, component changes, service updates
2. **Implement**: Start with actions/reducers, then effects, finally components
3. **Test**: Mock all signal functions, test component interactions
4. **Debug**: Use browser dev tools, check console for signal errors
5. **Deploy**: Run `npm run checkFile`, sync to iOS, test in simulator

### **Common Patterns We Learned**

- **Auto-Task Creation**: Effects detect no-tasks → open dialog → listen for creation → start focus mode
- **Cycle Management**: Increment on skip-to-break, decrement on skip-to-work, reset on completion
- **Confetti Integration**: Service injection → multiple origins → timing with state updates
- **Button State Management**: Signal-based dynamic icons and tooltips

### **iOS-Specific Considerations**

- **Touch Interactions**: Larger touch targets, proper spacing for fingers
- **Safe Areas**: Always use `env(safe-area-inset-*)` for notches/Dynamic Island
- **Performance**: Signals are more efficient than observables for UI updates
- **Testing**: Mock all injected services, especially signal-based ones

## 📊 Current Customizations

- **Welcome Banner**: "Hi, Antonio! What will you do Today?" in work-view component
- **Focus Mode**: Enhanced Pomodoro with cycle tracking, confetti celebration, pause/resume
- **Task Creation**: Auto-prompt when no tasks exist + immediate focus mode start
- **iOS Safe Area**: Proper spacing for iPhone rounded corners and Dynamic Island
- **Check Marks**: Visible task completion buttons on main pages

## 🔧 Essential Commands

```bash
# Development workflow
npm run ios:sync && npm run ios:build

# File quality (ALWAYS run after edits)
npm run checkFile <filepath>

# Encoding fix for CocoaPods
export LANG=en_US.UTF-8 && <command>
```

---

**Remember**: The iOS app is essentially a native wrapper around your Angular web application, so most editing should happen in the web layer with occasional native iOS customizations when needed.
