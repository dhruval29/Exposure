import { test, expect } from '@playwright/test';

test('scroll to ZoomReveal and capture screenshot', async ({ page }) => {
  // Navigate to the landing page
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  
  // Wait for the initial overlay to disappear
  await page.waitForTimeout(3000);
  
  // Get viewport height for calculations
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  
  // Calculate the position of ZoomReveal section
  // For mobile: 100vh + 200vh (SLIDING_HEIGHT) + 40vh = 340vh
  // For desktop: 100vh + 300vh (SLIDING_HEIGHT) + 62vh (NEW_SECTION_HEIGHT) = 462vh
  const isMobile = await page.evaluate(() => window.innerWidth <= 768);
  
  let zoomRevealPosition;
  if (isMobile) {
    zoomRevealPosition = viewportHeight * 3.4; // 340vh
  } else {
    zoomRevealPosition = viewportHeight * 4.62; // 462vh
  }
  
  console.log(`Viewport height: ${viewportHeight}px`);
  console.log(`ZoomReveal position: ${zoomRevealPosition}px`);
  console.log(`Device type: ${isMobile ? 'Mobile' : 'Desktop'}`);
  
  // Scroll to the ZoomReveal section
  await page.evaluate((scrollTo) => {
    window.scrollTo({
      top: scrollTo,
      behavior: 'smooth'
    });
  }, zoomRevealPosition);
  
  // Wait for scroll to complete
  await page.waitForTimeout(1000);
  
  // Now scroll gradually through the ZoomReveal animation
  // The animation is scroll-based (scrub), so we need to scroll through it
  // Need to scroll enough to:
  // 1. Complete the image zoom to full screen
  // 2. Move both text boxes completely off screen
  // 3. Trigger the navigation menu to appear
  const scrollStep = 20; // pixels per step - smaller steps for smoother animation
  const totalScrollDistance = viewportHeight * 2.5; // Scroll 250vh to ensure complete animation and nav appearance
  
  for (let i = 0; i < totalScrollDistance; i += scrollStep) {
    await page.evaluate((step) => {
      window.scrollBy({
        top: step,
        behavior: 'auto'
      });
    }, scrollStep);
    await page.waitForTimeout(25); // Wait 25ms between steps for smooth animation
  }
  
  // Wait for the animation to fully complete
  await page.waitForTimeout(2000);
  
  // Wait for the navigation menu to appear and animate
  await page.waitForSelector('[class*="NavigationMenu"], nav', { state: 'visible', timeout: 5000 });
  
  // Wait for the navigation menu animation to complete
  await page.waitForTimeout(2000);
  
  // Check if the image has scaled to full size, text is off-screen, and nav is visible
  const animationState = await page.evaluate(() => {
    // Find all images
    const allImages = Array.from(document.querySelectorAll('img'));
    console.log(`Total images found: ${allImages.length}`);
    
    // Look for the zoom-reveal image
    const img = allImages.find(img => 
      img.src.includes('zoom-reveal') ||
      (img.alt && img.alt.toLowerCase().includes('zoom'))
    );
    
    if (!img) {
      console.log('Zoom reveal image not found');
      return { imageFound: false, imageScaled: false, textOffScreen: false, navVisible: false };
    }
    
    console.log(`Image found: ${img.src}`);
    
    const computedStyle = window.getComputedStyle(img);
    const width = computedStyle.width;
    const height = computedStyle.height;
    const transform = computedStyle.transform;
    
    console.log(`Image dimensions: ${width} x ${height}`);
    console.log(`Image transform: ${transform}`);
    console.log(`Current scroll position: ${window.scrollY}px`);
    
    // Check if image is close to full viewport size
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const widthPx = parseFloat(width);
    const heightPx = parseFloat(height);
    const widthRatio = widthPx / viewportWidth;
    const heightRatio = heightPx / viewportHeight;
    
    console.log(`Width ratio: ${widthRatio.toFixed(2)}, Height ratio: ${heightRatio.toFixed(2)}`);
    
    const imageScaled = widthRatio > 0.95 && heightRatio > 0.95;
    
    // Check if text boxes are off screen
    const textElements = Array.from(document.querySelectorAll('div')).filter(div => {
      const text = div.textContent.trim();
      return text === 'Take a closer' || text === 'look at Life';
    });
    
    let textOffScreen = false;
    if (textElements.length >= 2) {
      const rect1 = textElements[0].getBoundingClientRect();
      const rect2 = textElements[1].getBoundingClientRect();
      
      // Check if both are completely off screen (left or right)
      const offScreen1 = rect1.right < 0 || rect1.left > viewportWidth;
      const offScreen2 = rect2.right < 0 || rect2.left > viewportWidth;
      textOffScreen = offScreen1 && offScreen2;
      
      console.log(`Text 1 position: left=${rect1.left.toFixed(0)}, right=${rect1.right.toFixed(0)}, offScreen=${offScreen1}`);
      console.log(`Text 2 position: left=${rect2.left.toFixed(0)}, right=${rect2.right.toFixed(0)}, offScreen=${offScreen2}`);
    }
    
    // Check if navigation menu is visible
    const navElements = document.querySelectorAll('nav, [class*="NavigationMenu"], [class*="navigation"]');
    let navVisible = false;
    for (const nav of navElements) {
      const navStyle = window.getComputedStyle(nav);
      if (navStyle.opacity > 0.5 && navStyle.display !== 'none' && navStyle.visibility !== 'hidden') {
        navVisible = true;
        console.log(`Navigation menu found and visible: opacity=${navStyle.opacity}`);
        break;
      }
    }
    
    return {
      imageFound: true,
      imageScaled,
      textOffScreen,
      navVisible,
      dimensions: { width, height },
      ratios: { widthRatio: widthRatio.toFixed(2), heightRatio: heightRatio.toFixed(2) }
    };
  });
  
  console.log(`Image scaled: ${animationState.imageScaled}, Text off-screen: ${animationState.textOffScreen}, Nav visible: ${animationState.navVisible}`);
  
  // Take a screenshot
  await page.screenshot({ 
    path: 'zoom-reveal-screenshot.png',
    fullPage: false // Only capture viewport
  });
  
  console.log('Screenshot saved as zoom-reveal-screenshot.png');
});

