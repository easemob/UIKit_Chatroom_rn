import * as React from 'react';
import {
  ListRenderItemInfo,
  Platform,
  StatusBar,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FlatListFactory, FlatListRef } from '../../ui/FlatList';
import { gBottomSheetHeaderHeight } from '../const';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import type { PropsWithError, PropsWithTest } from '../types';
import { MemberContextMenuWrapper } from './MemberContextMenu';
import { gAspectRatio, gTabHeaderHeight } from './MemberList.const';
import { useMemberListAPI, usePanHandlers } from './MemberList.hooks';
import { MemberListItemMemo, MemberListItemProps } from './MemberList.item';
import { SearchStyle } from './SearchStyle';
import type { MemberListType } from './types';

const FlatList = FlatListFactory<MemberListItemProps>();

export type MemberListProps = {
  requestUseScrollGesture?: (finished: boolean) => void;
  memberType: MemberListType;
  onSearch?: (memberType: MemberListType) => void;
  onNoMoreMember?: () => void;
  MemberItemComponent?: React.ComponentType<MemberListItemProps>;
} & PropsWithTest &
  PropsWithError;

export function MemberList(props: MemberListProps) {
  const {
    requestUseScrollGesture,
    testMode,
    onError,
    memberType,
    onSearch,
    onNoMoreMember,
    MemberItemComponent,
  } = props;

  const {
    data,
    pageState,
    onRefresh,
    refreshing,
    onEndReached,
    onViewableItemsChanged,
    viewabilityConfigRef,
    muteMember,
    removeMember,
    requestRefresh,
  } = useMemberListAPI({
    testMode,
    onError,
    memberType,
    onNoMoreMember,
  });
  const ref = React.useRef<FlatListRef<MemberListItemProps>>({} as any);
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

  const _MemberItemComponent = MemberItemComponent ?? MemberListItemMemo;

  return (
    <>
      <View
        style={{
          height: height,
        }}
        {...panHandlers}
      >
        <SearchStyle
          onPress={() => {
            // modalRef.current?.startShow();
            onSearch?.(memberType);
          }}
        />
        <FlatList
          ref={ref}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          data={data}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={(info: ListRenderItemInfo<MemberListItemProps>) => {
            const { item } = info;
            return <_MemberItemComponent {...item} />;
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
          onEndReached={onEndReached}
          viewabilityConfig={viewabilityConfigRef.current}
          onViewableItemsChanged={onViewableItemsChanged}
          ListEmptyComponent={EmptyPlaceholder}
          ListErrorComponent={
            pageState === 'error' ? (
              <ErrorPlaceholder onClicked={requestRefresh} />
            ) : null
          }
          ListLoadingComponent={
            pageState === 'loading' ? LoadingPlaceholder : null
          }
        />
      </View>
      <MemberContextMenuWrapper
        {...props}
        removeMember={removeMember}
        muteMember={muteMember}
      />
    </>
  );
}
