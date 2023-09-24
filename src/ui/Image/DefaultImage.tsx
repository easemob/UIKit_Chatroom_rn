import * as React from 'react';
import type { ImageSourcePropType, ImageURISource } from 'react-native';

import { Image, ImageProps } from './Image';

export type DefaultImageProps = Omit<ImageProps, 'source'> & {
  defaultSource: ImageSourcePropType;
  source: ImageURISource;
};

/**
 * Consider using this component only when loading network images.
 * @param props
 * @returns
 */
export function DefaultImage(props: DefaultImageProps) {
  const { style, defaultSource, onLoad, source, ...others } = props;
  const [visible, setVisible] = React.useState(true);
  return (
    <React.Fragment>
      <Image
        style={[
          style,
          {
            // display: visible ? 'flex' : 'none',
            opacity: visible === true ? 1 : 0,
          },
        ]}
        source={defaultSource}
      />
      <Image
        style={[style, { position: 'absolute' }]}
        onLoad={(e) => {
          onLoad?.(e);
          setVisible(false);
        }}
        source={{ ...source, cache: source.cache ?? 'only-if-cached' }}
        {...others}
      />
    </React.Fragment>
  );
}
