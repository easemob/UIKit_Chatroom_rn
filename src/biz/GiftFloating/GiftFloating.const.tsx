import { Platform } from 'react-native';
import { Easing } from 'react-native';

export const gListHeight = 84;
export const gItemHeight = 44;
export const gItemWidth = 277;
export const gItemSmallHeight = 36;
export const gItemSmallWidth = 157;
export const gItemInterval = 4;
export const gListWidth = 227;
export const gAnimateDuration = 300;
export const gAnimateType = Easing.sin;
export const gTimeoutTask = 3000;
export const gScrollingTimeout =
  Platform.OS === 'ios' ? gAnimateDuration * 0.1 : gAnimateDuration * 0.5;
