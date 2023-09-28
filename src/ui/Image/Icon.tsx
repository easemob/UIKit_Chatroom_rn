import * as React from 'react';

import { ICON_ASSETS, IconNameType } from '../../assets';
import { Image, type ImageProps } from './Image';

export type IconResolutionType = '' | '2x' | '3x';
export type IconProps = Omit<ImageProps, 'source' | 'failedSource'> & {
  name: IconNameType;
  resolution?: IconResolutionType;
};

export function Icon(props: IconProps) {
  const { name, resolution, style, ...others } = props;
  const s = ICON_ASSETS[name](resolution ?? '3x');
  return <Image source={s} style={[style]} {...others} />;
}
