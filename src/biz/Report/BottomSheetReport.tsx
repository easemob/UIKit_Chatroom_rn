import * as React from 'react';
import { StyleProp, useWindowDimensions, View, ViewStyle } from 'react-native';

import { g_mask_color } from '../../const';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { SlideModal, SlideModalRef } from '../../ui/Modal';
import { TabPage } from '../../ui/TabPage';
import type { PropsWithError, PropsWithTest } from '../types';
import { ReportList } from './ReportList';
import type { ReportItemModel } from './types';

export type ReportRef = SlideModalRef & {};
export type ReportProps = {
  data: ReportItemModel[];
  maskStyle?: StyleProp<ViewStyle> | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  onReport: (result?: ReportItemModel) => void;
} & PropsWithTest &
  PropsWithError;

export const BottomSheetReport = React.forwardRef<ReportRef, ReportProps>(
  function (props: ReportProps, ref?: React.ForwardedRef<ReportRef>) {
    const { data, containerStyle, onReport } = props;
    const modalRef = React.useRef<SlideModalRef>({} as any);
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
      <SlideModal
        propsRef={modalRef}
        modalAnimationType="slide"
        backgroundColor={g_mask_color}
        backgroundTransparent={false}
        onRequestModalClose={(): void => {
          modalRef?.current?.startHide?.();
        }}
        // onStartShouldSetPanResponder={() => {
        //   return isUsePanResponder.current;
        // }}
        // onMoveShouldSetPanResponder={() => {
        //   return isUsePanResponder.current;
        // }}
        // onRequestModalClose={() => {
        //   ref.current.startHide();
        // }}
        // maskStyle={maskStyle}
      >
        <View
          style={[
            {
              height: height,
              backgroundColor: getColor('backgroundColor'),
              alignItems: 'center',
              width: '100%',
            },
            containerStyle,
          ]}
        >
          {/* <View
          style={{
            width: 36,
            height: gBottomSheetHeaderHeight - 6 * 2,
            marginVertical: 6,
            backgroundColor: getColor('backgroundColor2'),
            borderRadius: 2.5,
          }}
        /> */}
          <TabPage
            header={{
              HeaderProps: {
                titles: ['Report'],
              },
            }}
            body={{
              type: 'TabPageBody',
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
                    onReport={onReport}
                    data={data}
                  />,
                ],
              },
            }}
            headerPosition="up"
          />
        </View>
      </SlideModal>
    );
  }
);
