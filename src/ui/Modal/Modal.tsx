import * as React from 'react';
import {
  Animated,
  ColorValue,
  Modal as RNModal,
  ModalProps as RNModalProps,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';

import { useModalAnimation, useModalPanResponder } from './Modal.hooks';
import type { ModalAnimationType } from './types';

export type ModalProps = Omit<
  RNModalProps,
  | 'animated'
  | 'animationType'
  | 'transparent'
  | 'visible'
  | 'style'
  | 'onRequestClose'
> & {
  modalVisible: boolean;
  onRequestModalClose: () => void;
  modalAnimationType?: ModalAnimationType;
  modalStyle?: StyleProp<ViewStyle> | undefined;
  backgroundColor?: ColorValue | undefined;
  backgroundTransparent?: boolean | undefined;
  disableBackgroundClose?: boolean | undefined;
};

/**
 * Mainly solves the effect problem of native modal component `RNModal` display mask.
 */
export function Modal(props: ModalProps) {
  const {
    modalAnimationType,
    modalStyle,
    modalVisible,
    onRequestModalClose,
    disableBackgroundClose = false,
    backgroundColor,
    backgroundTransparent = true,
    children,
    ...others
  } = props;
  const { translateY, startShow, startHide, backgroundOpacity } =
    useModalAnimation(modalAnimationType);
  const [visible, setVisible] = React.useState(modalVisible);

  React.useEffect(() => {
    if (modalVisible === false) {
      // !!! There are still problems with this implementation and it needs to be refreshed three times. There is no native callback for hidden components. This may not be possible.
      startHide(() => setVisible(modalVisible));
    } else {
      setVisible(modalVisible);
    }
  }, [startHide, modalVisible]);

  return (
    <RNModal
      transparent={true}
      visible={visible}
      onShow={() => {
        startShow();
      }}
      onDismiss={() => {
        startHide();
      }}
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
                backgroundTransparent === true ? undefined : backgroundColor,
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
        pointerEvents="box-none"
        {...useModalPanResponder({
          type: modalAnimationType,
          translateY,
          startShow,
          onRequestModalClose,
        }).panHandlers}
      >
        {children}
      </Animated.View>
    </RNModal>
  );
}
