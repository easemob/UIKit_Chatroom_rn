import * as React from 'react';
import { Keyboard, LayoutAnimation } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { Platform, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useKeyboardHeight } from '../../hook';
import { KeyboardAvoidingView } from '../../ui/Keyboard';
import { InputBarStyle } from './InputBarStyle';

export type InputBarRef = {
  close: () => void;
};
export type InputBarProps = {
  onInputBarWillShow?: () => void;
  onInputBarWillHide?: () => void;
};

export const InputBar = React.forwardRef<InputBarRef, InputBarProps>(function (
  props: React.PropsWithChildren<InputBarProps>,
  ref: React.ForwardedRef<InputBarRef>
) {
  const { onInputBarWillHide, onInputBarWillShow } = props;
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const keyboardHeight = useKeyboardHeight(true);

  const [isStyle, setIsStyle] = React.useState(true);
  const inputRef = React.useRef<TextInput>({} as any);

  const isClosedEmoji = React.useRef(true);
  const isClosedKeyboard = React.useRef(true);
  const [emojiHeight, setEmojiHeight] = React.useState(0);

  console.log('test:zuoyu:InputBar:', bottom);

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  React.useImperativeHandle(ref, () => {
    return {
      close: () => {
        isClosedEmoji.current = true;
        isClosedKeyboard.current = true;
        setIsStyle(true);
        onInputBarWillHide?.();
        closeKeyboard();
      },
    };
  });

  React.useEffect(() => {
    const getFocus = () => {
      if (inputRef.current.focus) {
        inputRef.current.focus();
      }
    };
    if (isStyle === false) {
      setTimeout(() => {
        getFocus();
      }, 0);
    }
  }, [isStyle]);

  if (isStyle === true) {
    return (
      <InputBarStyle
        onGift={() => {}}
        onInputBar={() => {
          setIsStyle(false);
          onInputBarWillShow?.();
        }}
      />
    );
  }
  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={{ backgroundColor: '#f5f5dc' }}>
          <View style={{ flexDirection: 'row', width: width }}>
            <View
              style={{ width: 40, height: 40, backgroundColor: '#8a2be2' }}
            />
            <View
              style={{
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'center',
              }}
            >
              <TextInput
                ref={inputRef}
                // numberOfLines={4}
                multiline={true}
                style={
                  {
                    // height: gInputBarHeight,
                    // width: '100%',
                    // maxWidth: 295,
                    // maxHeight: gInputBarHeight * 4,
                  }
                }
                onFocus={() => {
                  console.log('test:onFocus:');
                  isClosedKeyboard.current = false;
                  isClosedEmoji.current = false;

                  LayoutAnimation.configureNext({
                    duration: 250, // from keyboard event
                    update: {
                      duration: 250,
                      type: Platform.OS === 'ios' ? 'keyboard' : 'linear',
                    },
                  });
                  setEmojiHeight(
                    Platform.OS === 'ios' ? keyboardHeight - bottom : 0
                  );
                }}
                onBlur={() => {
                  console.log('test:onBlur:');
                  if (isClosedEmoji.current === true) {
                    LayoutAnimation.configureNext({
                      duration: 250, // from keyboard event
                      update: {
                        duration: 250,
                        type: Platform.OS === 'ios' ? 'keyboard' : 'linear',
                      },
                    });
                    setEmojiHeight(
                      Platform.OS === 'ios' ? 0 : keyboardHeight - bottom
                    );
                  } else {
                    setEmojiHeight(keyboardHeight - bottom);
                  }
                }}
              />
            </View>
            <View
              style={{ width: 40, height: 40, backgroundColor: '#8a2be2' }}
              onTouchEnd={() => {
                isClosedEmoji.current = false;
                isClosedKeyboard.current = true;
                closeKeyboard();
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <View style={{ backgroundColor: 'gray', height: emojiHeight }} />
    </>
  );
});
