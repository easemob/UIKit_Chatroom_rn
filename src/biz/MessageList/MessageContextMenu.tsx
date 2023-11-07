import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import {
  BottomSheetMenu,
  BottomSheetMenuItem,
  BottomSheetMenuProps,
  BottomSheetMenuRef,
} from '../BottomSheetMenu';
import type { PropsWithError, PropsWithTest } from '../types';

/**
 * Type of menu item.
 */
export type MessageContextMenuItemType =
  | 'Private Chat'
  | 'Translate'
  | 'Delete'
  | 'Report';

/**
 * Referencing value of the `MessageContextMenu` component.
 */
export type MessageContextMenuRef = BottomSheetMenuRef;
/**
 * Properties of the `MessageContextMenu` component.
 */
export type MessageContextMenuProps = Omit<
  BottomSheetMenuProps,
  'title' | 'initItems'
> &
  PropsWithTest &
  PropsWithError & {
    list: MessageContextMenuItemType[];
    onClicked?: (type: MessageContextMenuItemType) => void;
  };

/**
 * Component for displaying the context menu of the message.
 */
export const MessageContextMenu = React.forwardRef<
  MessageContextMenuRef,
  MessageContextMenuProps
>(function (
  props: MessageContextMenuProps,
  ref?: React.ForwardedRef<MessageContextMenuRef>
) {
  const { onRequestModalClose, ...others } = props;
  const menuRef = React.useRef<BottomSheetMenuRef>({} as any);
  const { getItems } = useGetMessageListItems();

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
        startShowWithInit: (initItems?) => {
          menuRef?.current?.startShowWithInit?.(initItems);
        },
      };
    },
    []
  );

  return (
    <BottomSheetMenu
      ref={menuRef}
      onRequestModalClose={() => {
        onRequestModalClose?.();
      }}
      title={'test'}
      initItems={getItems(props)}
      {...others}
    />
  );
});

export function useGetMessageListItems() {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[0],
    },
  });
  const { tr } = useI18nContext();
  const getItems = React.useCallback(
    (props: MessageContextMenuProps) => {
      const { list, onClicked, onRequestModalClose } = props;
      const d = list
        .map((v, i) => {
          if (v === 'Private Chat' || v === 'Translate' || v === 'Delete') {
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
          } else if (v === 'Report') {
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
        .filter((v) => v !== null) as JSX.Element[];

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
