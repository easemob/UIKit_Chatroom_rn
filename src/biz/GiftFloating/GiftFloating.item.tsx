import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Animated, View } from 'react-native';

import { ICON_ASSETS } from '../../assets';
import { usePaletteContext } from '../../theme';
import { DefaultImage } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { gItemBorderRadius } from './GiftFloating.const';
import { GiftFloatingItem, useAnimation } from './GiftFloating.item.hooks';

export type GiftFloatingItemFCProps = {
  item: GiftFloatingItem;
};

export function GiftFloatingItemFC(props: GiftFloatingItemFCProps) {
  const { item } = props;
  // console.log('test:GiftFloatingItemFC:', item);

  const { colors } = usePaletteContext();

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
          backgroundColor: colors.barrage[1],
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
          <Avatar
            url={
              'https://cdn4.iconfinder.com/data/icons/animal-6/100/1-512.png'
            }
            size={36}
            borderRadius={36}
          />
        </View>

        <View style={{ paddingHorizontal: 4 }}>
          <Text
            textType={'small'}
            paletteType={'label'}
            style={{ color: 'white' }}
          >
            NickName
          </Text>
          <Text
            textType={'extraSmall'}
            paletteType={'label'}
            style={{ color: 'white' }}
          >
            sent @Agoraship
          </Text>
        </View>

        <View>
          <DefaultImage
            defaultSource={ICON_ASSETS.gift_color('3x')}
            source={{
              uri: 'https://cdn4.iconfinder.com/data/icons/animal-6/100/1-512.png',
            }}
            style={{ width: 40, height: 40 }}
          />
        </View>

        <View style={{ padding: 2 }}>
          <Text style={styles.dig}>x1</Text>
        </View>
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
