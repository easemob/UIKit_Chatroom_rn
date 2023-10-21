import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import {
  BottomSheetMenu,
  BottomSheetMenuItem,
  BottomSheetMenuProps,
  BottomSheetMenuRef,
} from '../BottomSheetMenu';
import type { PropsWithError, PropsWithTest } from '../types';

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
  const { getItems } = useGetItems();

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

export function useGetItems() {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[0],
    },
  });
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
                text={v}
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
                text={v}
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
          text={'Cancel'}
          onPress={onRequestModalClose}
        />,
      ];
      return data;
    },
    [getColor]
  );
  return {
    getItems,
  };
}
