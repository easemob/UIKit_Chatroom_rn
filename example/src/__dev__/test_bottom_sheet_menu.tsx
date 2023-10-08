import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  BottomSheetMenu,
  BottomSheetMenuRef,
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
} from 'react-native-chat-room';

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
  const pal = createPresetPalette();
  const dark = createDarkTheme(pal);
  const light = createLightTheme(pal);
  return (
    <Container
      appKey="sdf"
      isDevMode={true}
      palette={pal}
      theme={light ? light : dark}
    >
      <TestBottomSheetMenu />
    </Container>
  );
}
