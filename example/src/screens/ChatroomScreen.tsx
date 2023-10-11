import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import {
  Chatroom,
  Icon,
  useColors,
  usePaletteContext,
} from 'react-native-chat-room';

import { BackgroundImageMemo } from '../BackgroundImage';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ChatroomScreen(props: Props) {
  const {} = props;
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
    <View style={{ flex: 1 }}>
      <BackgroundImageMemo />
      <Chatroom
        keyboardVerticalOffset={Platform.OS === 'ios' ? 94 : 0}
        after={[
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
        ]}
      />
    </View>
  );
}
