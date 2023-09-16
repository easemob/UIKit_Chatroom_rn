import * as React from 'react';
import {
  Animated,
  PanResponder,
  PanResponderInstance,
  useWindowDimensions,
} from 'react-native';

import type { ModalAnimationType } from './types';

export const useModalAnimation = (type: ModalAnimationType) => {
  const { height } = useWindowDimensions();
  const initialY = type === 'slide' ? height : 0;
  const backgroundOpacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(initialY)).current;
  // translateY.setValue(initialY);

  const createAnimated = (toValue: 0 | 1) => {
    const config = { duration: 250, useNativeDriver: false };
    return Animated.parallel([
      Animated.timing(backgroundOpacity, { toValue, ...config }),
      Animated.timing(translateY, {
        toValue: toValue === 0 ? initialY : 0,
        ...config,
      }),
    ]).start;
  };

  return {
    translateY,
    backgroundOpacity,
    startShow: createAnimated(1),
    startHide: createAnimated(0),
  };
};

export const useModalPanResponder = (params: {
  type: ModalAnimationType;
  translateY: Animated.Value;
  startShow: (callback?: Animated.EndCallback | undefined) => void;
  onRequestModalClose: () => void;
}): PanResponderInstance => {
  const { type, translateY, onRequestModalClose, startShow } = params;
  const isHideGesture = React.useCallback(
    (distanceY: number, velocityY: number) => {
      return distanceY > 125 || (distanceY > 0 && velocityY > 0.1);
    },
    []
  );
  const r = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponderCapture: (_, { dy }) => {
        return dy > 8;
      },
      onPanResponderGrant: (_, __) => {
        // @ts-ignore
        translateY.setOffset(translateY.__getValue());
      },
      onPanResponderMove: (_, { dy }) => {
        return dy >= 0 && translateY.setValue(dy);
      },
      onPanResponderRelease: (_, { dy, vy }) => {
        if (isHideGesture(dy, vy)) onRequestModalClose();
        else startShow();
      },
    })
  ).current;
  if (type === 'slide') return r;
  else return { panHandlers: {} };
};
