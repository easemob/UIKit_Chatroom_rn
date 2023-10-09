import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';

import { g_mask_color } from '../../const';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { SimulativeModal, SimulativeModalRef } from '../../ui/Modal';
import { TabPage } from '../../ui/TabPage';
import { ReportList } from './ReportList';
import { gAspectRatio } from './ReportList.const';
import type { ReportItemData } from './types';

export type ReportRef = SimulativeModalRef & {};
export type ReportProps = {
  data: ReportItemData[];
};

export const Report = React.forwardRef<ReportRef, ReportProps>(function (
  props: ReportProps,
  ref: React.ForwardedRef<ReportRef>
) {
  const { data } = props;
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

  React.useImperativeHandle(
    ref,
    () => {
      return {
        startHide: (onFinished?: () => void) => {
          modalRef.current?.startHide?.(onFinished);
        },
        startShow: () => {
          modalRef.current?.startShow?.();
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
              titles: ['Report'],
            },
          }}
          body={{
            BodyProps: {
              children: [
                <ReportList
                  key={'1'}
                  requestUseScrollGesture={(finished) => {
                    isUsePanResponder.current = finished;
                  }}
                  onCancel={() => {
                    modalRef.current?.startHide?.();
                  }}
                  data={data}
                />,
              ],
            },
          }}
          headerPosition="up"
        />
      </View>
    </SimulativeModal>
  );
});
