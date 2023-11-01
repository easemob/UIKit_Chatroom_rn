import * as React from 'react';
import { StyleProp, useWindowDimensions, View, ViewStyle } from 'react-native';

import { g_mask_color } from '../../const';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { SimulativeModal, SimulativeModalRef } from '../../ui/Modal';
import { TabPage } from '../../ui/TabPage';
import { gBottomSheetHeaderHeight } from '../const';
import type { PropsWithError, PropsWithTest } from '../types';
import { MemberList } from './MemberList';
import { useIsOwner } from './MemberList.hooks';
import type { MemberListItemProps } from './MemberList.item';
import type { MemberListType } from './types';

export type BottomSheetMemberListRef = SimulativeModalRef & {
  startShowWithInit: () => void;
};

export type BottomSheetMemberListProps = {
  maskStyle?: StyleProp<ViewStyle> | undefined;
  onSearch?: (memberType: MemberListType) => void;
  onNoMoreMember?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  MemberItemComponent?: React.ComponentType<MemberListItemProps>;
} & PropsWithTest &
  PropsWithError;

export const BottomSheetMemberList = React.forwardRef<
  BottomSheetMemberListRef,
  BottomSheetMemberListProps
>(function (
  props: BottomSheetMemberListProps,
  ref?: React.ForwardedRef<BottomSheetMemberListRef>
) {
  const {
    maskStyle,
    testMode,
    onError,
    onSearch,
    onNoMoreMember,
    containerStyle,
    MemberItemComponent,
  } = props;
  const modalRef = React.useRef<SimulativeModalRef>({} as any);
  const { height: winHeight } = useWindowDimensions();
  const height = (winHeight * 3) / 5;
  const isUsePanResponder = React.useRef(true);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    backgroundColor2: {
      light: colors.neutral[8],
      dark: colors.neutral[3],
    },
  });
  const { isOwner } = useIsOwner();
  const { tr } = useI18nContext();

  React.useImperativeHandle(
    ref,
    () => {
      return {
        startShow: () => {
          modalRef.current.startShow();
        },
        startHide: (onFinished?: () => void) => {
          modalRef.current.startHide(onFinished);
        },
        startShowWithInit: () => {
          modalRef.current.startShow();
        },
      };
    },
    []
  );

  const getTabItemBodies = ({
    isOwner,
    isUsePanResponder,
    testMode,
    onError,
  }: {
    isOwner: boolean;
    isUsePanResponder: React.MutableRefObject<boolean>;
  } & PropsWithTest &
    PropsWithError) => {
    if (isOwner === true) {
      return [
        <MemberList
          key={'1'}
          memberType={'member'}
          requestUseScrollGesture={(finished) => {
            isUsePanResponder.current = finished;
          }}
          testMode={testMode}
          onError={onError}
          onSearch={() => {
            onSearch?.('member');
          }}
          onNoMoreMember={onNoMoreMember}
        />,
        <MemberList
          key={'2'}
          memberType={'muted'}
          requestUseScrollGesture={(finished) => {
            isUsePanResponder.current = finished;
          }}
          testMode={testMode}
          onError={onError}
          onSearch={() => {
            onSearch?.('muted');
          }}
          onNoMoreMember={onNoMoreMember}
        />,
      ];
    }
    return [
      <MemberList
        key={'1'}
        memberType={'member'}
        requestUseScrollGesture={(finished) => {
          isUsePanResponder.current = finished;
        }}
        testMode={testMode}
        onError={onError}
        onSearch={() => {
          onSearch?.('member');
        }}
        onNoMoreMember={onNoMoreMember}
        MemberItemComponent={MemberItemComponent}
      />,
    ];
  };

  const getTabItemTitles = (isOwner: boolean) => {
    if (isOwner === true) {
      return [tr('Participants'), tr('Muted')];
    }
    return [tr('Participants')];
  };

  return (
    <SimulativeModal
      propsRef={modalRef}
      modalAnimationType="slide"
      backgroundColor={g_mask_color}
      backgroundTransparent={false}
      onStartShouldSetPanResponder={() => {
        return isUsePanResponder.current;
      }}
      // onMoveShouldSetPanResponder={() => {
      //   return isUsePanResponder.current;
      // }}
      // onRequestModalClose={() => {
      //   ref.current.startHide();
      // }}
      maskStyle={maskStyle}
    >
      <View
        style={[
          {
            height: height,
            backgroundColor: getColor('backgroundColor'),
            alignItems: 'center',
            width: '100%',
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
          },
          containerStyle,
        ]}
      >
        <View
          style={{
            width: 36,
            height: gBottomSheetHeaderHeight - 6 * 2,
            marginVertical: 6,
            backgroundColor: getColor('backgroundColor2'),
            borderRadius: 2.5,
          }}
        />
        <TabPage
          header={{
            HeaderProps: {
              titles: getTabItemTitles(isOwner()),
            },
          }}
          body={{
            type: 'TabPageBody',
            BodyProps: {
              children: getTabItemBodies({
                isOwner: isOwner(),
                isUsePanResponder,
                testMode,
                onError,
              }),
            },
          }}
          headerPosition="up"
        />
      </View>
    </SimulativeModal>
  );
});

const BottomSheetMemberListCompare = (
  prevProps: BottomSheetMemberListProps,
  nextProps: BottomSheetMemberListProps
) => {
  return prevProps === nextProps;
};

export const MemberListMemo = React.memo(
  BottomSheetMemberList,
  BottomSheetMemberListCompare
);
