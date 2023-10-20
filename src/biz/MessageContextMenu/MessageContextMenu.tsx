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

export type MessageContextMenuRef = BottomSheetMenuRef;
export type MessageContextMenuProps = Omit<
  BottomSheetMenuProps,
  'title' | 'initItems'
> &
  PropsWithTest &
  PropsWithError;

export const MessageContextMenu = React.forwardRef<
  MessageContextMenuRef,
  MessageContextMenuProps
>(function (
  props: MessageContextMenuProps,
  ref?: React.ForwardedRef<MessageContextMenuRef>
) {
  const { onRequestModalClose, ...others } = props;
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[0],
    },
  });
  const menuRef = React.useRef<BottomSheetMenuRef>({} as any);

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

  const data = React.useMemo(
    () => [
      <BottomSheetMenuItem
        key={0}
        id={'1'}
        initState={'enabled'}
        text={'Private Chat'}
      />,
      <BottomSheetMenuItem
        key={1}
        id={'2'}
        initState={'enabled'}
        text={'Translate'}
      />,
      <BottomSheetMenuItem
        key={2}
        id={'3'}
        initState={'enabled'}
        text={'Deleted'}
      />,
      <BottomSheetMenuItem
        key={3}
        id={'4'}
        initState={'enabled'}
        text={'Muted'}
      />,
      <BottomSheetMenuItem
        key={4}
        id={'5'}
        initState={'warned'}
        text={'Report'}
      />,
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
      />,
    ],
    [getColor]
  );
  return (
    <BottomSheetMenu
      ref={menuRef}
      onRequestModalClose={() => {
        onRequestModalClose?.();
      }}
      title={'test'}
      initItems={data}
      {...others}
    />
  );
});
