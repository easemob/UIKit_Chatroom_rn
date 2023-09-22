import * as React from 'react';
import { Platform } from 'react-native';
import { Animated } from 'react-native';

import type { Gift } from '../../im';
import {
  gAnimateDuration,
  gAnimateType,
  gItemBorderRadius,
  gItemSmallHeight,
  gItemSmallWidth,
  gScaleFactor,
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
  sf: Animated.Value;
  ibr: Animated.Value;
  itx: Animated.Value;
};

export function useAnimation(props: useAnimationProps) {
  const { item, iHeight, iWidth, ix, sf, ibr, itx } = props;
  React.useEffect(() => {
    const getItx = () => -(item.width - item.width * gScaleFactor) / 2 - 4;
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
          Animated.timing(sf, {
            toValue: gScaleFactor,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(ibr, {
            toValue: gItemBorderRadius * gScaleFactor,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(itx, {
            toValue: getItx(),
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
          Animated.timing(sf, {
            toValue: gScaleFactor,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(ibr, {
            toValue: gItemBorderRadius * gScaleFactor,
            useNativeDriver: false,
            duration: gAnimateDuration,
            easing: gAnimateType,
          }),
          Animated.timing(itx, {
            toValue: getItx(),
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
      } else if (
        item.idState === '2-1' ||
        item.idState === '2-2' ||
        item.idState === '2-3'
      ) {
        iHeight.setValue(gItemSmallHeight);
        iWidth.setValue(gItemSmallWidth);
        sf.setValue(gScaleFactor);
        ibr.setValue(gItemBorderRadius * gScaleFactor);
        itx.setValue(getItx());
      } else if (item.idState === '3-2') {
      } else if (item.idState === '3-3') {
      }
    }

    return () => {
      console.log('test:AnimatedFlatListItem:end:');
      iHeight.stopAnimation();
      ix.stopAnimation();
    };
  }, [
    iHeight,
    iWidth,
    ibr,
    item.idState,
    item.isUseAnimation,
    item.width,
    itx,
    ix,
    sf,
  ]);
}
