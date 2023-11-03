import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Text } from '../../ui/Text';
import { GiftIcon } from '../GiftIcon';
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
        numberOfLines={1}
      >
        {c.text}
      </Text>
      <GiftIcon url={c.gift} size={18} borderRadius={0} />
    </View>
  );
}
