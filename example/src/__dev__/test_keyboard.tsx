import * as React from 'react';
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardAvoidingView,
  TextInput,
  View,
} from 'react-native';

const useAnimation = () => {
  const input = React.useRef(new Animated.Value(0)).current;
  const emoji = React.useRef(new Animated.Value(-336)).current;

  const createAnimation = (type: 'show' | 'hide') => {
    return Animated.parallel([
      Animated.timing(input, {
        toValue: type === 'show' ? -336 : 0,
        useNativeDriver: false,
        duration: 250,
        easing: Easing.linear,
      }),
      Animated.timing(emoji, {
        toValue: type === 'show' ? 0 : -336,
        useNativeDriver: false,
        duration: 250,
        easing: Easing.linear,
      }),
    ]).start;
  };

  return {
    translateY: input,
    emojiBottom: emoji,
    show: createAnimation('show'),
    hide: createAnimation('hide'),
  };
};

export function TestKeyboard() {
  // const [enabled, setEnabled] = React.useState(true);
  const { translateY, emojiBottom, show, hide } = useAnimation();
  const noMove = React.useRef(false);

  React.useEffect(() => {
    // Keyboard.addListener('keyboardDidShow', (e) => {
    //   console.log('test:keyboardDidShow:', e);
    // });
    // Keyboard.addListener('keyboardWillShow', (e) => {
    //   console.log('test:keyboardWillShow:', e);
    // });
    // Keyboard.addListener('keyboardDidHide', (e) => {
    //   console.log('test:keyboardDidHide:', e);
    // });
    // Keyboard.addListener('keyboardWillHide', (e) => {
    //   console.log('test:keyboardWillHide:', e);
    // });
    // Keyboard.addListener('keyboardDidChangeFrame', (e) => {
    //   console.log('test:keyboardDidChangeFrame:', e);
    // });
    // Keyboard.addListener('keyboardWillChangeFrame', (e) => {
    //   console.log('test:keyboardWillChangeFrame:', e);
    // });
  }, []);

  // return (
  //   <View style={{ flex: 1, backgroundColor: 'green' }}>
  //     <View
  //       style={{
  //         position: 'absolute',
  //         height: 100,
  //         width: '100%',
  //         bottom: 100,
  //         backgroundColor: 'orange',
  //       }}
  //     ></View>
  //   </View>
  // );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'green',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        // behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        // contentContainerStyle={{ height: 500, bottom: 100, flex: 1 }}
        // onLayout={(e) => {
        //   if (e.nativeEvent) console.log('test:onLayout:', e.nativeEvent);
        // }}
        // enabled={enabled}
      >
        <View
          onLayout={() => {
            // if (e.nativeEvent) console.log('test:onLayout:', e.nativeEvent);
          }}
          // style={{ height: 700 }}
        >
          <View style={{ flexDirection: 'row', flex: 1, width: 300 }}>
            <View
              style={{ width: 100, flexGrow: 1, backgroundColor: 'blue' }}
              onTouchEnd={() => {
                noMove.current = true;
                Keyboard.dismiss();
              }}
            />
            <View
              style={{ width: 100, backgroundColor: 'red' }}
              onTouchEnd={() => {
                noMove.current = false;
                Keyboard.dismiss();
              }}
            />
          </View>
          <Animated.View style={{ transform: [{ translateY: translateY }] }}>
            <TextInput
              style={{ backgroundColor: 'yellow', height: 100 }}
              onLayout={(e) => {
                if (e.nativeEvent) console.log('test:onLayout:', e.nativeEvent);
              }}
              onFocus={(e) => {
                console.log('test:onFocus:', e.nativeEvent);
                show();
              }}
              onBlur={(e) => {
                console.log('test:onBlur:', e.nativeEvent);
                if (noMove.current === false) {
                  hide();
                }
              }}
            />
          </Animated.View>
          <Animated.View
            style={{
              position: 'absolute',
              backgroundColor: 'gray',
              height: 336,
              width: '100%',
              bottom: emojiBottom,
            }}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

export default function test_keyboard() {
  return <TestKeyboard />;
}
