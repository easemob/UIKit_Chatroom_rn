import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  BottomSheetMenu,
  BottomSheetMenuRef,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  DispatchContextProvider,
  PaletteContextProvider,
  ThemeContextProvider,
} from 'react-native-chat-room';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function TestBottomSheetMenu() {
  const ref = React.useRef<BottomSheetMenuRef>({} as any);
  return (
    <View>
      <BottomSheetMenu
        propsRef={ref}
        onRequestModalClose={() => {
          ref.current.startHide();
        }}
        title={
          'Nickname: Sei la cosa più bella che mia sia mai capitato non so stare senza te.'
        }
      />
      <View style={{ position: 'absolute', paddingTop: 50 }}>
        <Pressable
          style={{ height: 60, backgroundColor: 'yellow' }}
          onPress={() => {
            if (ref.current.startShow) {
              ref.current.startShow();
            }
          }}
        >
          <Text>{'show bottom sheet menu'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function test_bottom_sheet_menu() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <DispatchContextProvider>
          <SafeAreaProvider>
            <TestBottomSheetMenu />
          </SafeAreaProvider>
        </DispatchContextProvider>
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
