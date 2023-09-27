// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { View } from 'react-native';
import {
  Chatroom,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  DispatchContextProvider,
  PaletteContextProvider,
  ThemeContextProvider,
} from 'react-native-chat-room';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function TestChatroom() {
  const pal = createPresetPalette();
  const dark = createDarkTheme(pal);
  const light = createLightTheme(pal);

  return (
    <SafeAreaProvider>
      <DispatchContextProvider>
        <PaletteContextProvider value={pal}>
          <ThemeContextProvider value={light ? light : dark}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'green',
                // marginTop: 100,
              }}
            >
              <Chatroom />
            </View>
          </ThemeContextProvider>
        </PaletteContextProvider>
      </DispatchContextProvider>
    </SafeAreaProvider>
  );
}

export default function test_chatroom() {
  return <TestChatroom />;
}
