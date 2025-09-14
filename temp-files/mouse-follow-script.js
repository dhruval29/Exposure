// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Mouse tracking
const mouse = { x: 0, y: 0, nX: 0, nY: 0 };

function onMouseMove(e) {
    mouse.x = Math.max(0, Math.min(e.clientX, window.innerWidth));
    mouse.y = Math.max(0, Math.min(e.clientY, window.innerHeight));
    mouse.nX = (mouse.x / window.innerWidth) * 2 - 1;
    mouse.nY = -(mouse.y / window.innerHeight) * 2 + 1;
}

// Touch detection
function isTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Performance optimization: Use high DPI canvas
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    updateSettings();
}

// Animation settings - exactly like the original
let settings = {
    imgSize: 0,
    maxDistance: 0,
    gap: 0,
    step: 0,
    cols: 0,
    rows: 0,
    forceScale: 0
};

function updateSettings() {
    if (window.innerWidth >= 1024) {
        settings.imgSize = window.innerHeight * 0.25;
        settings.maxDistance = window.innerHeight * 0.5;
    } else {
        settings.imgSize = window.innerHeight * 0.18;
        settings.maxDistance = window.innerHeight * 0.35;
    }
    settings.gap = window.innerHeight * 0.45;
    settings.step = settings.imgSize + settings.gap;
    
    // Single uniform grid layout - no extra coverage
    settings.cols = Math.ceil(window.innerWidth / settings.step);
    settings.rows = Math.ceil(window.innerHeight / settings.step);
    
    // Update pre-calculated dimensions for all loaded images when settings change
    if (images.length > 0) {
        images.forEach(image => {
            if (image.ratio >= 1) {
                image.baseWidth = settings.imgSize;
                image.baseHeight = settings.imgSize / image.ratio;
            } else {
                image.baseHeight = settings.imgSize;
                image.baseWidth = settings.imgSize * image.ratio;
            }
            
            // Ensure very long images don't get compressed - let them extend beyond slot if needed
            if (image.ratio < 0.5) { // Very long/tall images
                image.baseHeight = settings.imgSize * 1.5; // Allow extra height
                image.baseWidth = image.baseHeight * image.ratio; // Maintain aspect ratio
            }
        });
    }
}

