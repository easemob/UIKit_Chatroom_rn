import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { SimulativeModal, SimulativeModalRef } from '../../ui/Modal';
import { TabPage } from '../../ui/TabPage';
import { gAspectRatio } from './MemberList.const';
import { MemberListParticipants } from './MemberList.parts';

export type MemberListRef = SimulativeModalRef & {};

export type MemberListProps = {
  propsRef: React.RefObject<MemberListRef>;
};

export function MemberList(props: MemberListProps) {
  const { propsRef } = props;
  const ref = React.useRef<SimulativeModalRef>({} as any);
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

  if (propsRef.current) {
    propsRef.current.startHide = (onFinished?: () => void) => {
      ref.current.startHide(onFinished);
    };
    propsRef.current.startShow = () => {
      ref.current.startShow();
    };
  }

  return (
    <SimulativeModal
      propsRef={ref}
      modalAnimationType="slide"
      backgroundColor={'rgba(0, 0, 0, 0.2)'}
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
