import * as React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';

import { ICON_ASSETS } from '../../assets';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { DefaultImage, Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import {
  gItemButtonHeight,
  gItemGiftSize,
  gItemHeight,
  gItemWidth,
} from './GiftList.const';
import type { GiftListModel } from './types';

export type GiftListItemProps = {
  gift: GiftListModel;
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
  const { getColor } = useColors({
    t1: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    t2: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
  });
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
            color: getColor('t1'),
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
            color: getColor('t2'),
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
  const { colors, lineGradient } = usePaletteContext();
  const { start, end } = lineGradient.bottomToTop;
  const { getColor, getColors } = useColors({
    borderColor: {
      light: colors.primary[6],
      dark: colors.primary[5],
    },
    backgroundColor: {
      light: colors.primary[95],
      dark: colors.primary[2],
    },
    color: {
      light: colors.neutral[5],
      dark: colors.neutral[6],
    },
    backgroundColor2: {
      light: [colors.primary[5], 'hsla(233, 100%, 70%, 1)'],
      dark: [colors.primary[6], 'hsla(233, 100%, 70%, 1)'],
    },
    color2: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
  });
  return (
    <View
      style={{
        height: gItemHeight,
        width: gItemWidth,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: getColor('borderColor'),
        backgroundColor: getColor('backgroundColor'),
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
              color: getColor('color'),
            }}
          >
            {'SubTitle'}
          </Text>
        </View>
      </View>
      <LinearGradient
        colors={getColors('backgroundColor2') as (string | number)[]}
        start={start}
        end={end}
        style={{
          height: gItemButtonHeight,
          // backgroundColor: getColor('backgroundColor2'),
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
              color: getColor('color2'),
            }}
          >
            {'Send'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}
