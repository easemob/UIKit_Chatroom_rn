import * as React from 'react';

import { ICON_ASSETS } from '../../assets';
import { DefaultIconImage, DefaultIconImageProps } from '../../ui/Image';

export type AvatarProps = Omit<DefaultIconImageProps, 'localIcon'>;

export function Avatar(props: AvatarProps) {
  return (
    <DefaultIconImage
      localIcon={ICON_ASSETS.person_single_outline('3x')}
      {...props}
    />
  );
}
