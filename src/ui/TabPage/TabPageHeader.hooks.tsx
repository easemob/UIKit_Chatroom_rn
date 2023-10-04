import * as React from 'react';
import { Animated } from 'react-native';

export const calculateLeft = (params: {
  width: number;
  count: number;
  index: number;
  indicatorWidth: number;
}) => {
  const { width, count, index, indicatorWidth } = params;
  const unitWidth = width / count;
  return {
    left: unitWidth / 2 - indicatorWidth / 2 + unitWidth * index,
    unitWidth: unitWidth,
  };
};

/**
 *
 * **Note** On the Android platform, fast and complex operations may cause the indicator position to be incorrect.
 */
export const useTabPageHeaderAnimation = (params: {
  unitWidth: number;
  initLeft: number;
}) => {
  const { unitWidth, initLeft } = params;
  const left = React.useRef(new Animated.Value(initLeft)).current;

  const createAnimated = (type: 'r' | 'l', count?: number) => {
    //@ts-ignore
    const cur = left.__getValue();
    const c = count ?? 1;
    const config = { duration: 250, useNativeDriver: false };
    return Animated.timing(left, {
      toValue: type === 'r' ? cur + unitWidth * c : cur - unitWidth * c,
      ...config,
    }).start;
  };

  return {
    left,
    toNext: createAnimated,
  };
};

export const useTabPageHeaderAnimation2 = (params: {
  width: number;
  count: number;
  index?: number;
  indicatorWidth: number;
}) => {
  const { width, count, index = 0, indicatorWidth } = params;
  const { left: leftValue, unitWidth } = calculateLeft({
    width,
    count,
    index,
    indicatorWidth,
  });
  const left = React.useRef(new Animated.Value(leftValue)).current;

  const createAnimated = (params: {
    width: number;
    count: number;
    index: number;
    indicatorWidth: number;
  }) => {
    const { left: leftValue } = calculateLeft(params);
    const config = { duration: 250, useNativeDriver: false };
    return Animated.timing(left, {
      toValue: leftValue,
      ...config,
    }).start;
  };

  return {
    left,
    unitWidth,
    toNext: createAnimated,
  };
};
