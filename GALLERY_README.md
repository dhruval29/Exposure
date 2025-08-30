# Image Gallery Page

A standalone, responsive image gallery page with modern design and interactive features.

## Features

- **Responsive Grid Layout**: Automatically adjusts to different screen sizes
- **Category Filtering**: Filter images by nature, urban, and abstract categories
- **Lightbox View**: Click on any image to view it in full-screen mode
- **Keyboard Navigation**: Use arrow keys and Escape key in lightbox mode
- **Smooth Animations**: Beautiful hover effects and loading animations
- **Mobile Optimized**: Touch-friendly interface for mobile devices

## Files Created

1. **`gallery.html`** - Standalone HTML file that can be opened directly in any browser
2. **`src/components/GalleryPage/GalleryPage.jsx`** - React component for integration
3. **`src/components/GalleryPage/GalleryPage.css`** - Styling for the React component
4. **`src/components/GalleryPage/index.js`** - Export file for easy importing

## How to Use

### Option 1: Standalone HTML (Recommended for quick viewing)

1. Simply double-click on `gallery.html` to open it in your default browser
2. The gallery will load with all your project images
3. Click on any image to open the lightbox view
4. Use the filter buttons to view specific categories

### Option 2: React Component Integration

If you want to integrate the gallery into your React app:

```jsx
import GalleryPage from './components/GalleryPage';

// In your app
function App() {
  return (
    <div>
      <GalleryPage />
    </div>
  );
}
```

## Gallery Controls

### Filtering
- **All Images**: Shows all available images
- **Nature**: Shows only nature-themed images
- **Urban**: Shows only urban/city images  
- **Abstract**: Shows only abstract/artistic images

### Lightbox Navigation
- **Click**: Click anywhere on an image to open lightbox
- **Close**: Click the × button or press Escape key
- **Previous**: Click ‹ button or press Left Arrow key
- **Next**: Click › button or press Right Arrow key

## Image Sources

The gallery automatically loads images from your `public/pictures/` folder:
- `4ca5bc212bb689a1f9a15d95833b43b8ebb3b9ab.png` - Natural Landscape
- `66b90841dac09204196c2799eb092dfc82cb4d49.png` - Urban Scene
- `forest.png` - Forest View
- `e6598e5c25c54119d943da26c46ea508e5daf7cf.png` - Abstract Art
- `fea9ef66f94ec76e2005159a55ddfbe0fc03f4b9.png` - Natural Beauty
- `e7643725a3b70e0bc912211e0911b18522585aa2.png` - City Life
- `a4127d727720d4c092e45fefaf0b05c0c79fe2d4.png` - Modern Design

## Customization

### Adding New Images
1. Place new images in the `public/pictures/` folder
2. Update the `galleryImages` array in the JavaScript code
3. Add appropriate category and title information

### Changing Categories
Modify the `categories` array to add, remove, or rename categories:

```javascript
const categories = [
  { id: 'all', name: 'All Images' },
  { id: 'nature', name: 'Nature' },
  { id: 'urban', name: 'Urban' },
  { id: 'abstract', name: 'Abstract' },
  { id: 'newcategory', name: 'New Category' } // Add new category
];
```

### Styling Changes
The CSS includes comprehensive styling with:
- CSS custom properties for easy color changes
- Responsive breakpoints for mobile optimization
- Smooth transitions and animations
- Modern glassmorphism effects

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- **Lazy Loading**: Images load only when needed
- **Optimized Animations**: Uses CSS transforms for smooth performance
- **Responsive Images**: Automatically scales for different screen sizes
- **Efficient DOM Updates**: Minimal re-renders during filtering

## Accessibility

- Keyboard navigation support
- Screen reader friendly
- High contrast design
- Focus indicators for interactive elements
- Semantic HTML structure

## Troubleshooting

### Images Not Loading
- Check that image paths are correct
- Ensure images exist in the `public/pictures/` folder
- Verify file permissions

### Lightbox Not Working
- Check browser console for JavaScript errors
- Ensure all required CSS and JavaScript is loaded
- Try refreshing the page

### Mobile Issues
- Test on different mobile devices
- Check viewport meta tag is present
- Verify touch event handling

## License

This gallery component is created for your project and can be freely modified and used.
