import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { gInputBarStyleHeight } from '../InputBar/InputBar.const';
import {
  gMessageListHeight,
  gMessageListMarginBottom,
  gMessageListMarginLeft,
  gMessageListMarginRight,
} from './MessageList.const';
import { useKeyboardOnAndroid } from './MessageList.hooks';

export type MessageListProps = {
  onRequestCloseInputBar?: () => void;
  isInputBarShow: boolean;
};

export function MessageList(props: MessageListProps) {
  const { onRequestCloseInputBar, isInputBarShow } = props;
  const { width, height } = useWindowDimensions();
  const { bottom, top } = useSafeAreaInsets();

  const translateY = useKeyboardOnAndroid(isInputBarShow);

  return (
    <View
      style={{
        flex: 1,
        width: width,
        height: height - bottom - top - gInputBarStyleHeight,
        backgroundColor: '#7fffd4',
        position: 'absolute',
        bottom: bottom + gInputBarStyleHeight,
        transform: [{ translateY: translateY }],
      }}
    >
      <View
        style={{ flex: 1, backgroundColor: '#8fbc8f' }}
        onTouchEnd={() => {
          onRequestCloseInputBar?.();
        }}
      />
      <View
        style={{
          marginLeft: gMessageListMarginLeft,
          marginRight: gMessageListMarginRight,
          marginBottom: gMessageListMarginBottom,
          // width: '100%',
          height: gMessageListHeight,
          backgroundColor: '#ffd700',
        }}
      />
    </View>
  );
}
