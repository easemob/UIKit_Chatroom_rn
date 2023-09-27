import * as React from 'react';
import { View } from 'react-native';
import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  Text,
  ThemeContextProvider,
} from 'react-native-chat-room';

function TextComponent(): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        textType={'large'}
        paletteType={'headline'}
        onTextLayout={(e) => {
          console.log('test:onTextLayout:', e.nativeEvent.lines);
        }}
        onLayout={(e) => {
          console.log('test:onLayout:', e.nativeEvent.layout);
        }}
      >
        headline - large
      </Text>
    </View>
  );
}

export default function test_text() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? dark : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <TextComponent />
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
