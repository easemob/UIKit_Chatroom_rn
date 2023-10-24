// ref: https://github.com/software-mansion/react-native-gesture-handler/blob/main/example/src/showcase/bottomSheet/index.tsx
// When using Model in React Native, the inner FlatList cannot be scrolled. ref: https://zhuanlan.zhihu.com/p/630696822

import * as React from 'react';
import type { GestureResponderHandlers, ViewProps } from 'react-native';
import {
  Animated,
  Modal as RNModal,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { g_mask_color } from '../../const';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import type { ModalProps, ModalRef } from './Modal';
import { useModalAnimation, useModalPanResponder } from './Modal.hooks';

export type SlideProps = ViewProps & GestureResponderHandlers;

/**
 * Why not use properties to show and hide components? The method of using attributes has been tried, but this method requires more renderings (the function needs to be executed multiple times internally).
 *
 * ref: example/src/__dev__/test_modal_prototype.tsx
 */
export type SlideModalRef = ModalRef;

export type SlideModalProps = ModalProps & {
  Slide?: React.ComponentType<SlideProps>;
};

/**
 * Mainly solves the effect problem of native modal component `RNModal` display mask.
 */
export function SlideModal(props: SlideModalProps) {
  const {
    propsRef,
    modalAnimationType,
    modalStyle,
    onRequestModalClose,
    disableBackgroundClose = false,
    backgroundColor,
    backgroundTransparent = false,
    children,
    onMoveShouldSetPanResponder,
    onFinished,
    Slide,
    ...others
  } = props;
  const { translateY, startShow, startHide, backgroundOpacity } =
    useModalAnimation(modalAnimationType);
  const [visible, setVisible] = React.useState(false);

  const _Slide = Slide ?? DefaultSlide;

  if (propsRef.current) {
    propsRef.current.startShow = () => {
      setVisible(true);
      startShow();
    };
    propsRef.current.startHide = (onf?: () => void) => {
      startHide(() => {
        setVisible(false);
        onf?.();
        onFinished?.();
      });
    };
  }

  return (
    <RNModal
      transparent={true}
      visible={visible}
      animationType="none"
      onRequestClose={onRequestModalClose}
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right',
      ]}
      {...others}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (disableBackgroundClose !== true) {
            onRequestModalClose();
          }
        }}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                backgroundTransparent === true
                  ? undefined
                  : backgroundColor ?? g_mask_color,
              opacity: backgroundTransparent === true ? 0 : backgroundOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          {
            flex: 1,
            justifyContent: 'flex-end',
            opacity: modalAnimationType === 'fade' ? backgroundOpacity : 1,
            transform: [{ translateY: translateY }],
          },
          modalStyle,
        ]}
        pointerEvents={'box-none'}
      >
        <_Slide
          {...useModalPanResponder({
            type: modalAnimationType,
            translateY,
            startShow,
            onRequestModalClose,
            onMoveShouldSetPanResponder,
          }).panHandlers}
        />
        {/* <View
          style={[
            {
              height: 32,
              width: '100%',
              backgroundColor: getColor('backgroundColor'),
              alignItems: 'center',
              borderTopRightRadius: 16,
              borderTopLeftRadius: 16,
              transform: [{ translateY: 15 }],
            },
          ]}
          {...useModalPanResponder({
            type: modalAnimationType,
            translateY,
            startShow,
            onRequestModalClose,
            onMoveShouldSetPanResponder,
          }).panHandlers}
        >
          <View
            style={{
              width: 36,
              height: 5,
              marginTop: 6,
              backgroundColor: getColor('backgroundColor2'),
              borderRadius: 2.5,
            }}
          />
        </View> */}

        {/*
          // NOTE: https://github.com/facebook/react-native/issues/14295
          // Subcomponents need to be wrapped in `Pressable` to support sliding operations.
          // example: <Pressable>{children}</Pressable>
          // Note: Nested `FlatList` components are not supported, otherwise the list cannot be scrolled. It is recommended to use the `SimuModal` component.
         */}
        {children}
        {/* <Pressable>{children}</Pressable> */}
      </Animated.View>
    </RNModal>
  );
}

const DefaultSlide = (props: SlideProps) => {
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
  return (
    <View
      style={[
        {
          height: 32,
          width: '100%',
          backgroundColor: getColor('backgroundColor'),
          alignItems: 'center',
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
          transform: [{ translateY: 15 }],
        },
      ]}
      {...props}
    >
      <View
        style={{
          width: 36,
          height: 5,
          marginTop: 6,
          backgroundColor: getColor('backgroundColor2'),
          borderRadius: 2.5,
        }}
      />
    </View>
  );
};
