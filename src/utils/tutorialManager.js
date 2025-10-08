/**
 * Tutorial Manager - Handles first-time user tutorial state
 */

const TUTORIAL_KEYS = {
  MENU_FIRST_OPEN: 'exposition_exploders_menu_tutorial_shown',
  PICTURES_FIRST_VIEW: 'exposition_exploders_pictures_tutorial_shown'
};

/**
 * Check if user has seen the menu tutorial
 */
export const hasSeenMenuTutorial = () => {
  return localStorage.getItem(TUTORIAL_KEYS.MENU_FIRST_OPEN) === 'true';
};

/**
 * Mark that user has seen the menu tutorial
 */
export const markMenuTutorialSeen = () => {
  localStorage.setItem(TUTORIAL_KEYS.MENU_FIRST_OPEN, 'true');
};

/**
 * Reset tutorial state (for testing)
 */
export const resetTutorialState = () => {
  localStorage.removeItem(TUTORIAL_KEYS.MENU_FIRST_OPEN);
};

/**
 * Check if we should show tutorial (first time opening menu on desktop)
 */
export const shouldShowTutorial = () => {
  // Only show on desktop (screen width > 1024px)
  const isDesktop = window.innerWidth > 1024;
  const isFirstTime = !hasSeenMenuTutorial();
  
  return isDesktop && isFirstTime;
};

/**
 * Check if user has seen the pictures tutorial
 */
export const hasSeenPicturesTutorial = () => {
  return localStorage.getItem(TUTORIAL_KEYS.PICTURES_FIRST_VIEW) === 'true';
};

/**
 * Mark that user has seen the pictures tutorial
 */
export const markPicturesTutorialSeen = () => {
  localStorage.setItem(TUTORIAL_KEYS.PICTURES_FIRST_VIEW, 'true');
};

/**
 * Check if we should show pictures tutorial (first time viewing pictures page)
 */
export const shouldShowPicturesTutorial = () => {
  const isFirstTime = !hasSeenPicturesTutorial();
  return isFirstTime;
};
