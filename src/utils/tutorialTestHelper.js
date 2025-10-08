/**
 * Tutorial Test Helper - For testing and debugging tutorial functionality
 */

import { resetTutorialState, hasSeenMenuTutorial, hasSeenPicturesTutorial } from './tutorialManager';

/**
 * Reset tutorial state for testing
 */
export const resetTutorialForTesting = () => {
  resetTutorialState();
  localStorage.removeItem('exposition_exploders_pictures_tutorial_shown');
  console.log('All tutorial states reset. Next menu open and pictures view will show tutorials.');
};

/**
 * Check current tutorial state
 */
export const checkTutorialState = () => {
  const menuSeen = hasSeenMenuTutorial();
  const picturesSeen = hasSeenPicturesTutorial();
  console.log(`Menu tutorial seen: ${menuSeen}`);
  console.log(`Pictures tutorial seen: ${picturesSeen}`);
  return { menuSeen, picturesSeen };
};

/**
 * Make tutorial functions available globally for testing
 */
if (typeof window !== 'undefined') {
  window.tutorialTestHelper = {
    resetTutorialForTesting,
    checkTutorialState
  };
}
