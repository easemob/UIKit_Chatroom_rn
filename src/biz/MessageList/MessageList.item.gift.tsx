import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import type { GiftContent, MessageListItemProps } from './types';

export function MessageListGiftItem(props: MessageListItemProps) {
  const { content } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
  });
  const c = content as GiftContent;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text
        textType={'medium'}
        paletteType={'body'}
        style={{ color: getColor('text') }}
      >
        {c.text}
      </Text>
      <Icon name={'link'} style={{ height: 18, width: 18 }} />
    </View>
  );
}
