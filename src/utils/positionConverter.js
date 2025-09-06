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
// Fixed pixel positioning for massive canvas (no responsive scaling)
export const fixedImagePositions = (top, left, width, height) => ({
  position: 'absolute',
  top: `${top}px`,
  left: `${left}px`,
  width: `${width}px`,
  height: `${height}px`
});

export const responsiveImagePositions = {
  // Image 1 - IMG_20250105_140531-2.jpg
  image1: fixedImagePositions(1307, 86, 483, 281),
  
  // Image 2 - IMG_20241129_052647.jpg
  image2: fixedImagePositions(1706, 446, 313, 556),
  
  // Image 3 - IMG_20241226_200855.jpg
  image3: fixedImagePositions(947, 451, 541, 304),
  
  // Image 4 - IMG_20250105_135654.jpg
  image4: fixedImagePositions(480, 611, 234, 416),
  
  // Image 5 - IMG_20241227_151324.jpg
  image5: fixedImagePositions(1307, 632, 343, 343),
  
  // Image 6 - IMG_20250106_201327.jpg
  image6: fixedImagePositions(942, 86, 315, 315),
  
  // Image 7 - IMG_20241129_012410.jpg
  image7: fixedImagePositions(1706, 804, 646, 364),
  
  // Image 8 - IMG_20241129_044846.jpg
  image8: fixedImagePositions(621, 902, 548, 275),
  
  // Image 9 - IMG_20241229_133606.jpg
  image9: fixedImagePositions(947, 1050, 400, 703),
  
  // Image 10 - IMG_20241227_143524.jpg
  image10: fixedImagePositions(1638, 87, 314, 624),
  
  // Image 11 - IMG_20250105_143206.jpg
  image11: fixedImagePositions(600, 91, 478, 286),
  
  // Image 12 - IMG_20241225_153158.jpg
  image12: fixedImagePositions(2312, 86, 673, 357),
  
  // Image 13 - IMG_20241229_134141.jpg
  image13: fixedImagePositions(2126, 804, 323, 574),
  
  // Image 14 - IMG_20241227_151216.jpg
  image14: fixedImagePositions(2130, 1168, 282, 283),
  
  // Image 15 - IMG_20250114_093607.jpg
  image15: fixedImagePositions(2442, 1168, 282, 282)
};

/**
 * Responsive positioning for the loading title
 */
export const responsiveLoadingTitle = responsivePosition(314, 503, 530, 171);
