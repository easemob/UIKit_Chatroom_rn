import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { GiftIcon } from '../GiftIcon';
import { gItemBorderRadius, gItemMaxWidth } from './GiftFloating.const';
import { GiftFloatingItem, useAnimation } from './GiftFloating.item.hooks';

export type GiftFloatingItemFCProps = {
  item: GiftFloatingItem;
};

export function GiftFloatingItemFC(props: GiftFloatingItemFCProps) {
  const { item } = props;

  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.barrage[1],
      dark: colors.barrage[1],
    },
  });

  const iHeight = React.useRef(new Animated.Value(item.height)).current;
  const iWidth = React.useRef(new Animated.Value(item.width)).current;
  const ix = React.useRef(new Animated.Value(0)).current;
  const ibr = React.useRef(new Animated.Value(gItemBorderRadius)).current;

  const sf = React.useRef(new Animated.Value(1)).current;
  const tx = React.useRef(new Animated.Value(0)).current;

  useAnimation({ item, iHeight, iWidth, ix, sf, ibr, tx });

  return (
    <Animated.View
      style={[
        styles.item,
        {
          height: iHeight,
          width: iWidth,
          backgroundColor: getColor('bg'),
          transform: [
            {
              translateY: ix,
            },
          ],
          borderRadius: ibr,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.itemContent,
          {
            transform: [{ scale: sf }, { translateX: tx }],
            width: item.width,
          },
        ]}
      >
        <View>
          <Avatar url={item.gift.avatar} size={36} borderRadius={36} />
        </View>

        <View
          style={{ paddingHorizontal: 4, width: gItemMaxWidth, flexGrow: 1 }}
        >
          <Text
            textType={'small'}
            paletteType={'label'}
            numberOfLines={1}
            style={{ color: 'white' }}
          >
            {item.gift.nickName}
          </Text>
          <Text
            textType={'extraSmall'}
            paletteType={'label'}
            style={{ color: 'white' }}
          >
            {item.gift.content}
          </Text>
        </View>

        <GiftIcon url={item.gift.giftIcon} borderRadius={0} size={40} />

        <View style={{ padding: 2, paddingHorizontal: 6 }}>
          <Text style={styles.dig}>x{item.gift.giftCount ?? 1}</Text>
        </View>
        <View style={{ width: 10 }} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  dig: {
    color: 'white',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 24,
    fontStyle: 'italic',
  },
});
