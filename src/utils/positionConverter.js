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
// Responsive image positioning that scales with viewport
export const createResponsiveImagePosition = (top, left, width, height) => ({
  position: 'absolute',
  top: `${(top / 2768) * 100}%`, // Scale based on sliding section height
  left: `${(left / 1536) * 100}%`, // Scale based on container width
  width: `${(width / 1536) * 100}%`, // Scale width based on container
  height: `${(height / 2768) * 100}%`, // Scale height based on section
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'cover'
});

export const responsiveImagePositions = {
  // Image 1 - IMG_20250105_140531-2.jpg
  image1: createResponsiveImagePosition(1307, 86, 483, 281),
  
  // Image 2 - IMG_20241129_052647.jpg
  image2: createResponsiveImagePosition(1706, 446, 313, 556),
  
  // Image 3 - IMG_20241226_200855.jpg
  image3: createResponsiveImagePosition(947, 451, 541, 304),
  
  // Image 4 - IMG_20250105_135654.jpg
  image4: createResponsiveImagePosition(480, 611, 234, 416),
  
  // Image 5 - IMG_20241227_151324.jpg
  image5: createResponsiveImagePosition(1307, 632, 343, 343),
  
  // Image 6 - IMG_20250106_201327.jpg
  image6: createResponsiveImagePosition(942, 86, 315, 315),
  
  // Image 7 - IMG_20241129_012410.jpg
  image7: createResponsiveImagePosition(1706, 804, 646, 364),
  
  // Image 8 - IMG_20241129_044846.jpg
  image8: createResponsiveImagePosition(621, 902, 548, 275),
  
  // Image 9 - IMG_20241229_133606.jpg
  image9: createResponsiveImagePosition(947, 1050, 400, 703),
  
  // Image 10 - IMG_20241227_143524.jpg
  image10: createResponsiveImagePosition(1638, 87, 314, 624),
  
  // Image 11 - IMG_20250105_143206.jpg
  image11: createResponsiveImagePosition(600, 91, 478, 286),
  
  // Image 12 - IMG_20241225_153158.jpg
  image12: createResponsiveImagePosition(2312, 86, 673, 357),
  
  // Image 13 - IMG_20241229_134141.jpg
  image13: createResponsiveImagePosition(2126, 804, 323, 574),
  
  // Image 14 - IMG_20241227_151216.jpg
  image14: createResponsiveImagePosition(2130, 1168, 282, 283),
  
  // Image 15 - IMG_20250114_093607.jpg
  image15: createResponsiveImagePosition(2442, 1168, 282, 282)
};

/**
 * Responsive positioning for the loading title
 */
export const responsiveLoadingTitle = responsivePosition(314, 503, 530, 171);
