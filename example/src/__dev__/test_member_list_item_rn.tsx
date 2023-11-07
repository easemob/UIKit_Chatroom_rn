import * as React from 'react';
import { View } from 'react-native';
import {
  Avatar,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  Icon,
  IconButton,
  PaletteContextProvider,
  Text,
  ThemeContextProvider,
} from 'react-native-chat-room';

export function MemberListItem(): JSX.Element {
  return (
    <View
      style={{ backgroundColor: 'white', paddingHorizontal: 10, width: '100%' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon
          name={'crown1'}
          style={{
            width: 22,
            height: 22,
            tintColor: 'orange',
            margin: 4,
          }}
        />

        <View style={{ width: 12 }} />
        <Avatar url={'https://note?'} size={40} borderRadius={40} />
        <View style={{ width: 12 }} />
        <View style={{ marginVertical: 10 }}>
          <Text textType={'medium'} paletteType={'title'}>
            {'NickName'}
          </Text>
          <Text textType={'medium'} paletteType={'body'}>
            {'Role'}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <IconButton
          iconName={'ellipsis_vertical'}
          style={{ tintColor: undefined, width: 24, height: 24, margin: 4 }}
        />
      </View>
    </View>
  );
}

export default function test_button() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 100,
            backgroundColor: 'green',
          }}
        >
          <MemberListItem />
        </View>
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
