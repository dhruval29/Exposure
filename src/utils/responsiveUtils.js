// Enhanced responsive utilities for better large screen support

/**
 * Creates responsive font sizes that scale properly across all screen sizes
 * @param {number} minSize - Minimum font size in rem
 * @param {number} maxSize - Maximum font size in rem
 * @param {number} viewportScale - Viewport scaling factor (default: 4)
 * @returns {string} - CSS clamp() value
 */
export const responsiveFontSize = (minSize, maxSize, viewportScale = 4) => {
  return `clamp(${minSize}rem, ${viewportScale}vw, ${maxSize}rem)`;
};

/**
 * Creates responsive spacing that scales with viewport
 * @param {number} minSpacing - Minimum spacing in rem
 * @param {number} maxSpacing - Maximum spacing in rem
 * @param {number} viewportScale - Viewport scaling factor (default: 2)
 * @returns {string} - CSS clamp() value
 */
export const responsiveSpacing = (minSpacing, maxSpacing, viewportScale = 2) => {
  return `clamp(${minSpacing}rem, ${viewportScale}vw, ${maxSpacing}rem)`;
};

/**
 * Creates responsive container widths that work well on large screens
 * @param {number} maxWidth - Maximum width in px
 * @param {number} viewportPercent - Viewport percentage (default: 90)
 * @returns {string} - CSS min() value
 */
export const responsiveContainerWidth = (maxWidth, viewportPercent = 90) => {
  return `min(${maxWidth}px, ${viewportPercent}vw)`;
};

/**
 * Breakpoint values for consistent responsive design
 */
export const BREAKPOINTS = {
  mobile: '768px',
  tablet: '1024px',
  desktop: '1440px',
  large: '1920px',
  xlarge: '2560px',
  xxlarge: '3440px'
};

/**
 * Media query helpers
 */
export const mediaQueries = {
  mobile: `@media (max-width: ${BREAKPOINTS.mobile})`,
  tablet: `@media (max-width: ${BREAKPOINTS.tablet})`,
  desktop: `@media (min-width: ${BREAKPOINTS.desktop})`,
  large: `@media (min-width: ${BREAKPOINTS.large})`,
  xlarge: `@media (min-width: ${BREAKPOINTS.xlarge})`,
  xxlarge: `@media (min-width: ${BREAKPOINTS.xxlarge})`
};
