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
import type {
  BottomSheetNameMenuRef,
  InitMenuItemsType,
} from '../BottomSheetMenu';
import { gBottomSheetHeaderHeight } from '../const';
import {
  EmptyPlaceholder,
  ErrorPlaceholder,
  LoadingPlaceholder,
} from '../Placeholder';
import type { PropsWithError, PropsWithTest } from '../types';
import { MemberContextMenu } from './MemberContextMenu';
import { gAspectRatio, gTabHeaderHeight } from './MemberList.const';
import { useMemberListAPI, usePanHandlers } from './MemberList.hooks';
import { MemberListItemMemo, MemberListItemProps } from './MemberList.item';
import { SearchStyle } from './SearchStyle';
import type { MemberListType } from './types';

const FlatList = FlatListFactory<MemberListItemProps>();

/**
 * Referencing value of the `MemberList` component.
 */
export type MemberListRef = {
  /**
   * Add custom menu item list.
   * @param memberMenuItems member menu item list.
   */
  initMenu: (memberMenuItems?: InitMenuItemsType[]) => void;
  /**
   * Remove member.
   * @param memberId the member id.
   */
  removeMember: (memberId: string) => void;
  /**
   * Mute member.
   * @param memberId the member id.
   * @param isMuted whether to mute.
   */
  muteMember: (memberId: string, isMuted: boolean) => void;

  /**
   * Close the menu.
   */
  closeMenu: () => void;
};

/**
 * Properties of the `MemberList` component.
 */
export type MemberListProps = {
  propsRef?: React.RefObject<MemberListRef>;
  /**
   * Callback function when the gesture is used.
   * When used together with `Modal` or `SimuModal`, the pull-down gesture conflicts with the scrolling gift list gesture and cannot be resolved using bubbling events. Resolved by manually controlling usage rights.
   */
  requestUseScrollGesture?: (finished: boolean) => void;
  /**
   * List type. {@link MemberListType}
   */
  memberType: MemberListType;
  /**
   * Callback function when search button is clicked.
   */
  onSearch?: (memberType: MemberListType) => void;
  /**
   * Callback function when there is no more member.
   */
  onNoMoreMember?: () => void;
  /**
   * Custom component for each item in the list. Built-in components are used by default.
   */
  MemberItemComponent?: React.ComponentType<MemberListItemProps>;
} & PropsWithTest &
  PropsWithError;

/**
 * Member List Component.
 *
 * @param props {@link MemberListProps}
 * @returns JSX.Element
 */
export function MemberList(props: MemberListProps) {
  const {
    requestUseScrollGesture,
    testMode,
    onError,
    memberType,
    onSearch,
    onNoMoreMember,
    MemberItemComponent,
    propsRef,
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
    onScrollBeginDrag,
    onScrollEndDrag,
  } = useMemberListAPI({
    testMode,
    onError,
    memberType,
    onNoMoreMember,
  });
  const ref = React.useRef<FlatListRef<MemberListItemProps>>({} as any);
  const memberMenuItemsRef = React.useRef<InitMenuItemsType[]>([]);
  let menuRef = React.useRef<BottomSheetNameMenuRef>({} as any);
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

  if (propsRef?.current) {
    propsRef.current.initMenu = (memberMenuItems?: InitMenuItemsType[]) => {
      memberMenuItemsRef.current = memberMenuItems ?? [];
    };
    propsRef.current.removeMember = (memberId: string) => {
      removeMember(memberId);
    };
    propsRef.current.muteMember = (memberId: string, isMuted: boolean) => {
      muteMember(memberId, isMuted);
    };
    propsRef.current.closeMenu = () => {
      menuRef.current?.startHide?.();
    };
  }

  const onGetMenuItems = () => {
    return memberMenuItemsRef.current;
  };

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
          onScrollBeginDrag={onScrollBeginDrag}
          onScrollEndDrag={onScrollEndDrag}
        />
      </View>
      <MemberContextMenu
        {...props}
        removeMember={removeMember}
        muteMember={muteMember}
        onGetMenuItems={onGetMenuItems}
        onGetMenuRef={(m) => {
          menuRef = m;
        }}
      />
    </>
  );
}
