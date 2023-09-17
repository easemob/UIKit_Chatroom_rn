import * as React from 'react';
import {
  Animated,
  ColorValue,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';

import {
  useSimulativeModalAnimation,
  useSimulativeModalPanResponder,
} from './SimuModal.hooks';
import type { ModalAnimationType } from './types';

export type SimulativeModalRef = {
  startShow: () => void;
  startHide: () => void;
};

export type SimulativeModalProps = Omit<ViewProps, 'style'> & {
  modalAnimationType?: ModalAnimationType;
  modalStyle?: StyleProp<ViewStyle> | undefined;
  backgroundColor?: ColorValue | undefined;
  backgroundTransparent?: boolean | undefined;
  disableBackgroundClose?: boolean | undefined;
  propsRef: React.RefObject<SimulativeModalRef>;
};

export function SimulativeModal(props: SimulativeModalProps) {
  const {
    modalAnimationType,
    modalStyle,
    disableBackgroundClose = false,
    backgroundColor,
    backgroundTransparent = true,
    children,
    propsRef,
    ...others
  } = props;
  console.log('test:SimulativeModal:');
  const { translateY, startShow, startHide, backgroundOpacity } =
    useSimulativeModalAnimation(modalAnimationType);
  const { width, height } = useWindowDimensions();
  const [modalVisible, setModalVisible] = React.useState(false);

  if (propsRef) {
    if (propsRef.current) {
      propsRef.current.startShow = () => {
        setModalVisible(true);
        startShow();
      };
      propsRef.current.startHide = () => {
        startHide(() => setModalVisible(false));
      };
    }
  }

  return (
    <View
      style={{
        flex: 1,
        position: 'absolute',
        width: width,
        height: height,
        // backgroundColor: 'red',
        display: modalVisible === true ? 'flex' : 'none',
        // opacity: modalVisible === true ? 1 : 0,
      }}
      onLayout={(e) => {
        console.log('test:onLayout:', e.nativeEvent.layout);
      }}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (disableBackgroundClose !== true) {
            startHide(() => setModalVisible(false));
          }
        }}
        onLayout={(e) => {
          console.log(
            'test:TouchableWithoutFeedback:onLayout:',
            e.nativeEvent.layout
          );
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
            opacity: modalVisible === true ? backgroundOpacity : 0,
            transform: [{ translateY: translateY }],
            // backgroundColor: 'red',
          },
          modalStyle,
        ]}
        pointerEvents="box-none"
        {...useSimulativeModalPanResponder({
          type: modalAnimationType,
          translateY,
          startShow,
          startHide,
          setModalVisible,
        }).panHandlers}
        {...others}
      >
        {children}
      </Animated.View>
    </View>
  );
}
