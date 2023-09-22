import * as React from 'react';
import { Platform } from 'react-native';
import { Animated } from 'react-native';

import type { Gift } from '../../im';
import {
  gAnimateDuration,
  gAnimateType,
  gItemSmallHeight,
  gItemSmallWidth,
} from './GiftFloating.const';

export type GiftFloatingItem = {
  id: string;
  height: number;
  width: number;
  isUseAnimation: boolean;
  idState: '1-0' | '1-1' | '2-1' | '2-2' | '2-3' | '3-2' | '3-3';
  gift: Gift;
};

export type useAnimationProps = {
  item: GiftFloatingItem;
  iHeight: Animated.Value;
  iWidth: Animated.Value;
  ix: Animated.Value;
};

export function useAnimation(props: useAnimationProps) {
  const { item, iHeight, iWidth, ix } = props;
  React.useEffect(() => {
    if (item.isUseAnimation === true) {
      if (item.idState === '1-0') {
        if (Platform.OS === 'ios') {
          ix.setValue(84);
          Animated.timing(ix, {
            toValue: 40,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }).start();
        }
      } else if (item.idState === '1-1') {
        ix.setValue(40);
        Animated.timing(ix, {
          toValue: 0,
          useNativeDriver: false,
          duration: gAnimateDuration,
          easing: gAnimateType,
        }).start();
      } else if (item.idState === '2-1' || item.idState === '2-3') {
        ix.setValue(40);
        Animated.parallel([
          Animated.timing(ix, {
            toValue: 0,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(iHeight, {
            toValue: gItemSmallHeight,
            useNativeDriver: false,
            duration: gAnimateDuration * (1 / 6),
            delay: gAnimateDuration * (5 / 6),
            easing: gAnimateType,
          }),
          Animated.timing(iWidth, {
            toValue: gItemSmallWidth,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
        ]).start();
      } else if (item.idState === '2-2') {
        Animated.parallel([
          Animated.timing(iHeight, {
            toValue: gItemSmallHeight,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(iWidth, {
            toValue: gItemSmallWidth,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
        ]).start();
      } else if (item.idState === '3-2') {
      } else if (item.idState === '3-3') {
        ix.setValue(40);
        Animated.timing(ix, {
          toValue: 0,
          useNativeDriver: false,
          duration: gAnimateDuration,
          easing: gAnimateType,
        }).start();
      }
    } else {
      if (item.idState === '1-0') {
      } else if (item.idState === '1-1') {
      } else if (item.idState === '2-1') {
        iHeight.setValue(gItemSmallHeight);
        iWidth.setValue(gItemSmallWidth);
      } else if (item.idState === '2-2') {
        iHeight.setValue(gItemSmallHeight);
        iWidth.setValue(gItemSmallWidth);
      } else if (item.idState === '2-3') {
        iHeight.setValue(gItemSmallHeight);
        iWidth.setValue(gItemSmallWidth);
      } else if (item.idState === '3-2') {
      } else if (item.idState === '3-3') {
      }
    }

    return () => {
      console.log('test:AnimatedFlatListItem:end:');
      iHeight.stopAnimation();
      ix.stopAnimation();
    };
  }, [iHeight, iWidth, item.idState, item.isUseAnimation, ix]);
}
