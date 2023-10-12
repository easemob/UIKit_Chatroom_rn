import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  PaletteContextProvider,
  ThemeContextProvider,
  useCompare,
  useLifecycle,
} from 'react-native-chat-room';

export function TestComponent() {
  useLifecycle((state) => {
    console.log('test:TestComponent:useLifecycle:', state);
  });
  return (
    <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
      <Text>{'test use life cycle'}</Text>
    </View>
  );
}

export function TestComponent2() {
  const cb = React.useCallback((state) => {
    console.log('test:TestComponent:useLifecycle:', state);
  }, []);
  useLifecycle(cb);
  useCompare(cb);
  return (
    <View style={{ width: 100, height: 100, backgroundColor: 'red' }}>
      <Text>{'test use life cycle'}</Text>
    </View>
  );
}

export function TestUseLifecycle(): React.JSX.Element {
  const [isShow, setIsShow] = React.useState(false);
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 100,
        backgroundColor: 'green',
      }}
    >
      <TouchableOpacity
        style={{ width: '100%', height: 60, backgroundColor: 'yellow' }}
        onPress={() => {
          setIsShow(!isShow);
        }}
      >
        <Text>{'click me change visible'}</Text>
      </TouchableOpacity>
      {isShow === true ? <TestComponent2 /> : null}
    </View>
  );
}

export default function test_use_lifecycle() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <ThemeContextProvider value={theme}>
      <PaletteContextProvider value={palette}>
        <TestUseLifecycle />
      </PaletteContextProvider>
    </ThemeContextProvider>
  );
}
