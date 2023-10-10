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

export type BottomSheetGiftRef = SimulativeModalRef & {
  startShowWithInit: (
    gifts: {
      title: string;
      gifts: GiftListModel[];
    }[]
  ) => void;
};
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
  const { gifts: initGifts, onSend } = props;
  const [gifts, setGift] = React.useState(initGifts);
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
  const isShow = React.useRef(false);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        startHide: (onFinished?: () => void) => {
          isShow.current = false;
          modalRef.current?.startHide(onFinished);
        },
        startShow: () => {
          isShow.current = true;
          modalRef.current?.startShow();
        },
        startShowWithInit: (
          giftsParams: {
            title: string;
            gifts: GiftListModel[];
          }[]
        ) => {
          if (JSON.stringify(giftsParams) !== JSON.stringify(gifts)) {
            isShow.current = true;
            setGift([...giftsParams]);
          } else {
            isShow.current = true;
            modalRef.current?.startShow();
          }
        },
      };
    },
    [gifts]
  );

  React.useEffect(() => {
    if (isShow.current === true) {
      modalRef.current?.startShow();
    }
  }, [gifts]);

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
