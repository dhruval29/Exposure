// Performance Monitor for Landing Page
// Add this script to your HTML to monitor performance

class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
        this.frameTime = 0;
        this.isMonitoring = false;
        this.monitorElement = null;
        
        this.init();
    }
    
    init() {
        // Create monitor display
        this.createMonitorDisplay();
        
        // Start monitoring
        this.startMonitoring();
        
        // Add performance metrics
        this.addPerformanceMetrics();
    }
    
    createMonitorDisplay() {
        this.monitorElement = document.createElement('div');
        this.monitorElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            min-width: 200px;
        `;
        
        this.monitorElement.innerHTML = `
            <div><strong>Performance Monitor</strong></div>
            <div>FPS: <span id="fps">--</span></div>
            <div>Frame Time: <span id="frameTime">--</span>ms</div>
            <div>Memory: <span id="memory">--</span></div>
            <div>Images Drawn: <span id="imagesDrawn">--</span></div>
        `;
        
        document.body.appendChild(this.monitorElement);
    }
    
    startMonitoring() {
        this.isMonitoring = true;
        this.monitorFrame();
    }
    
    monitorFrame() {
        if (!this.isMonitoring) return;
        
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        
        this.frameCount++;
        
        if (deltaTime >= 1000) { // Update every second
            this.fps = Math.round((this.frameCount * 1000) / deltaTime);
            this.frameTime = deltaTime / this.frameCount;
            
            this.updateDisplay();
            
            this.frameCount = 0;
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame(() => this.monitorFrame());
    }
    
    updateDisplay() {
        if (!this.monitorElement) return;
        
        const fpsElement = this.monitorElement.querySelector('#fps');
        const frameTimeElement = this.monitorElement.querySelector('#frameTime');
        const memoryElement = this.monitorElement.querySelector('#memory');
        
        if (fpsElement) fpsElement.textContent = this.fps;
        if (frameTimeElement) frameTimeElement.textContent = this.frameTime.toFixed(2);
        
        // Memory info (if available)
        if (memoryElement && performance.memory) {
            const memory = performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
            const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
            memoryElement.textContent = `${usedMB}MB / ${totalMB}MB`;
        }
    }
    
    addPerformanceMetrics() {
        // Monitor canvas performance
        const canvas = document.getElementById('canvas');
        if (canvas) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'measure') {
                        console.log(`Canvas operation: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
                    }
                }
            });
            
            try {
                observer.observe({ entryTypes: ['measure'] });
            } catch (e) {
                console.log('PerformanceObserver not supported');
            }
        }
        
        // Monitor image loading
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            img.addEventListener('load', () => {
                console.log(`Image ${index + 1} loaded: ${img.src}`);
            });
            
            img.addEventListener('error', () => {
                console.warn(`Image ${index + 1} failed to load: ${img.src}`);
            });
        });
    }
    
    stopMonitoring() {
        this.isMonitoring = false;
        if (this.monitorElement) {
            this.monitorElement.remove();
            this.monitorElement = null;
        }
    }
    
    // Method to update images drawn count
    updateImagesDrawn(count) {
        const imagesElement = this.monitorElement?.querySelector('#imagesDrawn');
        if (imagesElement) {
            imagesElement.textContent = count;
        }
    }
}

// Auto-start monitor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.performanceMonitor = new PerformanceMonitor();
    
    // Add toggle functionality
    document.addEventListener('keydown', (e) => {
        if (e.key === 'p' && e.ctrlKey) {
            if (window.performanceMonitor.isMonitoring) {
                window.performanceMonitor.stopMonitoring();
                console.log('Performance monitoring stopped. Press Ctrl+P to restart.');
            } else {
                window.performanceMonitor = new PerformanceMonitor();
                console.log('Performance monitoring restarted. Press Ctrl+P to stop.');
            }
        }
    });
    
    console.log('Performance Monitor started! Press Ctrl+P to toggle monitoring.');
});

// Export for manual use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}