// Image data - updated to use compressed images from Downloads folder
const imageData = [
    { id: 'IMG_20250105_140531-2', ratio: 600 / 651, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250105_140531-2.jpg' },
    { id: 'IMG_20241129_052647', ratio: 600 / 522, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241129_052647.jpg' },
    { id: 'IMG_20241226_200855', ratio: 600 / 420, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241226_200855.jpg' },
    { id: 'IMG_20250105_135654', ratio: 600 / 612, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250105_135654.jpg' },
    { id: 'IMG_20241227_151324', ratio: 600 / 417, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241227_151324.jpg' },
    { id: 'IMG_20250106_201327', ratio: 600 / 559, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250106_201327.jpg' },
    { id: 'IMG_20241129_044846', ratio: 600 / 583, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241129_044846.jpg' },
    { id: 'IMG_20241229_133606', ratio: 600 / 544, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241229_133606.jpg' },
    { id: 'IMG_20250105_143206', ratio: 600 / 663, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250105_143206.jpg' },
    { id: 'IMG_20250105_192834', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250105_192834.jpg' },
    { id: 'IMG_20250114_093607', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250114_093607.jpg' },
    { id: 'IMG_20250114_191924', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250114_191924.jpg' },
    { id: 'IMG_20250114_201656', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250114_201656.jpg' },
    { id: 'IMG_20250108_165155', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250108_165155.jpg' },
    { id: 'IMG_20250108_164936', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250108_164936.jpg' },
    { id: 'IMG_20250108_151138', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250108_151138.jpg' },
    { id: 'IMG_20250106_191442-2', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250106_191442-2.jpg' },
    { id: 'IMG_20250105_140531', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250105_140531.jpg' },
    { id: 'IMG_20250105_133713', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250105_133713.jpg' },
    { id: 'IMG_20250101_151523', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250101_151523.jpg' },
    { id: 'IMG_20250101_120715', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250101_120715.jpg' },
    { id: 'IMG_20250101_101901', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250101_101901.jpg' },
    { id: 'IMG_20241231_163537', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241231_163537.jpg' },
    { id: 'IMG_20241229_142232', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241229_142232.jpg' },
    { id: 'IMG_20241229_134149', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241229_134149.jpg' },
    { id: 'IMG_20241229_133635', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241229_133635.jpg' },
    { id: 'IMG_20241229_133432', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241229_133432.jpg' },
    { id: 'IMG_20241227_220159', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20250105_140531-2.jpg' },
    { id: 'IMG_20241227_151216', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241227_151216.jpg' },
    { id: 'IMG_20241227_150607', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241227_150607.jpg' },
    { id: 'IMG_20241227_145117', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241227_145117.jpg' },
    { id: 'IMG_20241227_144906', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241227_144906.jpg' },
    { id: 'IMG_20241227_143955', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241227_143955.jpg' },
    { id: 'IMG_20241227_143524', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241227_143524.jpg' },
    { id: 'IMG_20241227_143322', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241227_143322.jpg' },
    { id: 'IMG_20241227_103029', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241227_103029.jpg' },
    { id: 'IMG_20241227_102353', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241227_102353.jpg' },
    { id: 'IMG_20241225_153158-2', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241225_153158-2.jpg' },
    { id: 'IMG_20241129_081550', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241129_081550.jpg' },
    { id: 'IMG_20241129_045140-2', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/IMG_20241129_045140 (2).jpg' },
    { id: 'forest', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/forest.jpg' },
    { id: 'a4127d727720d4c092e45fefaf0b05c0c79fe2d4', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/a4127d727720d4c092e45fefaf0b05c0c79fe2d4.jpg' },
    { id: '66b90841dac09204196c2799eb092dfc82cb4d49', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/66b90841dac09204196c2799eb092dfc82cb4d49.jpg' },
    { id: '4ca5bc212bb689a1f9a15d95833b43b8ebb3b9ab', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/4ca5bc212bb689a1f9a15d95833b43b8ebb3b9ab.jpg' },
    { id: '_SV16657', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/_SV16657.jpg' },
    { id: '_SV16608', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/_SV16608.jpg' },
    { id: '_SV16461', ratio: 600 / 428, path: 'C:/Users/dhruv/Downloads/iloveimg-compressed (1)/_SV16461.jpg' }
];

let images = [];
let isActive = false;
let animationId;
let time = 0;
let forceScale = 0;
let centerX = 0, centerY = 0;
let centerRadius = 0;

// Performance optimization: Frame rate limiting
let lastFrameTime = 0;
const targetFPS = 30; // Reduced from 60fps to 30fps for better performance
const frameInterval = 1000 / targetFPS;

// Performance optimization: Throttle mouse events
let lastMouseUpdate = 0;
const mouseThrottleMs = 16; // ~60fps for mouse updates

function onMouseMove(e) {
    const now = performance.now();
    if (now - lastMouseUpdate < mouseThrottleMs) return;
    
    lastMouseUpdate = now;
    mouse.x = Math.max(0, Math.min(e.clientX, window.innerWidth));
    mouse.y = Math.max(0, Math.min(e.clientY, window.innerHeight));
    mouse.nX = (mouse.x / window.innerWidth) * 2 - 1;
    mouse.nY = -(mouse.y / window.innerHeight) * 2 + 1;
}

// Load images
async function loadImages() {
    // Create only 1 copy of each image type for minimal, impactful images
    const imageUrls = imageData.flatMap(data => 
        Array(1).fill(null).map((_, index) => ({
            url: data.path,
            ratio: data.ratio
        }))
    );
    
    // Take only the first 20 images for a cleaner, more uniform grid
    const limitedImageUrls = imageUrls.slice(0, 20);
    
    // Shuffle the limited set of images
    const shuffled = limitedImageUrls.sort(() => Math.random() - 0.5);
    
    const promises = shuffled.map(data => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const ratio = img.naturalWidth / img.naturalHeight; // true aspect
                
                // Pre-calculate base dimensions for performance
                let baseWidth, baseHeight;
                if (ratio >= 1) {
                    // Landscape: width = settings.imgSize, height = width / ratio
                    baseWidth = settings.imgSize;
                    baseHeight = settings.imgSize / ratio;
                } else {
                    // Portrait: height = settings.imgSize, width = height * ratio
                    baseHeight = settings.imgSize;
                    baseWidth = settings.imgSize * ratio;
                }
                
                // Ensure very long images don't get compressed - let them extend beyond slot if needed
                if (ratio < 0.5) { // Very long/tall images
                    baseHeight = settings.imgSize * 1.5; // Allow extra height
                    baseWidth = baseHeight * ratio; // Maintain aspect ratio
                }
                
                resolve({ ...data, ratio, img, baseWidth, baseHeight });
            };
            img.onerror = () => {
                // Create a colored rectangle as fallback
                const fallbackCanvas = document.createElement('canvas');
                fallbackCanvas.width = 200;
                fallbackCanvas.height = 200;
                const fallbackCtx = fallbackCanvas.getContext('2d');
                
                // Create a more interesting fallback pattern
                const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                fallbackCtx.fillStyle = color;
                fallbackCtx.fillRect(0, 0, 200, 200);
                
                // Add some pattern
                fallbackCtx.fillStyle = 'rgba(255,255,255,0.3)';
                fallbackCtx.fillRect(50, 50, 100, 100);
                
                const fallbackImg = new Image();
                fallbackImg.onload = () => {
                    const ratio = fallbackImg.naturalWidth / fallbackImg.naturalHeight; // true aspect
                    
                    // Pre-calculate base dimensions for fallback images too
                    let baseWidth, baseHeight;
                    if (ratio >= 1) {
                        baseWidth = settings.imgSize;
                        baseHeight = settings.imgSize / ratio;
                    } else {
                        baseHeight = settings.imgSize;
                        baseWidth = settings.imgSize * ratio;
                    }
                    
                    // Ensure very long images don't get compressed - let them extend beyond slot if needed
                    if (ratio < 0.5) { // Very long/tall images
                        baseHeight = settings.imgSize * 1.5; // Allow extra height
                        baseWidth = baseHeight * ratio; // Maintain aspect ratio
                    }
                    
                    resolve({ ...data, ratio, img: fallbackImg, baseWidth, baseHeight });
                };
                fallbackImg.src = fallbackCanvas.toDataURL();
            };
            img.src = data.url;
        });
    });
    
    images = await Promise.all(promises);
    console.log('Images loaded:', images.length);
    
    // Hide loading screen
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.classList.add('hidden');
        setTimeout(() => loading.remove(), 500);
    }
}

// Main animation loop - optimized for performance
function animate(currentTime) {
    if (!isActive) return;

    // Frame rate limiting
    if (currentTime - lastFrameTime < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
    }
    lastFrameTime = currentTime;

    time += 0.016;
    if (time > 1000) time = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mouse or touch center
    if (isTouch()) {
        centerX = window.innerWidth * 0.5 + centerRadius * 0.75 * Math.cos(time * 0.75);
        centerY = window.innerHeight * 0.5 + centerRadius * Math.sin(time * 0.75);
    } else {
        centerX = mouse.x;
        centerY = mouse.y;
    }

    const totalCols = settings.cols;
    const totalRows = settings.rows;
    let imagesDrawn = 0;

    // Performance optimization: Only draw images that are likely visible
    const visibleRange = Math.ceil(settings.maxDistance / settings.step) + 2;

    for (let row = 0; row < totalRows; row++) {
        for (let col = 0; col < totalCols; col++) {
            const imageIndex = (row * totalCols + col) % images.length;
            const image = images[imageIndex];
            if (!image || !image.img) continue;

            // Slot center
            const slotX = col * settings.step + settings.imgSize / 2;
            const slotY = row * settings.step + settings.imgSize / 2;

            // Distance-based scaling
            const dx = slotX - centerX;
            const dy = slotY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            let scale = 0;
            if (distance < settings.maxDistance) {
                scale = Math.max(0, 4 - (distance / settings.maxDistance) * 4) * forceScale;
            }

            // Performance optimization: Skip drawing if scale is too small
            if (scale < 0.1) continue;

            const finalWidth = image.baseWidth * scale;
            const finalHeight = image.baseHeight * scale;

            if (finalWidth > 2 && finalHeight > 2) {
                const drawX = slotX - finalWidth / 2;
                const drawY = slotY - finalHeight / 2;
                ctx.drawImage(image.img, drawX, drawY, finalWidth, finalHeight);
                imagesDrawn++;
            }
        }
    }

    // Reduced logging frequency
    if (Math.floor(time * 30) % 30 === 0) {
        console.log(`Images drawn: ${imagesDrawn}`);
        
        // Update performance monitor if available
        if (window.performanceMonitor && typeof window.performanceMonitor.updateImagesDrawn === 'function') {
            window.performanceMonitor.updateImagesDrawn(imagesDrawn);
        }
    }

    animationId = requestAnimationFrame(animate);
}

// Start animation
function startAnimation() {
    isActive = true;
    // Set forceScale to 1 immediately for continuous animation
    forceScale = 1;
    animate();
}

// Stop animation
function stopAnimation() {
    isActive = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    // Keep forceScale at 1 so animation can restart immediately
    forceScale = 1;
}

// Text animation
function animateText() {
    const words = document.querySelectorAll('.waitlist .word');
    const waitlistBlock = document.querySelector('.waitlist .waitlist-block');
    
    // Animate words with stagger
    gsap.to(words, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        onComplete: () => {
            // Animate waitlist block
            gsap.to(waitlistBlock, {
                opacity: 1,
                visibility: "visible",
                y: 0,
                duration: 0.6,
                ease: "power2.out"
            });
        }
    });
}

// Scroll animations
function setupScrollAnimations() {
    // Create scroll trigger for text animation
    ScrollTrigger.create({
        trigger: ".waitlist",
        start: "top 80%",
        onEnter: () => {
            animateText();
        },
        once: true
    });
    
    // Create scroll trigger for canvas animation
    ScrollTrigger.create({
        trigger: ".waitlist",
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => {
            startAnimation();
        },
        onLeave: () => {
            stopAnimation();
        },
        onEnterBack: () => {
            startAnimation();
        },
        onLeaveBack: () => {
            stopAnimation();
        }
    });
}

// Modal function (placeholder)
function openModal() {
    alert('Waitlist modal would open here! This is just a demo.');
}

// Initialize
async function init() {
    // Add loading screen
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div>Loading...</div>';
    document.body.appendChild(loading);
    
    // Setup
    resizeCanvas();
    await loadImages();
    
    // Calculate center radius like the original
    centerRadius = Math.min(window.innerWidth * 0.75, window.innerHeight * 0.75);
    
    // Initialize mouse position to center
    centerX = window.innerWidth * 0.5;
    centerY = window.innerHeight * 0.5;
    
    // Event listeners with passive option for better performance
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', resizeCanvas);
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Start animation if not on touch device
    if (!isTouch()) {
        startAnimation();
    }
    
    console.log('Mouse Follow Image Trail Effect initialized!');
    console.log('Mouse tracking active:', !isTouch());
}

// Start the effect when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export functions for global access
window.mouseFollowEffect = {
    start: startAnimation,
    stop: stopAnimation,
    openModal: openModal
};
