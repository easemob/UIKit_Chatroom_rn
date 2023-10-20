import * as React from 'react';
import { PanResponder, ViewToken } from 'react-native';

import { useDispatchContext, useDispatchListener } from '../../dispatch';
import { ErrorCode, UIKitError } from '../../error';
import { useDelayExecTask } from '../../hook';
import { useIMContext, useIMListener } from '../../im';
import { wait } from '../../utils';
import type { PropsWithError, PropsWithTest } from '../types';
import { gMaxMuterSize, gMemberPerPageSize } from './MemberList.const';
import type { MemberListItemProps } from './MemberList.item';

export function usePanHandlers(params: {
  requestUseScrollGesture: ((finished: boolean) => void) | undefined;
}) {
  const { requestUseScrollGesture } = params;
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
  );
  return {
    panHandlers: r.current.panHandlers,
    isScrollingRef: isScrollingRef,
  };
}

type useMemberListAPIProps = PropsWithTest & PropsWithError;
export function useMemberListAPI(props: useMemberListAPIProps) {
  const { onError } = props;
  const im = useIMContext();
  console.log('test:useMemberListAPI:', im.userId === im.ownerId);

  const isOwner = im.userId === im.ownerId;
  const memberCursor = React.useRef('');

  const dataRef = React.useRef<MemberListItemProps[]>([]);
  // const dataRef = React.useRef(new Map<string, MemberListItemProps>());
  const [data, setData] = React.useState<MemberListItemProps[]>([]);

  const muterRef = React.useRef<MemberListItemProps[]>([]);
  const [muter, setMuter] = React.useState<MemberListItemProps[]>([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const { emit } = useDispatchContext();
  useDispatchListener(
    `_$${useMemberListAPI.name}_fetchMemberInfo`,
    (ids: string[]) => {
      _fetchMemberInfo(ids);
    }
  );

  const viewabilityConfigRef = React.useRef({
    // minimumViewTime: 1000,
    viewAreaCoveragePercentThreshold: 50,
    viewablePercentThreshold: 50,
    waitForInteraction: false,
  });
  // !!!  ERROR  Invariant Violation: Changing onViewableItemsChanged on the fly is not supported
  const { delayExecTask } = useDelayExecTask(
    500,
    React.useCallback(
      (info: {
        viewableItems: Array<ViewToken>;
        changed: Array<ViewToken>;
      }) => {
        const ids = info.viewableItems.map((v) => {
          return (v.item as MemberListItemProps).userInfo.userId;
        });
        emit(`_$${useMemberListAPI.name}_fetchMemberInfo`, ids);
      },
      [emit]
    )
  );
  // const requestUserInfoTimeout = React.useRef<NodeJS.Timeout | undefined>();

  // // !!!  ERROR  Invariant Violation: Changing onViewableItemsChanged on the fly is not supported
  // const onViewableItemsChanged = React.useCallback(
  //   (info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
  //     console.log(
  //       'test:onViewableItemsChanged:',
  //       info.viewableItems.map((v) => {
  //         console.log('test:zuoyu:10:', v.item);
  //       })
  //     );
  //     if (requestUserInfoTimeout.current) {
  //       clearTimeout(requestUserInfoTimeout.current);
  //     }
  //     requestUserInfoTimeout.current = setTimeout(() => {
  //       console.log('test:zuoyu:11:', info.viewableItems.length);
  //     }, 1000);
  //   },
  //   []
  // );

  useIMListener({
    onUserJoined: (roomId, user) => {
      if (im.roomId === roomId) {
        _refreshMembers(() => {
          const list10 = dataRef.current.slice(0, 9).map((v) => {
            return v.userInfo.userId;
          });
          _fetchMemberInfo(list10);
        });
        if (im.userId === user.userId) {
          // todo: request member list
          if (im.ownerId === im.userId) {
            // todo: request mute member list
            // setIsOwner(true);
            _fetchMuter(() => {
              if (muterRef.current.length > 0) {
                const list10 = muter.slice(0, 9).map((v) => {
                  return v.userInfo.userId;
                });
                _fetchMemberInfo(list10);
              }
            });
          } else {
            // setIsOwner(false);
          }
        } else {
          // todo: add member to cache
        }
      }
    },
  });

  const _refreshMembers = (onFinished?: () => void) => {
    if (im.roomState === 'joined') {
      dataRef.current = [];
      memberCursor.current = '';
      im.fetchMembers(im.roomId!, gMemberPerPageSize, memberCursor.current)
        .then((r) => {
          memberCursor.current = r.cursor;
          if (r.list) {
            for (const memberId of r.list) {
              const user = im.getUserInfo(memberId);
              dataRef.current.push({
                id: memberId,
                userInfo: { userId: memberId, ...user },
              });
            }
          }
          setData([...dataRef.current]);
          onFinished?.();
        })
        .catch((e) => {
          onFinished?.();
          onError?.(
            new UIKitError({
              code: ErrorCode.room_fetch_member_list_error,
              extra: e.toString(),
            })
          );
        });
    } else {
      onFinished?.();
    }
  };

  const _loadMoreMembers = () => {
    if (im.roomState === 'joined') {
      im.fetchMembers(im.roomId!, gMemberPerPageSize, memberCursor.current)
        .then((r) => {
          memberCursor.current = r.cursor;
          let isNeedUpdate = false;
          if (r.list) {
            const dup = dataRef.current.map((v) => v.userInfo.userId);

            for (const memberId of r.list) {
              const user = im.getUserInfo(memberId);
              // !!! Remove duplicates
              if (dup.includes(memberId)) {
                continue;
              }
              isNeedUpdate = true;
              dataRef.current.push({
                id: memberId,
                userInfo: { userId: memberId, ...user },
              });
            }
          }
          if (isNeedUpdate === true) {
            setData([...dataRef.current]);
          }
        })
        .catch((e) => {
          onError?.(
            new UIKitError({
              code: ErrorCode.room_fetch_member_list_error,
              extra: e.toString(),
            })
          );
        });
    }
  };

  const _fetchMemberInfo = (ids: string[]) => {
    if (im.roomState === 'joined') {
      im.fetchUserInfos(im.getNoExisted(ids))
        .then((list) => {
          for (const d of list) {
            const n = im.updateUserInfo(d);
            for (let index = 0; index < dataRef.current.length; index++) {
              const l = dataRef.current[index];
              if (l?.userInfo.userId === n.userId) {
                l.userInfo = n;
                break;
              }
            }
            for (let index = 0; index < muterRef.current.length; index++) {
              const l = muterRef.current[index];
              if (l?.userInfo.userId === n.userId) {
                l.userInfo = n;
                break;
              }
            }
          }
          if (list.length > 0) {
            setData([...dataRef.current]);
            if (isOwner === true) {
              setMuter([...muterRef.current]);
            }
          }
        })
        .catch((e) => {
          onError?.(
            new UIKitError({
              code: ErrorCode.room_fetch_member_info_error,
              extra: e.toString(),
            })
          );
        });
    }
  };

  const _fetchMuter = (onFinished?: () => void) => {
    if (im.roomState === 'joined') {
      im.fetchMutedMembers(im.roomId!, gMaxMuterSize)
        .then((r) => {
          if (r) {
            muterRef.current = [];
            for (const muterId of r) {
              const user = im.getUserInfo(muterId);
              muterRef.current.push({
                id: muterId,
                userInfo: { userId: muterId, ...user },
              });
            }
          }
          setMuter([...muterRef.current]);
          onFinished?.();
        })
        .catch((e) => {
          onFinished?.();
          onError?.(
            new UIKitError({
              code: ErrorCode.room_fetch_member_info_error,
              extra: e.toString(),
            })
          );
        });
    } else {
      onFinished?.();
    }
  };

  const _onRefresh = () => {
    setRefreshing(true);
    _refreshMembers(() => {
      wait(1000).then(() => {
        setRefreshing(false);
      });
    });
  };

  const _onEndReached = () => {
    _loadMoreMembers();
  };

  return {
    data: data,
    muter: muter,
    isOwner: isOwner,
    refreshing: refreshing,
    onRefresh: _onRefresh,
    onEndReached: _onEndReached,
    viewabilityConfigRef: viewabilityConfigRef,
    onViewableItemsChanged: delayExecTask,
  };
}
