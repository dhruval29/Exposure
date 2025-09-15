# Mobile Assets Organization

## 📁 Mobile Asset Structure

```
public/assets/mobile/
├── images/
│   ├── sliding-page/          # Images for IPhone13141 component
│   │   ├── 1.webp
│   │   ├── 2.webp
│   │   ├── 3.webp
│   │   ├── 4.webp
│   │   ├── 5.webp
│   │   ├── 6.webp
│   │   ├── 7.webp
│   │   ├── 8.webp
│   │   ├── 9.webp
│   │   ├── 10.webp
│   │   ├── 11.png
│   │   ├── 12.png
│   │   ├── 13.png
│   │   ├── 14.png
│   │   ├── 15.png
│   │   └── 16.png
│   │
│   ├── fly-images/            # Images for Fly component (3D fly-through)
│   │   ├── 1.webp
│   │   ├── 2.webp
│   │   ├── 3.webp
│   │   ├── 4.webp
│   │   ├── 5.webp
│   │   ├── 6.webp
│   │   ├── 7.webp
│   │   ├── 8.webp
│   │   ├── 9.webp
│   │   ├── 10.webp
│   │   ├── 11.webp
│   │   ├── 12.webp
│   │   ├── 13.webp
│   │   ├── 14.webp
│   │   └── 15.webp
│   │
│   ├── zoom-reveal/           # Images for ZoomReveal component
│   │   └── zoom-reveal.webp
│   │
│   └── navigation/            # Background images for NavigationMenu
│       ├── 7.webp
│       ├── 8.webp
│       ├── 11.webp
│       └── 12.webp
│
├── icons/                     # Icons used in mobile components
│   ├── cursor-final.png       # Custom cursor for NavigationMenu
│   ├── arrow-up.svg          # Arrow icon for NavigationMenu
│   └── new-arrow.svg         # Arrow icon for NavigationMenu
│
└── fonts/                     # Mobile-optimized fonts
    ├── PPEditorialNew-Regular.otf    # Main text font for sliding page
    ├── Helvetica.ttf                 # Navigation menu font
    └── Geist-Regular.ttf             # General UI font
```

## 🎯 Component Asset Mapping

### 1. **Sliding Page (IPhone13141)**
- **Location**: `/assets/mobile/images/sliding-page/`
- **Images**: 1.webp through 16.png
- **Usage**: Mobile gallery layout with storytelling text

### 2. **Fly Component**
- **Location**: `/assets/mobile/images/fly-images/`
- **Images**: 1.webp through 15.webp
- **Usage**: 3D fly-through animation (20% larger on mobile)

### 3. **ZoomReveal Component**
- **Location**: `/assets/mobile/images/zoom-reveal/`
- **Images**: zoom-reveal.webp
- **Usage**: "Take a closer look at Life" section

### 4. **Navigation Menu**
- **Location**: `/assets/mobile/images/navigation/`
- **Images**: Background images for menu items
- **Icons**: `/assets/mobile/icons/`
- **Usage**: Scaled down menu with hover effects

## 📱 Mobile-Specific Optimizations

### Image Scaling
- **Fly Images**: 20% larger on mobile (≤768px)
- **Sliding Page**: Responsive percentage-based positioning
- **Navigation**: Scaled down container and elements

### Font Scaling
- **ZoomReveal Text**: 20% larger font size on mobile
- **Navigation Text**: Responsive font sizing maintained

### Layout Adjustments
- **Text Spacing**: Reduced spacing between text boxes on mobile
- **Container Widths**: Optimized for 390px mobile viewport
- **Z-index Management**: Proper layering for mobile interactions

## 🔧 Implementation Notes

### Current Asset References
```javascript
// Sliding Page Images
src="/assets/images/iphone1314/1.webp"

// Fly Component Images  
src="/assets/images/ui/1.webp"

// ZoomReveal Image
src="/assets/images/ui/zoom-reveal.webp"

// Navigation Backgrounds
src="/assets/images/backgrounds/7.webp"

// Icons
src="/assets/icons/cursor final.png"
src="/new-arrow.svg"
```

### Recommended Mobile Asset References
```javascript
// Sliding Page Images
src="/assets/mobile/images/sliding-page/1.webp"

// Fly Component Images
src="/assets/mobile/images/fly-images/1.webp"

// ZoomReveal Image
src="/assets/mobile/images/zoom-reveal/zoom-reveal.webp"

// Navigation Backgrounds
src="/assets/mobile/images/navigation/7.webp"

// Icons
src="/assets/mobile/icons/cursor-final.png"
src="/assets/mobile/icons/new-arrow.svg"
```

## 📋 Migration Checklist

- [ ] Create mobile asset directories
- [ ] Copy existing assets to mobile folders
- [ ] Update component imports to use mobile asset paths
- [ ] Test mobile responsiveness
- [ ] Optimize image formats for mobile (WebP preferred)
- [ ] Ensure proper fallbacks for unsupported formats

## 🚀 Benefits of Mobile Asset Organization

1. **Performance**: Faster loading with mobile-optimized assets
2. **Maintainability**: Clear separation of desktop vs mobile assets
3. **Scalability**: Easy to add mobile-specific variants
4. **Debugging**: Easier to identify mobile-specific issues
5. **Optimization**: Can apply mobile-specific compression and sizing
