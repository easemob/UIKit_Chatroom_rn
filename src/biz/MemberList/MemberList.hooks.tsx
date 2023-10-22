import * as React from 'react';
import { PanResponder, ViewToken } from 'react-native';
import type { ChatMessage } from 'react-native-chat-sdk';

import { useDispatchContext, useDispatchListener } from '../../dispatch';
import { ErrorCode, UIKitError } from '../../error';
import { useDelayExecTask } from '../../hook';
import {
  IMServiceListener,
  useIMContext,
  useIMListener,
  UserServiceData,
} from '../../im';
import { wait } from '../../utils';
import type { PropsWithError, PropsWithTest } from '../types';
import {
  gMaxMuterSize,
  gMemberPerPageSize,
  gSearchTimeout,
} from './MemberList.const';
import type { MemberListItemProps } from './MemberList.item';
import type { MemberListType } from './types';

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

export function useIsOwner() {
  const im = useIMContext();
  const isOwner = () => im.userId === im.ownerId;
  return {
    isOwner: isOwner,
  };
}

export function useRoomState() {
  const im = useIMContext();
  return {
    roomState: im.roomState,
  };
}

type useMemberListAPIProps = PropsWithTest & PropsWithError;
export function useMemberListAPI(
  props: useMemberListAPIProps & {
    memberType: MemberListType;
    onNoMoreMember?: () => void;
  }
) {
  const { memberType, onNoMoreMember } = props;
  const im = useIMContext();
  console.log('test:useMemberListAPI:', im.userId === im.ownerId, memberType);

  const { isOwner } = useIsOwner();
  const memberCursor = React.useRef('');

  const dataRef = React.useRef<MemberListItemProps[]>([]);
  // const dataRef = React.useRef(new Map<string, MemberListItemProps>());
  const [data, setData] = React.useState<MemberListItemProps[]>([]);

  const muterRef = React.useRef<string[]>([]);

  const [refreshing, setRefreshing] = React.useState(false);

  const { emit } = useDispatchContext();
  useDispatchListener(
    `_$${useMemberListAPI.name}_${memberType}_fetchMemberInfo`,
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
        emit(`_$${useMemberListAPI.name}_${memberType}_fetchMemberInfo`, ids);
      },
      [emit, memberType]
    )
  );

  const _addData = (userId?: string) => {
    if (userId === undefined) {
      return false;
    }
    if (dataRef.current.map((v) => v.userInfo.userId).includes(userId)) {
      return false;
    }
    const user = im.getUserInfo(userId);
    dataRef.current.push({
      id: userId,
      userInfo: { userId: userId, ...user },
      actions: {
        onClicked: () => {
          const isMuted = _isMuter(userId);
          emit(
            `_$${useMemberListAPI.name}_memberListContextMenu`,
            memberType, // current mute list
            isOwner(), // current user role
            userId, // current member id
            isMuted // current member mute state
          );
        },
      },
    });
    return true;
  };

  const _updateData = (userInfo?: UserServiceData) => {
    if (userInfo === undefined) {
      return false;
    }
    for (const data of dataRef.current) {
      if (data.userInfo.userId === userInfo.userId) {
        data.userInfo = userInfo;
        return true;
      }
    }
    return false;
  };

  const _addDataList = (userIds: string[]) => {
    let ret = false;
    for (const id of userIds) {
      const r = _addData(id);
      if (r === true) {
        ret = true;
      }
    }
    return ret;
  };

  const _updateDataList = (userInfos?: UserServiceData[]) => {
    if (userInfos === undefined) {
      return false;
    }
    let ret = false;
    for (const data of userInfos) {
      const r = _updateData(data);
      if (r === true) {
        ret = true;
      }
    }
    return ret;
  };

  const _removeData = (userId?: string) => {
    if (userId === undefined) {
      return false;
    }
    for (let index = 0; index < dataRef.current.length; index++) {
      const element = dataRef.current[index];
      if (element?.userInfo.userId === userId) {
        dataRef.current.splice(index, 1);
        return true;
      }
    }
    return false;
  };

  const _updateUI = (isNeedUpdate: boolean) => {
    if (isNeedUpdate === true) {
      setData([...dataRef.current]);
    }
  };

  const testCount = React.useRef(0);
  useMemberListener({
    onUpdateInfo: (roomId, userInfo) => {
      if (roomId === im.roomId) {
        ++testCount.current;
        im.updateUserInfos([userInfo]);
        // _updateUI(_updateData(userInfo));
      }
    },
    onUserJoined: (roomId, userId) => {
      if (roomId === im.roomId) {
        if (im.userId !== userId) {
          _updateUI(_addData(userId));
        } else {
          _refreshMembers(() => {
            const list10 = dataRef.current.slice(0, 19).map((v) => {
              return v.userInfo.userId;
            });
            _fetchMemberInfo(list10);
          });
          if (isOwner() === true) {
            _fetchMuter(() => {
              if (muterRef.current.length > 0) {
                const list10 = muterRef.current.slice(0, 19);
                _fetchMemberInfo(list10);
              }
            });
          }
        }
      }
    },
    onUserLeave: (roomId, userId) => {
      if (roomId === im.roomId) {
        _updateUI(_removeData(userId));
      }
    },
    onUserBeKicked: (roomId, reason) => {
      console.log('dev:onUserBeKicked', reason);
      // todo: Internal: Clean up resources. External notifications kicked. Typical: Re-entering the chat room, prompting that the room has been exited, etc.
      im.resetRoom(roomId);
    },
  });

  const _isMuter = (memberId: string) => {
    return im.getMuter(memberId) !== undefined;
  };

  const _refreshMembers = (onFinished?: () => void) => {
    if (memberType === 'member') {
      if (im.roomState === 'joined') {
        dataRef.current = [];
        memberCursor.current = '';
        im.fetchMembers(im.roomId!, gMemberPerPageSize, memberCursor.current)
          .then((r) => {
            memberCursor.current = r.cursor;
            if (r.list) {
              _updateUI(_addDataList(r.list));
            }
            onFinished?.();
          })
          .catch((e) => {
            onFinished?.();
            im.sendError({
              error: new UIKitError({
                code: ErrorCode.room_fetch_member_list_error,
                extra: e.toString(),
              }),
              from: useMemberListAPI?.caller?.name,
            });
          });
      } else {
        onFinished?.();
      }
    } else if (memberType === 'muted') {
      if (im.roomState === 'joined') {
        dataRef.current = [];
        memberCursor.current = '';
        im.fetchMutedMembers(im.roomId!, gMaxMuterSize)
          .then((r) => {
            im.updateMuter(r ?? []);
            muterRef.current = r ?? [];
            if (r) {
              _updateUI(_addDataList(r));
            }
            onFinished?.();
          })
          .catch((e) => {
            onFinished?.();
            im.sendError({
              error: new UIKitError({
                code: ErrorCode.room_fetch_mute_member_list_error,
                extra: e.toString(),
              }),
              from: useMemberListAPI?.caller?.name,
            });
          });
      } else {
        onFinished?.();
      }
    }
  };

  const _loadMoreMembers = () => {
    if (memberType !== 'member') {
      return;
    }
    if (im.roomState === 'joined') {
      im.fetchMembers(im.roomId!, gMemberPerPageSize, memberCursor.current)
        .then((r) => {
          memberCursor.current = r.cursor;
          const isNeedUpdate = _addDataList(r?.list ?? []);
          _updateUI(isNeedUpdate);
          if (isNeedUpdate === false) {
            onNoMoreMember?.();
          }
        })
        .catch((e) => {
          im.sendError({
            error: new UIKitError({
              code: ErrorCode.room_fetch_member_list_error,
              extra: e.toString(),
            }),
            from: useMemberListAPI?.caller?.name,
          });
        });
    }
  };

  const _fetchMemberInfo = (ids: string[]) => {
    if (im.roomState === 'joined') {
      im.fetchUserInfos(im.getNoExisted(ids))
        .then((list) => {
          im.updateUserInfos(list ?? []);
          _updateUI(_updateDataList(list));
        })
        .catch((e) => {
          im.sendError({
            error: new UIKitError({
              code: ErrorCode.room_fetch_member_info_error,
              extra: e.toString(),
            }),
            from: useMemberListAPI?.caller?.name,
          });
        });
    }
  };

  const _fetchMuter = (onFinished?: () => void) => {
    if (memberType === 'muted') {
      return;
    }
    if (im.roomState === 'joined') {
      im.fetchMutedMembers(im.roomId!, gMaxMuterSize)
        .then((r) => {
          im.updateMuter(r ?? []);
          muterRef.current = r ?? [];
          onFinished?.();
        })
        .catch((e) => {
          onFinished?.();
          im.sendError({
            error: new UIKitError({
              code: ErrorCode.room_fetch_mute_member_list_error,
              extra: e.toString(),
            }),
            from: useMemberListAPI?.caller?.name,
          });
        });
    } else {
      onFinished?.();
    }
  };

  const _onRefresh = () => {
    im.getIncludes('8');
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

  const _muteMember = (memberId: string, isMuted: boolean) => {
    if (im.roomState === 'joined') {
      im.updateMemberState(
        im.roomId!,
        memberId,
        isMuted === true ? 'mute' : 'unmute'
      ).catch((e) => {
        im.sendError({
          error: new UIKitError({
            code: ErrorCode.room_mute_member_error,
            extra: e.toString(),
          }),
          from: useMemberListAPI?.caller?.name,
        });
      });
    }
  };
  const _removeMember = (memberId: string) => {
    if (im.roomState === 'joined') {
      im.kickMember(im.roomId!, memberId).catch((e) => {
        im.sendError({
          error: new UIKitError({
            code: ErrorCode.room_kick_member_error,
            extra: e.toString(),
          }),
          from: useMemberListAPI?.caller?.name,
        });
      });
    }
  };

  return {
    data: data,
    muter: muterRef.current,
    refreshing: refreshing,
    onRefresh: _onRefresh,
    onEndReached: _onEndReached,
    viewabilityConfigRef: viewabilityConfigRef,
    onViewableItemsChanged: delayExecTask,
    muteMember: _muteMember,
    removeMember: _removeMember,
  };
}

