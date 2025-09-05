// Utility to convert hardcoded positions to responsive positions
import { responsivePosition } from './responsivePositioning.js';

/**
 * Converts a hardcoded style object to responsive positioning
 * @param {object} style - Style object with hardcoded pixel values
 * @returns {object} - Responsive style object
 */
export const convertToResponsive = (style) => {
  if (!style || typeof style !== 'object') return style;
  
  const { top, left, width, height, ...otherStyles } = style;
  
  // If it has positioning values, convert them
  if (top !== undefined && left !== undefined && width !== undefined && height !== undefined) {
    return {
      ...otherStyles,
      ...responsivePosition(
        typeof top === 'string' ? parseInt(top.replace('px', '')) : top,
        typeof left === 'string' ? parseInt(left.replace('px', '')) : left,
        typeof width === 'string' ? parseInt(width.replace('px', '')) : width,
        typeof height === 'string' ? parseInt(height.replace('px', '')) : height
      )
    };
  }
  
  return style;
};

/**
 * Pre-converted responsive positions for your specific images
 * These maintain the exact same layout proportions across all screen sizes
 */
export const responsiveImagePositions = {
  // Image 1
  image1: responsivePosition(1307, 86, 483, 281),
  
  // Image 2
  image2: responsivePosition(1706, 446, 313, 556),
  
  // Image 3
  image3: responsivePosition(947, 451, 541, 304),
  
  // Image 4
  image4: responsivePosition(480, 611, 234, 416),
  
  // Image 5
  image5: responsivePosition(1307, 632, 343, 343),
  
  // Image 6
  image6: responsivePosition(942, 86, 315, 315),
  
  // Image 7
  image7: responsivePosition(1706, 804, 646, 364),
  
  // Image 8
  image8: responsivePosition(621, 902, 548, 275),
  
  // Image 9
  image9: responsivePosition(947, 1050, 400, 703),
  
  // Image 10
  image10: responsivePosition(1638, 87, 314, 624),
  
  // Image 11
  image11: responsivePosition(600, 91, 478, 286),
  
  // Image 12
  image12: responsivePosition(2312, 86, 673, 357),
  
  // Image 13
  image13: responsivePosition(2126, 804, 323, 574),
  
  // Image 14
  image14: responsivePosition(2130, 1168, 282, 283),
  
  // Image 15
  image15: responsivePosition(2442, 1168, 282, 282)
};

/**
 * Responsive positioning for the loading title
 */
export const responsiveLoadingTitle = responsivePosition(314, 503, 530, 171);
