import * as React from 'react';
import { StyleProp, useWindowDimensions, View, ViewStyle } from 'react-native';

import { g_mask_color } from '../../const';
import { useColors, useIsLoadedCheck } from '../../hook';
import { usePaletteContext } from '../../theme';
import { SimulativeModal, SimulativeModalRef } from '../../ui/Modal';
import { TabPage } from '../../ui/TabPage';
import { gAspectRatio } from './MemberList.const';
import { MemberListParticipants } from './MemberList.parts';

export type MemberListRef = SimulativeModalRef & {
  startShowWithInit: () => void;
};

export type MemberListProps = {
  containerStyle?: StyleProp<ViewStyle> | undefined;
};

export const MemberList = React.forwardRef<MemberListRef, MemberListProps>(
  function (props: MemberListProps, ref?: React.ForwardedRef<MemberListRef>) {
    const { containerStyle } = props;
    const modalRef = React.useRef<SimulativeModalRef>({} as any);
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

    useIsLoadedCheck(`${MemberList.name}`);

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
            // todo: clear pre member list, and init current member list
          },
        };
      },
      []
    );

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
        containerStyle={containerStyle}
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
                titles: ['Participants', 'Muted'],
              },
            }}
            body={{
              BodyProps: {
                children: [
                  <MemberListParticipants
                    key={'1'}
                    requestUseScrollGesture={(finished) => {
                      isUsePanResponder.current = finished;
                    }}
                  />,
                  <View key={'2'} />,
                ],
              },
            }}
            headerPosition="up"
          />
        </View>
      </SimulativeModal>
    );
  }
);
