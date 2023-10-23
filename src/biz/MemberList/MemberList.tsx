import * as React from 'react';
import { StyleProp, useWindowDimensions, View, ViewStyle } from 'react-native';

import { g_mask_color } from '../../const';
import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { SimulativeModal, SimulativeModalRef } from '../../ui/Modal';
import { TabPage } from '../../ui/TabPage';
import type { PropsWithError, PropsWithTest } from '../types';
import { gAspectRatio } from './MemberList.const';
import { useIsOwner } from './MemberList.hooks';
import { MemberListParticipants } from './MemberList.parts';
import type { MemberListType } from './types';

export type MemberListRef = SimulativeModalRef & {
  startShowWithInit: () => void;
};

export type MemberListProps = {
  maskStyle?: StyleProp<ViewStyle> | undefined;
  onSearch?: (memberType: MemberListType) => void;
  onNoMoreMember?: () => void;
} & PropsWithTest &
  PropsWithError;

export const MemberList = React.forwardRef<MemberListRef, MemberListProps>(
  function (props: MemberListProps, ref?: React.ForwardedRef<MemberListRef>) {
    const { maskStyle, testMode, onError, onSearch, onNoMoreMember } = props;
    const simuModalRef = React.useRef<SimulativeModalRef>({} as any);
    const { width: winWidth } = useWindowDimensions();
    const height = winWidth / gAspectRatio;
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
            simuModalRef.current.startShow();
          },
          startHide: (onFinished?: () => void) => {
            simuModalRef.current.startHide(onFinished);
          },
          startShowWithInit: () => {
            simuModalRef.current.startShow();
            // todo: clear pre member list, and init current member list
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
          <MemberListParticipants
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
          <MemberListParticipants
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
        <MemberListParticipants
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
        propsRef={simuModalRef}
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
          style={{
            height: height,
            backgroundColor: getColor('backgroundColor'),
            alignItems: 'center',
            width: '100%',
            borderTopRightRadius: 16,
            borderTopLeftRadius: 16,
          }}
        >
          <View
            style={{
              width: 36,
              height: 5,
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
  }
);

const MemberListCompare = (
  prevProps: MemberListProps,
  nextProps: MemberListProps
) => {
  return prevProps === nextProps;
};

export const MemberListMemo = React.memo(MemberList, MemberListCompare);
