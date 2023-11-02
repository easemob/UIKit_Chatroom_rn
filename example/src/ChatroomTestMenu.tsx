import * as React from 'react';
import { View } from 'react-native';
import {
  BottomSheetMenu,
  BottomSheetMenuItem,
  BottomSheetMenuProps,
  BottomSheetMenuRef,
  useColors,
  usePaletteContext,
} from 'react-native-chat-room';

export type ChatroomTestMenuRef = BottomSheetMenuRef;
export type ChatroomTestMenuProps = Omit<
  BottomSheetMenuProps,
  'title' | 'initItems'
> & {
  addMarqueeTask: () => void;
  addGiftEffectTask: () => void;
  showMemberList: () => void;
};

export const ChatroomTestMenu = React.forwardRef<
  ChatroomTestMenuRef,
  ChatroomTestMenuProps
>(function (
  props: ChatroomTestMenuProps,
  ref?: React.ForwardedRef<ChatroomTestMenuRef>
) {
  const {
    onRequestModalClose,
    addGiftEffectTask,
    showMemberList,
    addMarqueeTask,
    ...others
  } = props;
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
        text={'add marquee task'}
        onPress={addMarqueeTask}
      />,
      <BottomSheetMenuItem
        key={1}
        id={'2'}
        initState={'enabled'}
        text={'add gift list task'}
        onPress={addGiftEffectTask}
      />,
      <BottomSheetMenuItem
        key={2}
        id={'3'}
        initState={'enabled'}
        text={'show member list'}
        onPress={showMemberList}
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
        onPress={() => {
          onRequestModalClose?.();
        }}
      />,
    ],
    [
      addGiftEffectTask,
      addMarqueeTask,
      getColor,
      onRequestModalClose,
      showMemberList,
    ]
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
