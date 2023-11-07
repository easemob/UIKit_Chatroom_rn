import * as React from 'react';
import { Animated, Easing } from 'react-native';

import { ICON_ASSETS, IconNameType } from '../../assets';
import type { ImageProps } from './Image';
import { ClassImage } from './Image.class';

export type LoadingIconResolutionType = '' | '2x' | '3x';
export type LoadingIconProps = Omit<ImageProps, 'source' | 'failedSource'> & {
  name?: IconNameType;
  resolution?: LoadingIconResolutionType;
  isStop?: boolean;
};

const AnimatedImage = Animated.createAnimatedComponent(ClassImage);

export function LoadingIcon(props: LoadingIconProps) {
  const { name = 'loading', resolution, style, isStop, ...others } = props;
  const s = ICON_ASSETS[name](resolution ?? '3x');
  const deg = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const animate = Animated.loop(
      Animated.timing(deg, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
        easing: Easing.inOut(Easing.linear),
      })
    );
    if (isStop === true) {
      animate.stop();
    } else {
      // animate.reset();
      animate.start();
    }
  }, [deg, isStop]);
  return (
    <AnimatedImage
      source={s}
      style={[
        style,
        {
          transform: [
            {
              rotate: deg.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        },
      ]}
      {...others}
    />
  );
}
