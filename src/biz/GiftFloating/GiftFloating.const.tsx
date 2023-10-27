import { Easing, Platform } from 'react-native';

export const gScaleFactor = 36 / 44;

export const gGiftFloatingListHeight = 84;
export const gGiftFloatingListWidth = 227;
export const gItemHeight = 44;
export const gItemBorderRadius = 22;
export const gItemSmallHeight = gItemHeight * gScaleFactor;
export const gItemSmallWidth = gGiftFloatingListWidth * gScaleFactor;
export const gItemInterval = 4 * gScaleFactor;

export const gAnimateDuration = 300;
export const gAnimateType = Easing.linear;
export const gTimeoutTask = 3000;
export const gScrollingTimeout =
  Platform.OS === 'ios' ? gAnimateDuration * 0.5 : gAnimateDuration * 0.8; // !!! system tuning.
