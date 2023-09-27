// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  createDarkTheme,
  createPresetPalette,
  EmojiList,
  PaletteContextProvider,
  ThemeContextProvider,
} from 'react-native-chat-room';

export function TestEmojiList() {
  const pal = createPresetPalette();
  const dark = createDarkTheme(pal);

  return (
    <PaletteContextProvider value={pal}>
      <ThemeContextProvider value={dark}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'green',
            paddingTop: 100,
            // left: 100,
          }}
        >
          <TouchableOpacity
            style={{ width: 200, height: 40, backgroundColor: 'red' }}
            onPress={() => {}}
          >
            <Text>{'Start painting presents'}</Text>
          </TouchableOpacity>
          <View style={{ height: 100 }} />
          <EmojiList onFace={() => {}} />
        </View>
      </ThemeContextProvider>
    </PaletteContextProvider>
  );
}

export default function test_emoji_list() {
  return <TestEmojiList />;
}
