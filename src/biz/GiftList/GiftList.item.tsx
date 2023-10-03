import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { ICON_ASSETS } from '../../assets';
import { usePaletteContext, useThemeContext } from '../../theme';
import { DefaultImage, Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import {
  gItemButtonHeight,
  gItemGiftSize,
  gItemHeight,
  gItemWidth,
} from './GiftList.const';
import type { GiftData } from './types';

export type GiftListItemProps = {
  gift: GiftData;
  selected: boolean;
  width?: number;
  onSelected?: (giftId: string) => void;
  onSend?: (giftId: string) => void;
};

export function GiftListItem(props: GiftListItemProps) {
  const { selected, width } = props;
  return (
    <View
      style={{
        width: width ?? gItemWidth,
        height: gItemHeight + 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {selected === true ? (
        <GiftListSelectedItem {...props} />
      ) : (
        <GiftListNoSelectedItem {...props} />
      )}
    </View>
  );
}

function GiftListNoSelectedItem(props: GiftListItemProps) {
  const { gift, onSelected } = props;
  const { colors } = usePaletteContext();
  const { style } = useThemeContext();
  return (
    <View
      style={{
        height: gItemHeight,
        width: gItemWidth,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onTouchEnd={() => {
        onSelected?.(gift.giftId);
      }}
    >
      <DefaultImage
        defaultSource={ICON_ASSETS.gift_color('3x')}
        source={{ uri: gift.giftIcon }}
        style={{ width: gItemGiftSize, height: gItemGiftSize }}
      />
      <View style={{ height: 4 }} />
      <View>
        <Text
          textType={'small'}
          paletteType={'title'}
          style={{
            color: style === 'light' ? colors.neutral[1] : colors.neutral[98],
          }}
        >
          {'Title'}
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Icon name={'agora_dollar'} style={{ width: 14, height: 14 }} />
        <Text
          textType={'extraSmall'}
          paletteType={'label'}
          style={{
            color: style === 'light' ? colors.neutral[5] : colors.neutral[6],
          }}
        >
          {'SubTitle'}
        </Text>
      </View>
    </View>
  );
}

function GiftListSelectedItem(props: GiftListItemProps) {
  const { gift, onSelected } = props;
  const { colors } = usePaletteContext();
  const { style } = useThemeContext();
  return (
    <View
      style={{
        height: gItemHeight,
        width: gItemWidth,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: style === 'light' ? colors.primary[6] : colors.primary[5],
        backgroundColor:
          style === 'light' ? colors.primary[95] : colors.primary[2],
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <DefaultImage
          defaultSource={ICON_ASSETS.gift_color('3x')}
          source={{ uri: gift.giftIcon }}
          style={{ width: gItemGiftSize, height: gItemGiftSize }}
        />
        <View style={{ flexDirection: 'row' }}>
          <Icon name={'agora_dollar'} style={{ width: 14, height: 14 }} />
          <Text
            textType={'extraSmall'}
            paletteType={'label'}
            style={{
              color: style === 'light' ? colors.neutral[5] : colors.neutral[6],
            }}
          >
            {'SubTitle'}
          </Text>
        </View>
      </View>
      <View
        style={{
          height: gItemButtonHeight,
          backgroundColor:
            style === 'light' ? colors.primary[5] : colors.primary[6],
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            onSelected?.(gift.giftId);
          }}
        >
          <Text
            textType={'medium'}
            paletteType={'label'}
            style={{
              color:
                style === 'light' ? colors.neutral[98] : colors.neutral[98],
            }}
          >
            {'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
