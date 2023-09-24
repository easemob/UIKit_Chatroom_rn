import * as React from 'react';
import { ScrollView } from 'react-native';
import { useWindowDimensions, View } from 'react-native';

import { usePaletteContext, useThemeContext } from '../../theme';
import { gAspectRatio } from './GiftList.const';
import { GiftListItem } from './GiftList.item';
import type { GiftData } from './types';

export type GiftListProps = {
  gifts: GiftData[];
  onSend?: (giftId: string) => void;
};

export function GiftList(props: GiftListProps) {
  const { gifts, onSend } = props;
  const { width: winWidth } = useWindowDimensions();
  const { colors } = usePaletteContext();
  const { style } = useThemeContext();
  const [unitWidth, setUnitWidth] = React.useState(80);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);
  return (
    <View
      style={{
        height: gAspectRatio * winWidth,
        backgroundColor:
          style === 'light' ? colors.neutral[98] : colors.neutral[1],
      }}
      onLayout={(e) => {
        const s = e.nativeEvent.layout.width / 4;
        setUnitWidth(Math.floor(s));
      }}
    >
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            width: winWidth,
          }}
        >
          {gifts.map((gift, i) => {
            return (
              <View key={i}>
                <GiftListItem
                  gift={gift}
                  selected={selected === gift.giftId ? true : false}
                  width={unitWidth}
                  onSelected={(giftId) => {
                    setSelected(giftId);
                  }}
                  onSend={(giftId) => {
                    onSend?.(giftId);
                  }}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
