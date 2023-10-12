import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, useThemeContext } from 'react-native-chat-room';

import * as assert from './assert';
export const BackgroundImage = () => {
  const { style } = useThemeContext();
  return (
    <View style={[StyleSheet.absoluteFill, { position: 'absolute' }]}>
      <Image
        resizeMode={'cover'}
        source={style === 'light' ? assert.lightImage : assert.darkImage}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
};

export const BackgroundImageMemo = React.memo(BackgroundImage);