import * as React from 'react';
import { View } from 'react-native';
import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  SearchMember,
  ThemeContextProvider,
} from 'react-native-chat-room';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function SearchMemberComponent(): React.JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <SearchMember />
    </View>
  );
}

export default function test_member_search() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <SafeAreaProvider>
      <ThemeContextProvider value={theme}>
        <PaletteContextProvider value={palette}>
          <SearchMemberComponent />
        </PaletteContextProvider>
      </ThemeContextProvider>
    </SafeAreaProvider>
  );
}
