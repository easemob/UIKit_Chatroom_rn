import * as React from 'react';
import {
  PanResponder,
  Platform,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { gAspectRatio } from './GiftList.const';
import { GiftListItem } from './GiftList.item';
import type { GiftData } from './types';

export type GiftListProps = {
  gifts: GiftData[];
  onSend?: (giftId: string) => void;
  requestUseScrollGesture?: (finished: boolean) => void;
};

export function GiftList(props: GiftListProps) {
  const { gifts, onSend, requestUseScrollGesture } = props;
  const { width: winWidth } = useWindowDimensions();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const [unitWidth, setUnitWidth] = React.useState(80);
  const [selected, setSelected] = React.useState<string | undefined>(undefined);
  const isScrollingRef = React.useRef(false);

  const r = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (isScrollingRef.current === false) {
          isScrollingRef.current = true;
          requestUseScrollGesture?.(false);
        }
        if (isScrollingRef.current === true) {
          return false;
        }
        return true;
      },
      onMoveShouldSetPanResponder: () => {
        if (isScrollingRef.current === false) {
          isScrollingRef.current = true;
          requestUseScrollGesture?.(false);
        }
        if (isScrollingRef.current === true) {
          return false;
        }
        return true;
      },
    })
  ).current;

  return (
    <View
      style={{
        height: gAspectRatio * winWidth,
        backgroundColor: getColor('backgroundColor'),
      }}
      onLayout={(e) => {
        const s = e.nativeEvent.layout.width / 4;
        setUnitWidth(Math.floor(s));
      }}
      {...r.panHandlers}
    >
      <ScrollView
        onMomentumScrollEnd={() => {
          if (Platform.OS !== 'ios') {
            isScrollingRef.current = false;
            requestUseScrollGesture?.(true);
          }
        }}
        onResponderEnd={() => {
          if (Platform.OS === 'ios') {
            isScrollingRef.current = false;
            requestUseScrollGesture?.(true);
          }
        }}
      >
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
