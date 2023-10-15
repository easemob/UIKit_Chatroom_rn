import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import {
  Chatroom,
  Icon,
  useColors,
  usePaletteContext,
} from 'react-native-chat-room';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackgroundImageMemo } from '../BackgroundImage';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ChatroomScreen(props: Props) {
  const {} = props;
  const insets = useSafeAreaInsets();
  const testRef = React.useRef<View>({} as any);
  console.log('test:ChatroomScreen:', insets);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.barrage[2],
      dark: colors.barrage[2],
    },
    tintColor: {
      light: colors.barrage[8],
      dark: colors.barrage[8],
    },
  });
  return (
    <View
      ref={testRef}
      style={{ flex: 1 }}
      // onLayout={(e) => {
      //   console.log('test:onLayout:', e.nativeEvent.layout);
      //   testRef.current?.measure(
      //     (
      //       x: number,
      //       y: number,
      //       width: number,
      //       height: number,
      //       pageX: number,
      //       pageY: number
      //     ) => {
      //       console.log('Sub:Sub:measure:', x, y, width, height, pageX, pageY);
      //     }
      //   );
      //   testRef.current?.measureInWindow(
      //     (x: number, y: number, width: number, height: number) => {
      //       console.log('Sub:Sub:measureInWindow:', x, y, width, height);
      //     }
      //   );
      // }}
    >
      {/* <BackgroundImageMemo /> */}
      <Chatroom
        // messageList={{
        //   props: {
        //     visible: true,
        //     containerStyle: {
        //       position: 'absolute',
        //       top: 100,
        //     },
        //   },
        // }}
        // gift={{
        //   props: {
        //     visible: true,
        //     containerStyle: {
        //       position: 'absolute',
        //       top: 100,
        //     },
        //   },
        // }}
        backgroundView={<BackgroundImageMemo />}
        // marquee={{
        //   props: {
        //     visible: true,
        //     containerStyle: {
        //       position: 'absolute',
        //       top: 100,
        //     },
        //   },
        // }}
        input={{
          props: {
            keyboardVerticalOffset: Platform.OS === 'ios' ? 94 : 0,
            after: [
              <TouchableOpacity
                style={{
                  borderRadius: 38,
                  backgroundColor: getColor('bg2'),
                  width: 38,
                  height: 38,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon
                  name={'ellipsis_vertical'}
                  resolution={'3x'}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: getColor('tintColor'),
                  }}
                />
              </TouchableOpacity>,
              <TouchableOpacity
                style={{
                  borderRadius: 38,
                  backgroundColor: getColor('bg2'),
                  width: 38,
                  height: 38,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon
                  name={'gift_color'}
                  style={{ width: 30, height: 30, tintColor: undefined }}
                />
              </TouchableOpacity>,
            ],
          },
        }}
      >
        {/* <Pressable
          style={{
            position: 'absolute',
            width: 100,
            height: 100,
            backgroundColor: 'red',
            bottom: 100,
            // top: 100,
            left: 100,
          }}
          onPress={() => {
            // todo:
          }}
        /> */}
      </Chatroom>
    </View>
  );
}
