import * as React from 'react';
import { View } from 'react-native';

import { useDispatchListener } from '../../dispatch';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { useIMContext } from '../../im';
import { usePaletteContext } from '../../theme';
import { Alert, AlertRef } from '../../ui/Alert';
import {
  BottomSheetMenu,
  BottomSheetMenuItem,
  BottomSheetMenuProps,
  BottomSheetMenuRef,
} from '../BottomSheetMenu';
import type { PropsWithError, PropsWithTest } from '../types';
import type { MemberListType } from './types';

export type MemberContextMenuRef = BottomSheetMenuRef;
export type MemberContextMenuProps = Omit<
  BottomSheetMenuProps,
  'title' | 'initItems'
> &
  PropsWithTest &
  PropsWithError & {
    list: ('Private Chat' | 'Mute' | 'Unmute' | 'Remove')[];
    onClicked?: (type: 'Private Chat' | 'Mute' | 'Unmute' | 'Remove') => void;
  };

export const MemberContextMenu = React.forwardRef<
  MemberContextMenuRef,
  MemberContextMenuProps
>(function (
  props: MemberContextMenuProps,
  ref?: React.ForwardedRef<MemberContextMenuRef>
) {
  const { onRequestModalClose, ...others } = props;
  const menuRef = React.useRef<BottomSheetMenuRef>({} as any);
  const { getItems } = useGetMemberListItems();

  React.useImperativeHandle(
    ref,
    () => {
      return {
        startShow: () => {
          menuRef?.current?.startShow?.();
        },
        startHide: (onFinished?) => {
          menuRef?.current?.startHide?.(onFinished);
        },
        startShowWithInit: (initItems: React.ReactElement[]) => {
          menuRef?.current?.startShowWithInit?.(initItems);
        },
      };
    },
    []
  );

  return (
    <BottomSheetMenu
      ref={menuRef}
      onRequestModalClose={onRequestModalClose}
      initItems={getItems(props)}
      {...others}
    />
  );
});

export function useGetMemberListItems() {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[0],
    },
  });
  const { tr } = useI18nContext();
  const getItems = React.useCallback(
    (props: MemberContextMenuProps) => {
      const { list, onClicked, onRequestModalClose } = props;
      const d = list
        .map((v, i) => {
          if (v === 'Private Chat' || v === 'Mute' || v === 'Unmute') {
            return (
              <BottomSheetMenuItem
                key={i}
                id={i.toString()}
                initState={'enabled'}
                text={tr(v)}
                onPress={() => {
                  onClicked?.(v);
                }}
              />
            );
          } else if (v === 'Remove') {
            return (
              <BottomSheetMenuItem
                key={i}
                id={i.toString()}
                initState={'warned'}
                text={tr(v)}
                onPress={() => {
                  onClicked?.(v);
                }}
              />
            );
          } else {
            return null;
          }
        })
        .filter((v) => v !== null) as React.JSX.Element[];

      const data = [
        ...d,
        <View
          key={6}
          style={{
            height: 8,
            width: '100%',
            backgroundColor: getColor('divider'),
          }}
        />,
        <BottomSheetMenuItem
          key={5}
          id={'6'}
          initState={'enabled'}
          text={tr('Cancel')}
          onPress={onRequestModalClose}
        />,
      ];
      return data;
    },
    [getColor, tr]
  );
  return {
    getItems,
  };
}

export const MemberContextMenuWrapper = (
  props: PropsWithTest &
    PropsWithError & {
      memberType: MemberListType;
      muteMember: (memberId: string, isMuted: boolean) => void;
      removeMember: (memberId: string) => void;
    }
) => {
  const { muteMember, removeMember, memberType } = props;
  const menuRef = React.useRef<MemberContextMenuRef>({} as any);
  const alertRef = React.useRef<AlertRef>({} as any);
  const [userName, setUserName] = React.useState('');
  const { getItems } = useGetMemberListItems();
  const im = useIMContext();
  const userIdRef = React.useRef('');
  const listener = React.useRef(
    (
      _memberType: MemberListType, // current mute list
      isOwner: boolean, // current user role
      userId: string // current member id
      // isMuted: boolean // current member mute state
    ) => {
      if (isOwner === true) {
        if (_memberType === 'member') {
          if (memberType === _memberType) {
            menuRef.current?.startShowWithInit(
              getItems({
                list: ['Mute', 'Remove'],
                onClicked: (type) => {
                  if (userId !== im.userId) {
                    if (type === 'Mute') {
                      muteMember(userId, true);
                    } else if (type === 'Unmute') {
                      muteMember(userId, false);
                    } else if (type === 'Remove') {
                      userIdRef.current = userId;
                      setUserName(userId);
                      menuRef?.current?.startHide?.(() => {
                        alertRef?.current?.alert?.();
                      });
                      return;
                    }
                  }

                  menuRef?.current?.startHide?.();
                },
                onRequestModalClose: () => {
                  menuRef?.current?.startHide?.();
                },
              })
            );
          }
        } else if (_memberType === 'muted') {
          if (memberType === _memberType) {
            menuRef.current?.startShowWithInit(
              getItems({
                list: ['Unmute'],
                onClicked: (type) => {
                  if (type === 'Mute') {
                    muteMember(userId, true);
                  } else if (type === 'Unmute') {
                    muteMember(userId, false);
                  } else if (type === 'Remove') {
                    removeMember(userId);
                  }
                  menuRef?.current?.startHide?.();
                },
                onRequestModalClose: () => {
                  menuRef?.current?.startHide?.();
                },
              })
            );
          }
        }
      }
    }
  );
  useDispatchListener(
    `_$useMemberListAPI_memberListContextMenu`,
    listener.current
  );
  return (
    <>
      <MemberContextMenu
        ref={menuRef}
        list={[]}
        onRequestModalClose={() => {
          menuRef?.current?.startHide?.();
        }}
      />
      <Alert
        ref={alertRef}
        title={`Want to remove '${userName}'`}
        buttons={[
          {
            text: 'Cancel',
            onPress: () => {
              alertRef.current?.close?.();
            },
          },
          {
            text: 'Confirm',
            onPress: () => {
              removeMember(userIdRef.current);
              alertRef.current?.close?.();
            },
          },
        ]}
      />
    </>
  );
};
