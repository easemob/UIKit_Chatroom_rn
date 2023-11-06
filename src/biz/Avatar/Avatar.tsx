import * as React from 'react';

import { ICON_ASSETS } from '../../assets';
import { DefaultIconImage, DefaultIconImageProps } from '../../ui/Image';

export type AvatarProps = Omit<DefaultIconImageProps, 'localIcon'>;

/**
 * Avatar component. If the url is incorrect, does not exist, or a network error occurs
 *
 * @param props {@link DefaultIconImageProps}
 * @returns JSX.Element
 */
export function Avatar(props: AvatarProps) {
  return (
    <DefaultIconImage
      localIcon={ICON_ASSETS.person_single_outline('3x')}
      {...props}
    />
  );
}
