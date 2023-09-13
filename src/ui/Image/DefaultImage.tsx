import * as React from 'react';
import type { ImageSourcePropType } from 'react-native';

import { Image, ImageProps } from './Image';

export type DefaultImageProps = ImageProps & {
  defaultSource: ImageSourcePropType;
};

/**
 * Consider using this component only when loading network images.
 * @param props
 * @returns
 */
export function DefaultImage(props: DefaultImageProps) {
  const { style, defaultSource, ...others } = props;
  return (
    <React.Fragment>
      <Image style={style} source={defaultSource} />
      <Image style={[style, { position: 'absolute' }]} {...others} />
    </React.Fragment>
  );
}
