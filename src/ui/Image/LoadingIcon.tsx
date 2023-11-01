import * as React from 'react';
import { Animated, Easing } from 'react-native';

import { ICON_ASSETS, IconNameType } from '../../assets';
import type { ImageProps } from './Image';
import { ClassImage } from './Image.class';

export type LoadingIconResolutionType = '' | '2x' | '3x';
export type LoadingIconProps = Omit<ImageProps, 'source' | 'failedSource'> & {
  name: IconNameType;
  resolution?: LoadingIconResolutionType;
};

const AnimatedImage = Animated.createAnimatedComponent(ClassImage);

export function LoadingIcon(props: LoadingIconProps) {
  const { name, resolution, style, ...others } = props;
  const s = ICON_ASSETS[name](resolution ?? '3x');
  const deg = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.loop(
      Animated.timing(deg, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.inOut(Easing.linear),
      })
    ).start();
  }, [deg]);
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
