import * as React from 'react';

import { ICON_ASSETS, IconNameType } from '../../assets';
import { Image, type ImageProps } from './Image';

export type IconSizeType = '' | '2x' | '3x';
export type IconProps = Omit<ImageProps, 'source' | 'failedSource'> & {
  name: IconNameType;
  size?: IconSizeType;
};

export function Icon(props: IconProps) {
  const { name, size, style, ...others } = props;
  const s = ICON_ASSETS[name](size ?? '3x');
  return <Image source={s} style={[style]} {...others} />;
}
