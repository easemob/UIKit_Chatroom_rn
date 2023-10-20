import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StatusBar,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PropsWithError, PropsWithTest } from '../types';
import {
  gAspectRatio,
  gBottomSheetHeaderHeight,
  gTabHeaderHeight,
} from './MemberList.const';
import { useMemberListAPI, usePanHandlers } from './MemberList.hooks';
import { MemberListItemMemo, MemberListItemProps } from './MemberList.item';
import { SearchStyle } from './SearchStyle';

export type MemberListParticipantsProps = {
  requestUseScrollGesture?: (finished: boolean) => void;
  memberType: 'member' | 'muted';
} & PropsWithTest &
  PropsWithError;

export function MemberListParticipants(props: MemberListParticipantsProps) {
  const { requestUseScrollGesture, testMode, onError, memberType } = props;
  const {
    data,
    muter,
    onRefresh,
    refreshing,
    onEndReached,
    onViewableItemsChanged,
    viewabilityConfigRef,
  } = useMemberListAPI({
    testMode,
    onError,
  });
  const ref = React.useRef<FlatList<MemberListItemProps>>({} as any);
  const { width: winWidth } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  let height =
    winWidth / gAspectRatio -
    gBottomSheetHeaderHeight -
    gTabHeaderHeight -
    bottom -
    (StatusBar.currentHeight ?? 0);
  const { panHandlers, isScrollingRef } = usePanHandlers({
    requestUseScrollGesture,
  });

  return (
    <View
      style={{
        height: height,
      }}
      {...panHandlers}
    >
      <SearchStyle
        onPress={() => {
          // todo:
        }}
      />
      <FlatList
        ref={ref}
        data={memberType === 'member' ? data : muter}
        refreshing={refreshing}
        onRefresh={onRefresh}
        renderItem={(info: ListRenderItemInfo<MemberListItemProps>) => {
          const { item } = info;
          return <MemberListItemMemo {...item} />;
        }}
        keyExtractor={(item: MemberListItemProps) => {
          return item.id;
        }}
        onMomentumScrollEnd={() => {
          console.log('test:onMomentumScrollEnd:');
          if (Platform.OS !== 'ios') {
            isScrollingRef.current = false;
            requestUseScrollGesture?.(true);
          }
        }}
        onResponderEnd={() => {
          console.log('test:onResponderEnd:');
          if (Platform.OS === 'ios') {
            isScrollingRef.current = false;
            requestUseScrollGesture?.(true);
          }
        }}
        onEndReached={onEndReached}
        viewabilityConfig={viewabilityConfigRef.current}
        onViewableItemsChanged={onViewableItemsChanged}
      />
    </View>
  );
}
