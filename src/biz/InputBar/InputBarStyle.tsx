import * as React from 'react';
import { View } from 'react-native';

import {
  gInputBarStyleHeight,
  gInputBarStyleItemHeight,
} from './InputBar.const';

export type InputBarStyleProps = {
  onInputBar: () => void;
  onGift: () => void;
};

export function InputBarStyle(props: InputBarStyleProps) {
  const { onInputBar, onGift } = props;

  return (
    <View
      style={{
        height: gInputBarStyleHeight,
        alignItems: 'center',
        backgroundColor: 'red',
        flexDirection: 'row',
        paddingHorizontal: 12,
      }}
    >
      <View
        style={{
          backgroundColor: '#adff2f',
          height: gInputBarStyleItemHeight,
          width: gInputBarStyleItemHeight,
          marginHorizontal: 4,
        }}
      />
      <View
        style={{
          flex: 1,
          height: gInputBarStyleItemHeight,
          backgroundColor: '#adff2f',
          marginHorizontal: 12,
        }}
        onTouchEnd={() => {
          onInputBar();
        }}
      />
      {/* <View
        style={{
          backgroundColor: '#adff2f',
          height: gInputBarStyleItemHeight,
          width: gInputBarStyleItemHeight,
          marginHorizontal: 4,
        }}
      /> */}
      <View
        style={{
          backgroundColor: '#adff2f',
          height: gInputBarStyleItemHeight,
          width: gInputBarStyleItemHeight,
          marginHorizontal: 4,
        }}
        onTouchEnd={() => {
          onGift();
        }}
      />
    </View>
  );
}
