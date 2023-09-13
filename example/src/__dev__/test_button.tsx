import * as React from 'react';
import { View } from 'react-native';
import {
  Button,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  ThemeContextProvider,
} from 'react-native-chat-room';

function ButtonComponent(): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        buttonStyle={'commonButton'}
        sizesType={'large'}
        radiusType={'large'}
        contentType={'icon-text'}
        text={'Enabled'}
        icon={'emojiKeyboard'}
        onPress={() => {
          console.log('test:ButtonComponent:onPress:');
        }}
      />
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
        <ButtonComponent />
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
