import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  PanResponder,
  Platform,
  Pressable,
  StatusBar,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePaletteContext, useThemeContext } from '../../theme';
import { Icon } from '../../ui/Image';
import type { SimulativeModalRef } from '../../ui/Modal';
import { Text } from '../../ui/Text';
import {
  gAspectRatio,
  gBottomSheetHeaderHeight,
  gTabHeaderHeight,
} from './MemberList.const';
import { MemberListItem, MemberListItemProps } from './MemberList.item';

export type MemberListParticipantsRef = SimulativeModalRef & {};

export type MemberListParticipantsProps = {
  requestUseScrollGesture?: (finished: boolean) => void;
};

export function MemberListParticipants(props: MemberListParticipantsProps) {
  const { requestUseScrollGesture } = props;
  const dataRef = React.useRef<MemberListItemProps[]>([
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
  ]);
  const [data] = React.useState<MemberListItemProps[]>(dataRef.current);
  const isScrollingRef = React.useRef(false);
  const { width: winWidth } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  let height =
    winWidth / gAspectRatio -
    gBottomSheetHeaderHeight -
    gTabHeaderHeight -
    bottom -
    (StatusBar.currentHeight ?? 0);

  const r = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        console.log('test:zuoyu:request:1:', isScrollingRef.current);
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
        console.log('test:zuoyu:request:11:', isScrollingRef.current);
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

  const ref = React.useRef<FlatList<MemberListItemProps>>({} as any);

  return (
    <View
      style={{
        height: height,
      }}
      {...r.panHandlers}
    >
      <View
        style={{
          justifyContent: 'center',
          paddingHorizontal: 16,
          paddingVertical: 4,
        }}
      >
        <Pressable
          onPress={() => {
            // todo:
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              borderRadius: 18,
              height: 36,
              paddingVertical: 7,
              width: '100%',
              backgroundColor:
                style === 'light' ? colors.neutral[95] : colors.neutral[2],
              justifyContent: 'center',
            }}
          >
            <Icon
              name={'magnifier'}
              style={{
                width: 22,
                height: 22,
                tintColor:
                  style === 'light' ? colors.neutral[6] : colors.neutral[4],
              }}
            />
            <View style={{ width: 4 }} />
            <Text
              textType={'large'}
              paletteType={'body'}
              style={{
                color:
                  style === 'light' ? colors.neutral[6] : colors.neutral[4],
              }}
            >
              {'Search'}
            </Text>
          </View>
        </Pressable>
      </View>
      <FlatList
        ref={ref}
        data={data}
        renderItem={(info: ListRenderItemInfo<MemberListItemProps>) => {
          const { item } = info;
          return <MemberListItem id={item.id} />;
        }}
        keyExtractor={(item: MemberListItemProps) => {
          return item.id;
        }}
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
      />
    </View>
  );
}
