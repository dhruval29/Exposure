# Theatre.js Animation Export Guide

## Export Options

Your Camera Section now has **4 export options** available via the control panel in the top-right corner:

### 1. 📦 Export Animation (JSON)
**Purpose**: Save your complete animation data for backup or sharing
- **What it exports**: Complete Theatre.js project state including all keyframes, timing, and studio data
- **File format**: `.json`
- **Use case**: Backup your work, share with collaborators, version control
- **How to use**: 
  1. Create your animation in the Theatre.js timeline
  2. Click "📦 Export Animation"
  3. File downloads automatically as `camera-animation-[timestamp].json`

### 2. 🚀 Export for Production (Clean JSON)
**Purpose**: Export optimized animation data for production apps
- **What it exports**: Clean animation data without Theatre.js Studio overhead
- **File format**: `.json`
- **Use case**: Deploy animations in production without the Studio
- **Benefits**: Smaller file size, faster loading, no studio dependencies
- **How to use**: Click "🚀 Export for Production"

### 3. 🎥 Record Video (WebM)
**Purpose**: Export your animation as a video file
- **What it exports**: 10-second video recording of your 3D animation
- **File format**: `.webm` (30 FPS, high quality)
- **Use case**: Social media, presentations, demos, portfolios
- **How to use**: 
  1. Click "🎥 Record Video"
  2. Animation records for 10 seconds automatically
  3. Click "⏹️ Stop Recording" to end early if needed
  4. Video downloads when complete

### 4. 📂 Load Animation
**Purpose**: Import previously exported animation data
- **What it imports**: Theatre.js JSON files from previous exports
- **How to use**: Click "📂 Load Animation" and select your `.json` file

## Production Workflow

### For Development & Collaboration
```javascript
// 1. Export Animation (full data)
// 2. Share JSON file with team
// 3. Load Animation to continue work
```

### For Production Deployment
```javascript
// 1. Export for Production (clean data)
// 2. Load in production app without @theatre/studio
// 3. Smaller bundle, better performance
```

### For Marketing & Demos
```javascript
// 1. Record Video
// 2. Share WebM files on social media
// 3. Convert to MP4 if needed using online tools
```

## Technical Details

### Animation Data Structure
- **Full Export**: Includes studio metadata, UI state, complete revision history
- **Production Export**: Only animation keyframes and essential data
- **File size**: Production exports are ~50-70% smaller

### Video Recording
- **Format**: WebM (VP8 codec)
- **Quality**: 8 Mbps bitrate for high quality
- **Frame Rate**: 30 FPS
- **Duration**: Matches your sequence length (currently 10 seconds)
- **Browser Support**: Chrome, Firefox, Safari (recent versions)

### Loading Animations
- Compatible with any Theatre.js project using the same structure
- Automatically applies keyframes to matching `theatreKey` elements
- Preserves timing and easing curves

## Troubleshooting

### Export Fails
- **Solution**: Make sure you've created keyframes in the Theatre.js timeline
- **Check**: Browser console for error messages

### Video Recording Not Working
- **Requirement**: Modern browser with MediaRecorder API support
- **Alternative**: Use screen recording software as fallback

### Large File Sizes
- **Animation JSON**: Use "Production Export" for smaller files
- **Video**: WebM is already optimized, convert to MP4 if needed

## Next Steps

1. **Test Export**: Create a simple animation and try all export options
2. **Production Setup**: Use production exports in your deployed app
3. **Video Sharing**: Convert WebM to MP4 for broader compatibility if needed
4. **Version Control**: Save animation JSON files in your repo for team collaboration

## Browser Compatibility

- **JSON Export**: All modern browsers ✅
- **Video Recording**: Chrome, Firefox, Safari (2020+) ✅
- **File Download**: All modern browsers ✅

Happy animating! 🎬 