// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Mouse tracking
const mouse = { x: 0, y: 0, nX: 0, nY: 0 };

function onMouseMove(e) {
    mouse.x = Math.max(0, Math.min(e.clientX, window.innerWidth));
    mouse.y = Math.max(0, Math.min(e.clientY, window.innerHeight));
    mouse.nX = (mouse.x / window.innerWidth) * 2 - 1;
    mouse.nY = -(mouse.y / window.innerHeight) * 2 + 1;
    
    // Debug mouse tracking
    if (time % 60 === 0) { // Log every second
        console.log('Mouse position:', mouse.x, mouse.y);
    }
}

// Touch detection
function isTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
        settings.imgSize = window.innerHeight * 0.075;
        settings.maxDistance = window.innerHeight * 0.3;
    } else {
        settings.imgSize = window.innerHeight * 0.05;
        settings.maxDistance = window.innerHeight * 0.2;
    }
    settings.gap = window.innerHeight * 0.06;
    settings.step = settings.imgSize + settings.gap;
    
    // Ensure we have enough images to cover the screen - REDUCED
    settings.cols = Math.ceil(window.innerWidth / settings.step) + 2; // Reduced from +6 to +2
    settings.rows = Math.ceil(window.innerHeight / settings.step) + 2; // Reduced from +6 to +2
}

// Image data - exactly like the original
const imageData = [
    { id: 'sports-outdoor1', ratio: 600 / 651 },
    { id: 'sports-outdoor2', ratio: 600 / 522 },
    { id: 'sports-outdoor3', ratio: 600 / 420 },
    { id: 'home-tech1', ratio: 600 / 612 },
    { id: 'home-tech2', ratio: 600 / 417 },
    { id: 'fashion1', ratio: 600 / 559 },
    { id: 'fashion2', ratio: 600 / 488 },
    { id: 'fashion3', ratio: 600 / 583 },
    { id: 'eat-drinks1', ratio: 600 / 544 },
    { id: 'eat-drinks2', ratio: 600 / 663 },
    { id: 'eac1', ratio: 600 / 428 },
    { id: 'eac2', ratio: 600 / 428 }
];

let images = [];
let isActive = false;
let animationId;
let time = 0;
let forceScale = 0;
let centerX = 0, centerY = 0;
let centerRadius = 0;

// Load images
async function loadImages() {
    // Create 6 copies of each image type like the original
    const imageUrls = imageData.flatMap(data => 
        Array(6).fill(null).map((_, index) => ({
            url: `https://cdn.telescope.fyi/landing/hero/${data.id}/${index}.jpg`,
            ratio: data.ratio
        }))
    );
    
    // Shuffle the images like the original
    const shuffled = imageUrls.sort(() => Math.random() - 0.5);
    
    const promises = shuffled.map(data => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ ...data, img });
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
                fallbackImg.onload = () => resolve({ ...data, img: fallbackImg });
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

// Main animation loop - smooth infinite scrolling without jerks
function animate() {
    if (!isActive) return;
    
    time += 0.016; // 60fps timing
    
    // Reset time periodically to prevent it from getting too large
    // This prevents performance issues while maintaining smooth animation
    if (time > 1000) {
        time = 0;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate center point for touch devices (like the original)
    if (isTouch()) {
        centerX = window.innerWidth * 0.5 + centerRadius * 0.75 * Math.cos(time * 0.75);
        centerY = window.innerHeight * 0.5 + centerRadius * Math.sin(time * 0.75);
    } else {
        // Use mouse position directly for mouse following
        centerX = mouse.x;
        centerY = mouse.y;
    }
    
    // Calculate the total grid size needed for infinite scrolling - REDUCED
    const totalCols = Math.ceil(window.innerWidth / settings.step) + 2; // Reduced from +8 to +2
    const totalRows = Math.ceil(window.innerHeight / settings.step) + 2; // Reduced from +8 to +2
    
    let imagesDrawn = 0;
    
    // Draw images in grid pattern with smooth infinite looping
    for (let row = 0; row < totalRows; row++) {
        for (let col = 0; col < totalCols; col++) {
            const imageIndex = (col + row * totalCols) % images.length;
            const image = images[imageIndex];
            
            if (!image || !image.img) continue;
            
            // Calculate position with smooth continuous scrolling
            const baseX = col * settings.step;
            const baseY = row * settings.step;
            
            // Smooth scrolling motion without modulo resets
            const scrollX = time * 50;
            const scrollY = time * 30;
            
            const x = baseX - scrollX;
            const y = baseY - scrollY;
            
            // Smooth wrapping around screen edges without jerks
            let wrappedX = x;
            let wrappedY = y;
            
            // Wrap X position smoothly
            while (wrappedX < -settings.step) {
                wrappedX += window.innerWidth + settings.step;
            }
            while (wrappedX > window.innerWidth) {
                wrappedX -= window.innerWidth + settings.step;
            }
            
            // Wrap Y position smoothly
            while (wrappedY < -settings.step) {
                wrappedY += window.innerHeight + settings.step;
            }
            while (wrappedY > window.innerHeight) {
                wrappedY -= window.innerHeight + settings.step;
            }
            
            // Only draw if image is visible on screen
            if (wrappedX + settings.imgSize > 0 && wrappedX < window.innerWidth && 
                wrappedY + settings.imgSize > 0 && wrappedY < window.innerHeight) {
                
                // Calculate aspect ratio and dimensions
                let drawWidth, drawHeight;
                if (image.ratio > 1) {
                    drawWidth = settings.imgSize;
                    drawHeight = drawWidth / image.ratio;
                } else {
                    drawHeight = settings.imgSize;
                    drawWidth = drawHeight * image.ratio;
                }
                
                // Calculate distance from center (mouse or touch center)
                const dx = wrappedX + (settings.imgSize - drawWidth) / 2 + settings.imgSize * 0.5 - centerX;
                const dy = wrappedY + (settings.imgSize - drawHeight) / 2 + settings.imgSize * 0.5 - centerY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Scale based on distance
                if (distance < settings.maxDistance) {
                    const scale = Math.max(0, 4 - (distance / settings.maxDistance) * 4) * forceScale;
                    const finalWidth = drawWidth * scale;
                    const finalHeight = drawHeight * scale;
                    
                    if (finalWidth > 0 && finalHeight > 0) {
                        ctx.drawImage(
                            image.img,
                            wrappedX + (settings.imgSize - finalWidth) / 2,
                            wrappedY + (settings.imgSize - finalHeight) / 2,
                            finalWidth,
                            finalHeight
                        );
                        imagesDrawn++;
                    }
                }
            }
        }
    }
    
    // Debug info every second
    if (Math.floor(time * 60) % 60 === 0) {
        console.log(`Images drawn: ${imagesDrawn}, Time: ${time.toFixed(2)}, Mouse: (${centerX.toFixed(0)}, ${centerY.toFixed(0)})`);
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
    
    // Event listeners
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
