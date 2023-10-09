import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';

import { g_mask_color } from '../../const';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { SimulativeModal, SimulativeModalRef } from '../../ui/Modal';
import { TabPage } from '../../ui/TabPage';
import { gAspectRatio } from './BottomSheetGift.const';
import { GiftList } from './GiftList';
import type { GiftListModel } from './types';

export type BottomSheetGiftRef = SimulativeModalRef & {};
export type BottomSheetGiftProps = {
  gifts: {
    title: string;
    gifts: GiftListModel[];
  }[];
  onSend?: (giftId: string) => void;
};

export const BottomSheetGift = React.forwardRef<
  BottomSheetGiftRef,
  BottomSheetGiftProps
>(function (
  props: BottomSheetGiftProps,
  ref?: React.ForwardedRef<BottomSheetGiftRef>
) {
  const { gifts, onSend } = props;
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
          modalRef.current?.startHide(onFinished);
        },
        startShow: () => {
          modalRef.current?.startShow();
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
              titles: gifts.map((v) => {
                return v.title;
              }),
            },
          }}
          body={{
            BodyProps: {
              children: gifts.map((v, i) => {
                return (
                  <GiftList
                    key={i}
                    gifts={v.gifts}
                    requestUseScrollGesture={(finished) => {
                      isUsePanResponder.current = finished;
                    }}
                    onSend={onSend}
                  />
                );
              }),
            },
          }}
          headerPosition="up"
        />
      </View>
    </SimulativeModal>
  );
});
