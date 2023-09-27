// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx

import * as React from 'react';
import { Platform, TextInput, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export function TestChatroom() {
  const fontSize = 18;
  const [_maxHeight, _setMaxHeight] = React.useState(0);
  const getMaxHeight = () => {
    return Platform.OS === 'ios' ? 91 : _maxHeight === 0 ? 100 : _maxHeight;
  };
  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: 'green', top: 100 }}>
      <View
        style={{
          backgroundColor: 'yellow',
          maxHeight: getMaxHeight(),
        }}
      >
        <TextInput
          textAlignVertical={'top'}
          style={{ fontSize: fontSize }}
          numberOfLines={4}
          multiline={true}
          onLayout={(e) => {
            console.log('test:zuoyu:onLayout:', e.nativeEvent.layout);
          }}
          // onTextInput={(e) => {
          //   console.log('test:zuoyu:onTextInput:', e.nativeEvent);
          // }}
          // onChange={(e) => {
          //   console.log('test:zuoyu:onChange:', e.nativeEvent);
          // }}
          onContentSizeChange={(e) => {
            console.log('test:zuoyu:onContentSizeChange:', e.nativeEvent);
            if (Platform.OS === 'ios') {
            } else {
              _setMaxHeight(e.nativeEvent.contentSize.height);
            }
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

export default function test_textinput() {
  return <TestChatroom />;
}
