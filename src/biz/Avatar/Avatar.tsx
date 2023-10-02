import * as React from 'react';
import type { ImageStyle, StyleProp } from 'react-native';

import { ICON_ASSETS } from '../../assets';
import { DefaultImage } from '../../ui/Image';

export type AvatarProps = {
  url: string;
  size: number;
  borderRadius: number;
  style?: StyleProp<ImageStyle>;
};

export function Avatar(props: AvatarProps) {
  const { url, size, borderRadius, style } = props;
  return (
    <DefaultImage
      defaultSource={ICON_ASSETS.person_single_outline('3x')}
      source={{ uri: url }}
      style={[
        {
          width: size,
          height: size,
          borderRadius: borderRadius,
        },
        style,
      ]}
    />
  );
}
