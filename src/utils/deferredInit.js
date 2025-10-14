/**
 * Utilities for deferring non-critical work to improve initial load performance
 */

/**
 * Defer callback execution until browser is idle
 * @param {Function} callback - Function to execute when idle
 * @param {Object} options - Options for requestIdleCallback
 */
export const deferToIdle = (callback, options = { timeout: 2000 }) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(callback, 1);
  }
};

/**
 * Defer callback until after page load
 * @param {Function} callback - Function to execute after load
 */
export const deferToLoad = (callback) => {
  if (document.readyState === 'complete') {
    callback();
  } else {
    window.addEventListener('load', callback, { once: true });
  }
};

/**
 * Defer callback using requestAnimationFrame
 * Useful for visual updates that can wait
 * @param {Function} callback - Function to execute on next frame
 */
export const deferToNextFrame = (callback) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback);
  });
};

/**
 * Batch multiple deferred operations
 * @param {Function[]} callbacks - Array of callbacks to defer
 * @param {number} delay - Delay between each callback in ms
 */
export const batchDefer = (callbacks, delay = 100) => {
  callbacks.forEach((callback, index) => {
    setTimeout(callback, delay * index);
  });
};

export default deferToIdle;

