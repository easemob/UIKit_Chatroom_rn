import { Platform } from 'react-native';
import { Easing } from 'react-native';

export const gScaleFactor = 36 / 44;

export const gListHeight = 84;
export const gItemHeight = 44;
export const gItemWidth = 227;
export const gItemBorderRadius = 22;
export const gItemSmallHeight = 36;
export const gItemSmallWidth = 227 * gScaleFactor;
export const gItemInterval = 4;
export const gListWidth = 227;
export const gAnimateDuration = 300;
export const gAnimateType = Easing.linear;
export const gTimeoutTask = 3000;
export const gScrollingTimeout =
  Platform.OS === 'ios' ? gAnimateDuration * 0.5 : gAnimateDuration * 0.5;
