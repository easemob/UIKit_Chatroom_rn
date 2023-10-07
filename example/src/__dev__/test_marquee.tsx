// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import {
  createDarkTheme,
  createPresetPalette,
  Marquee,
  MarqueeRef,
  PaletteContextProvider,
  ThemeContextProvider,
} from 'react-native-chat-room';

let count = 1;

export function TestMarquee() {
  const ref = React.useRef<MarqueeRef>({} as any);
  const pal = createPresetPalette();
  const light = createDarkTheme(pal);
  // const content =
  //   'For several generations, stories from Africa have traditionally been passed down by word of mouth. Often, after a hard day’s work, the adults would gather the children together by moonlight, around a village fire and tell stories. This was traditionally called Tales by Moonlight. Usually, the stories are meant to prepare young people for life, and so each story taught a lesson or moral. ';
  // const content = 'sdf';
  const content =
    'For several generations, stories from Africa have traditionally been passed down by word of mouth. ';

  return (
    <PaletteContextProvider value={pal}>
      <ThemeContextProvider value={light}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'green',
            paddingTop: 100,
            // left: 100,
          }}
        >
          <TouchableOpacity
            style={{ width: 100, height: 60, backgroundColor: 'yellow' }}
            onPress={() => {
              ref.current?.pushTask?.({
                id: count.toString(),
                content: count.toString() + content,
                // content: content,
              });
              ++count;
            }}
          >
            <Text>{'Start Scrolling'}</Text>
          </TouchableOpacity>
          <View style={{ height: 100 }} />
          <Marquee propsRef={ref} width={300} />
        </View>
      </ThemeContextProvider>
    </PaletteContextProvider>
  );
}

export default function test_marquee() {
  return <TestMarquee />;
}
