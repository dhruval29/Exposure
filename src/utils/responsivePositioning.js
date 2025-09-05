// Responsive positioning utility
// Maintains exact same layout proportions across all screen sizes

// Base design dimensions (what you designed for)
const BASE_WIDTH = 1440;
const BASE_HEIGHT = 2000; // Approximate height based on your max top values

/**
 * Converts pixel values to responsive units that maintain the same proportions
 * @param {number} value - Pixel value from your design
 * @param {string} dimension - 'width' or 'height' for viewport scaling
 * @returns {string} - CSS value with viewport units
 */
export const responsivePx = (value, dimension = 'width') => {
  if (dimension === 'width') {
    return `${(value / BASE_WIDTH) * 100}vw`;
  } else {
    return `${(value / BASE_HEIGHT) * 100}vh`;
  }
};

/**
 * Converts pixel values to responsive units for both width and height
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 * @returns {object} - Object with responsive width and height
 */
export const responsiveSize = (width, height) => ({
  width: responsivePx(width, 'width'),
  height: responsivePx(height, 'height')
});

/**
 * Converts absolute positioning to responsive positioning
 * @param {number} top - Top position in pixels
 * @param {number} left - Left position in pixels
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 * @returns {object} - Object with responsive positioning styles
 */
export const responsivePosition = (top, left, width, height) => ({
  position: 'absolute',
  top: responsivePx(top, 'height'),
  left: responsivePx(left, 'width'),
  width: responsivePx(width, 'width'),
  height: responsivePx(height, 'height')
});

/**
 * Responsive font size that scales with viewport
 * @param {number} fontSize - Font size in pixels
 * @returns {string} - Responsive font size
 */
export const responsiveFontSize = (fontSize) => {
  return responsivePx(fontSize, 'width');
};

/**
 * Responsive spacing that scales with viewport
 * @param {number} spacing - Spacing in pixels
 * @returns {string} - Responsive spacing
 */
export const responsiveSpacing = (spacing) => {
  return responsivePx(spacing, 'width');
};

// Common responsive breakpoints
export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1440px',
  large: '1920px'
};

// Responsive media queries
export const mediaQueries = {
  mobile: `@media (max-width: ${BREAKPOINTS.mobile})`,
  tablet: `@media (max-width: ${BREAKPOINTS.tablet})`,
  desktop: `@media (min-width: ${BREAKPOINTS.desktop})`,
  large: `@media (min-width: ${BREAKPOINTS.large})`
};
