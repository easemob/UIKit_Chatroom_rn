import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Platform, View } from 'react-native';
import { Chatroom, useColors, usePaletteContext } from 'react-native-chat-room';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ChatroomScreen(props: Props) {
  const {} = props;
  const { colors } = usePaletteContext();
  const {} = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  return (
    <View style={{ flex: 1, backgroundColor: 'green' }}>
      <Chatroom keyboardVerticalOffset={Platform.OS === 'ios' ? 94 : 0} />
    </View>
  );
}
