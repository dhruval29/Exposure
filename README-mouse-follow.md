# Mouse Follow Image Trail Effect

A sophisticated mouse follow animation that creates a trail of images that follow your cursor, similar to the waitlist section from the original design.

## 🚀 Features

- **Mouse Follow Animation**: Images follow your cursor with smooth scaling
- **Distance-Based Scaling**: Images scale up when close to mouse, down when far
- **Responsive Design**: Adapts to different screen sizes
- **Touch Device Support**: Automatically detects and adjusts for touch devices
- **GSAP Animations**: Smooth text animations and scroll triggers
- **Performance Optimized**: Uses canvas for smooth 60fps animation
- **Fallback Images**: Generates colored rectangles if images fail to load

## 📁 Files Included

1. **`mouse-follow-effect.html`** - Main HTML file
2. **`mouse-follow-styles.css`** - Complete CSS styling
3. **`mouse-follow-script.js`** - JavaScript with mouse follow logic
4. **`gsap.min.js`** - GSAP core library (local copy)
5. **`ScrollTrigger.min.js`** - GSAP ScrollTrigger plugin (local copy)

## 🎯 How It Works

### Mouse Tracking
- Tracks mouse position in real-time
- Calculates normalized coordinates (-1 to 1)
- Updates 60 times per second for smooth following

### Image Grid System
- Images arranged in a responsive grid
- Grid adapts to window size
- Images wrap around screen edges

### Distance-Based Scaling
- Images scale based on proximity to mouse cursor
- Closer images = larger scale
- Farther images = smaller scale
- Creates a dynamic "magnetic" effect

### Performance Features
- Canvas-based rendering for smooth animation
- RequestAnimationFrame for optimal frame rate
- Efficient distance calculations
- Memory management for image loading

## 🛠️ Setup Instructions

### 1. Basic Setup
1. Place all files in the same directory
2. Open `mouse-follow-effect.html` in a web browser
3. Move your mouse around to see the effect!

### 2. Customization

#### Change Images
Edit the `imageData` array in `mouse-follow-script.js`:
```javascript
const imageData = [
    { 
        id: 'your-image-1', 
        ratio: 1, // width/height ratio
        url: 'path/to/your/image1.jpg' 
    },
    // Add more images...
];
```

#### Adjust Animation Settings
Modify the settings in `mouse-follow-script.js`:
```javascript
function updateSettings() {
    if (window.innerWidth >= 1024) {
        settings.imgSize = window.innerHeight * 0.075;      // Desktop image size
        settings.maxDistance = window.innerHeight * 0.3;    // Desktop max distance
    } else {
        settings.imgSize = window.innerHeight * 0.05;       // Mobile image size
        settings.maxDistance = window.innerHeight * 0.2;    // Mobile max distance
    }
    settings.gap = window.innerHeight * 0.06;              // Gap between images
}
```

#### Change Colors
Edit CSS variables in `mouse-follow-styles.css`:
```css
:root {
    --color-beige: #d8d7d1;    /* Background color */
    --color-black: #1a1915;    /* Text color */
    --color-white: #ffffff;    /* Button text */
    --color-yellow: #f5d76e;   /* Accent color */
}
```

## 🎨 Customization Options

### Text Content
Edit the HTML in `mouse-follow-effect.html`:
```html
<div class="intro-title">
    <div class="line top">
        <span class="word">Your</span>
        <span class="word">Custom</span>
        <span class="word">Text</span>
    </div>
    <div class="line bottom">
        <span class="word">Here</span>
    </div>
</div>
```

### Button Text
Change the button text:
```html
<button class="btn" onclick="openModal()">
    <span class="chars">
        <div data-text="Your Button Text">Your Button Text</div>
    </span>
</button>
```

### Animation Timing
Adjust animation speeds in `mouse-follow-script.js`:
```javascript
// Text animation timing
gsap.to(words, {
    opacity: 1,
    y: 0,
    duration: 0.8,        // Animation duration
    ease: "power2.out",   // Easing function
    stagger: 0.1,         // Delay between words
});
```

## 🔧 Technical Details

### Browser Support
- Modern browsers with Canvas API support
- ES6+ JavaScript features
- CSS Grid and Flexbox support

### Performance
- 60fps animation target
- Efficient canvas rendering
- Optimized mouse tracking
- Memory-conscious image loading

### Dependencies
- **GSAP 3.12+** - Animation library
- **ScrollTrigger** - Scroll-based animations
- **Canvas API** - Image rendering
- **ResizeObserver** - Responsive behavior

## 🚨 Troubleshooting

### Images Not Loading
- Check image URLs in `imageData` array
- Ensure images are accessible
- Check browser console for errors
- Fallback colored rectangles will appear

### Animation Not Working
- Verify GSAP files are loaded
- Check browser console for JavaScript errors
- Ensure canvas element exists
- Verify mouse events are working

### Performance Issues
- Reduce number of images in `imageData`
- Decrease `imgSize` in settings
- Increase `gap` between images
- Check for other JavaScript running

## 📱 Mobile Considerations

- Touch devices automatically disable mouse follow
- Scroll-triggered animations still work
- Responsive image sizing
- Touch-friendly button interactions

## 🔮 Future Enhancements

- **Custom Image Masks**: Add circular or custom-shaped image masks
- **Particle Effects**: Add floating particles around images
- **Sound Effects**: Audio feedback on mouse movement
- **3D Effects**: Add depth and perspective
- **Interactive Elements**: Clickable images with hover effects

## 📄 License

This implementation is based on the original waitlist design and is provided for educational and development purposes.

## 🤝 Support

For issues or questions:
1. Check browser console for errors
2. Verify all files are in the same directory
3. Ensure GSAP libraries are properly loaded
4. Test in different browsers

---

**Enjoy your mouse follow image trail effect! 🎉**