export function useSearchMemberListAPI(props: { memberType: MemberListType }) {
  const { memberType } = props;
  // const ds = React.useRef<NodeJS.Timeout | undefined>();
  const im = useIMContext();

  const [data, setData] = React.useState<MemberListItemProps[]>([]);

  const { isOwner } = useIsOwner();
  const { emit } = useDispatchContext();

  const _isMuter = (memberId: string) => {
    return im.getMuter(memberId) !== undefined;
  };

  const _execSearch = (key: string) => {
    const r = im.getIncludes(key);
    const rr = r.map((v) => {
      return {
        id: v.userId,
        userInfo: v,
        actions: {
          onClicked: () => {
            const isMuted = _isMuter(v.userId);
            emit(
              `_$${useMemberListAPI.name}_memberListContextMenu`,
              memberType, // current mute list
              isOwner(), // current user role
              v.userId, // current member id
              isMuted // current member mute state
            );
          },
        },
      } as MemberListItemProps;
    });
    setData([...rr]);
  };

  const { delayExecTask: _deferSearch } = useDelayExecTask(
    gSearchTimeout,
    _execSearch
  );

  return {
    _data: data,
    deferSearch: _deferSearch,
  };
}

export function userInfoFromMessage(
  msg: ChatMessage
): UserServiceData | undefined {
  const userInfo = msg.attributes as UserServiceData;
  if (userInfo?.userId) {
    return userInfo;
  }
  return undefined;
}

type useMemberListenerProps = {
  onUpdateInfo?: (roomId: string, userInfo: UserServiceData) => void;
  onUserJoined?: (roomId: string, userId: string) => void;
  onUserLeave?: (roomId: string, userId: string) => void;
  onUserBeKicked?: (roomId: string, reason: number) => void;
};
export function useMemberListener(props: useMemberListenerProps) {
  const { onUpdateInfo, onUserJoined, onUserLeave, onUserBeKicked } = props;
  const msgListener = React.useRef<IMServiceListener>({
    onMessageReceived: (roomId, message) => {
      const userInfo = userInfoFromMessage(message);
      if (userInfo) {
        onUpdateInfo?.(roomId, userInfo);
      }
    },
    onUserJoined: (roomId, user) => {
      onUserJoined?.(roomId, user.userId);
    },
    onUserLeave: (roomId, userId) => {
      onUserLeave?.(roomId, userId);
    },
    onUserBeKicked: (roomId, reason) => {
      onUserBeKicked?.(roomId, reason);
    },
  });
  useIMListener(msgListener.current);
}
