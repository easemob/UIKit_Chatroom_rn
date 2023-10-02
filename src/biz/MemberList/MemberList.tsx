import * as React from 'react';
import { useWindowDimensions } from 'react-native';
import { View } from 'react-native';

import { usePaletteContext, useThemeContext } from '../../theme';
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
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();

  if (propsRef.current) {
    propsRef.current.startHide = (onFinished?: () => void) => {
      ref.current.startHide(onFinished);
    };
    propsRef.current.startShow = () => {
      ref.current.startShow();
    };
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <SimulativeModal
          propsRef={ref}
          modalAnimationType="slide"
          backgroundColor={'rgba(0, 0, 0, 0.2)'}
          backgroundTransparent={false}
          onStartShouldSetPanResponder={() => {
            console.log('test:zuoyu:use:', isUsePanResponder.current);
            return isUsePanResponder.current;
          }}
          // onMoveShouldSetPanResponder={() => {
          //   console.log('test:zuoyu:use:', isUsePanResponder.current);
          //   return isUsePanResponder.current;
          // }}
          // onRequestModalClose={() => {
          //   ref.current.startHide();
          // }}
        >
          <View
            style={{
              height: height,
              backgroundColor:
                style === 'light' ? colors.neutral[98] : colors.neutral[1],
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
                backgroundColor:
                  style === 'light' ? colors.neutral[8] : colors.neutral[3],
                borderRadius: 2.5,
              }}
            />
            <TabPage
              header={{
                HeaderProps: {
                  titles: ['Participants'],
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
                  ],
                },
              }}
              headerPosition="up"
            />
          </View>
        </SimulativeModal>
      </View>
    </View>
  );
}
