import * as React from 'react';
import { Platform, Pressable, TouchableOpacity, View } from 'react-native';
import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  MemberListRef,
  Report,
  Text,
} from 'react-native-chat-room';

/**
 * for test report list.
 */
export function TestReport(): React.JSX.Element {
  const ref = React.useRef<MemberListRef>({} as any);
  return (
    <View style={{ flex: 1 }}>
      <Report ref={ref} />
      <View
        style={{
          position: 'absolute', // !!! must
          marginTop: 100,
          height: 60,
          width: 300,
          backgroundColor: 'red',
          // padding: 10,
        }}
      >
        <Pressable
          style={{ height: 60, width: 300, backgroundColor: 'white' }}
          onPress={() => {
            ref.current?.startShow();
          }}
        >
          <Text>{'show report list'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

/**
 * Verify absolute layout.
 */
export function TestReport2(): React.JSX.Element {
  const ref = React.useRef<MemberListRef>({} as any);
  return (
    <View style={{ flex: 1, top: 100 }}>
      <TouchableOpacity
        style={{ height: 60, backgroundColor: 'white' }}
        onPress={() => {
          ref.current?.startShow();
        }}
      >
        <Text>{'show member list'}</Text>
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <View style={{ position: 'absolute' }}>
          <Report ref={ref} />
        </View>
      ) : (
        <Report ref={ref} />
      )}
    </View>
  );
}

export default function test_report() {
  const palette = createPresetPalette();
  const light = createLightTheme(palette);
  const dark = createDarkTheme(palette);
  const theme = light ? light : dark;
  return (
    <Container appKey="sdf" isDevMode={true} palette={palette} theme={theme}>
      <View
        style={{
          flex: 1,
          // paddingTop: 100,
          backgroundColor: 'green',
        }}
      >
        <TestReport />
      </View>
    </Container>
  );
}
