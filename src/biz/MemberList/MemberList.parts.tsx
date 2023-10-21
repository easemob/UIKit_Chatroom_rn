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

import { useDispatchListener } from '../../dispatch';
// import {
//   Modal,
//   ModalRef,
//   // SimulativeModal,
//   // SimulativeModalRef,
// } from '../../ui/Modal';
import type { PropsWithError, PropsWithTest } from '../types';
import {
  MemberContextMenu,
  MemberContextMenuRef,
  useGetItems,
} from './MemberContextMenu';
import {
  gAspectRatio,
  gBottomSheetHeaderHeight,
  gTabHeaderHeight,
} from './MemberList.const';
import { useMemberListAPI, usePanHandlers } from './MemberList.hooks';
import { MemberListItemMemo, MemberListItemProps } from './MemberList.item';
// import { SearchMember } from './SearchMember';
import { SearchStyle } from './SearchStyle';
import type { MemberListType } from './types';

export type MemberListParticipantsProps = {
  requestUseScrollGesture?: (finished: boolean) => void;
  memberType: MemberListType;
  onSearch?: (memberType: MemberListType) => void;
} & PropsWithTest &
  PropsWithError;

export function MemberListParticipants(props: MemberListParticipantsProps) {
  const { requestUseScrollGesture, testMode, onError, memberType, onSearch } =
    props;
  const {
    data,
    onRefresh,
    refreshing,
    onEndReached,
    onViewableItemsChanged,
    viewabilityConfigRef,
    muteMember,
    removeMember,
  } = useMemberListAPI({
    testMode,
    onError,
    memberType,
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
  // const modalRef = React.useRef<ModalRef>({} as any);

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
          data={data}
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
        />
      </View>
      <MemberContextMenuFC
        {...props}
        removeMember={removeMember}
        muteMember={muteMember}
      />
      {/* <Modal
        propsRef={modalRef}
        onRequestModalClose={() => {
          modalRef.current?.startHide();
        }}
        modalAnimationType={'slide'}
        // maskStyle={{ transform: [{ translateY: 100 }] }}
      >
        <View
          style={{
            // height: winHeight,
            // width: winWidth,
            height: '100%',
            width: '100%',
          }}
        >
          <SearchMember
            memberType={memberType}
            onRequestClose={() => {
              modalRef.current?.startHide();
            }}
            data={memberType === 'member' ? data : muter}
          />
        </View>
      </Modal> */}
    </>
  );
}

const MemberContextMenuFC = (
  props: PropsWithTest &
    PropsWithError & {
      memberType: MemberListType;
      muteMember: (memberId: string, isMuted: boolean) => void;
      removeMember: (memberId: string) => void;
    }
) => {
  const { muteMember, removeMember } = props;
  const menuRef = React.useRef<MemberContextMenuRef>({} as any);
  const { getItems } = useGetItems();
  useDispatchListener(
    `_$useMemberListAPI_memberListContextMenu`,
    (
      _memberType: MemberListType, // current mute list
      isOwner: boolean, // current user role
      userId: string // current member id
      // isMuted: boolean // current member mute state
    ) => {
      if (isOwner === true) {
        menuRef.current?.startShowWithInit(
          getItems({
            list: ['Mute', 'Remove'],
            onClicked: (type) => {
              if (type === 'Mute') {
                muteMember(userId, true);
              } else if (type === 'Unmute') {
                muteMember(userId, false);
              } else if (type === 'Remove') {
                removeMember(userId);
              }
            },
            onRequestModalClose: () => {
              menuRef?.current?.startHide?.();
            },
          })
        );
      }
    }
  );
  return (
    <MemberContextMenu
      ref={menuRef}
      list={[]}
      onRequestModalClose={() => {
        menuRef?.current?.startHide?.();
      }}
    />
  );
};
