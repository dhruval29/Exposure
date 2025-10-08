# Tutorial System Documentation

## Overview
The tutorial system provides a guided experience for first-time users when they open the desktop menu. It animates a cursor to a menu item and shows a tooltip suggesting they click to navigate.

## Features
- **First-time detection**: Uses localStorage to track if user has seen the tutorial
- **Desktop-only**: Only shows on desktop screens (>1024px width)
- **Automatic animation**: Cursor moves from center to first menu item
- **Tooltip guidance**: Shows "Click to navigate" message
- **User interaction handling**: Stops tutorial when user hovers or clicks any menu item
- **One-time experience**: Tutorial won't show again after completion

## How It Works

### 1. Tutorial State Management (`src/utils/tutorialManager.js`)
- `hasSeenMenuTutorial()`: Checks if user has seen tutorial
- `markMenuTutorialSeen()`: Marks tutorial as completed
- `shouldShowTutorial()`: Determines if tutorial should show (desktop + first time)
- `resetTutorialState()`: Resets tutorial state (for testing)

### 2. Tutorial Cursor Component (`src/components/TutorialCursor.jsx`)
- Animated cursor that moves from center to target element
- Tooltip with navigation guidance
- Smooth animations using GSAP
- Responsive design

### 3. Integration with NavigationMenu (`src/components/NavigationMenu.jsx`)
- Detects first-time menu opening
- Starts tutorial after menu animation completes
- Handles user interactions to stop tutorial
- Manages tutorial state

## Testing

### Reset Tutorial for Testing
```javascript
// In browser console
window.tutorialTestHelper.resetTutorialForTesting();
```

### Check Tutorial State
```javascript
// In browser console
window.tutorialTestHelper.checkTutorialState();
```

### Manual Testing Steps
1. Clear localStorage or use reset function
2. Open website on desktop (>1024px width)
3. Navigate to landing page
4. Open menu - tutorial should start automatically
5. Tutorial should animate cursor to first menu item
6. Hover or click any menu item to complete tutorial
7. Close and reopen menu - tutorial should not show again

## Customization

### Change Tooltip Text
Edit the `tooltipText` prop in `NavigationMenu.jsx`:
```javascript
<TutorialCursor
  tooltipText="Your custom message here"
  // ... other props
/>
```

### Target Different Menu Item
Modify the `startTutorial` function in `NavigationMenu.jsx`:
```javascript
const startTutorial = () => {
  // Target second menu item instead of first
  const targetMenuItem = menuItemRefs.current[1];
  if (targetMenuItem) {
    setTutorialTarget(targetMenuItem);
    setShowTutorial(true);
  }
};
```

### Change Animation Timing
Modify the tutorial start delay in `NavigationMenu.jsx`:
```javascript
setTimeout(() => {
  startTutorial();
}, 1000); // Increase delay to 1 second
```

## Browser Compatibility
- Modern browsers with localStorage support
- GSAP animation library required
- CSS3 transforms and animations

## Performance Notes
- Tutorial only loads on desktop screens
- Uses efficient GSAP animations
- Minimal DOM manipulation
- localStorage for persistent state
