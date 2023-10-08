import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  PanResponder,
  Platform,
  StatusBar,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SimulativeModalRef } from '../../ui/Modal';
import {
  gAspectRatio,
  gBottomSheetHeaderHeight,
  gTabHeaderHeight,
} from './MemberList.const';
import { MemberListItemMemo, MemberListItemProps } from './MemberList.item';
import { SearchStyle } from './SearchStyle';

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
  let height =
    winWidth / gAspectRatio -
    gBottomSheetHeaderHeight -
    gTabHeaderHeight -
    bottom -
    (StatusBar.currentHeight ?? 0);

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

  const ref = React.useRef<FlatList<MemberListItemProps>>({} as any);

  return (
    <View
      style={{
        height: height,
      }}
      {...r.panHandlers}
    >
      <SearchStyle
        onPress={() => {
          // todo:
        }}
      />
      <FlatList
        ref={ref}
        data={data}
        renderItem={(info: ListRenderItemInfo<MemberListItemProps>) => {
          const { item } = info;
          return <MemberListItemMemo id={item.id} />;
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
