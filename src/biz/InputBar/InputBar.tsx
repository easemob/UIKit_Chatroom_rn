import * as React from 'react';
import {
  Keyboard,
  LayoutAnimation,
  TextInput as RNTextInput,
} from 'react-native';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconNameType } from '../../assets';
import { usePaletteContext, useThemeContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { KeyboardAvoidingView } from '../../ui/Keyboard';
import { TextInput } from '../../ui/TextInput';
import { timeoutTask } from '../../utils';
import { EmojiListMemo } from '../EmojiList';
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
  const { bottom } = useSafeAreaInsets();
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();

  // const keyboardHeight = useKeyboardHeight(true);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  const [isStyle, setIsStyle] = React.useState(true);
  const inputRef = React.useRef<RNTextInput>({} as any);

  const isClosedEmoji = React.useRef(true);
  const isClosedKeyboard = React.useRef(true);
  const [emojiHeight, _setEmojiHeight] = React.useState(0);

  const [iconName, setIconName] = React.useState<IconNameType>('face');

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  const setEmojiHeight = (h: number) => {
    _setEmojiHeight(h);
  };

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      // setKeyboardHeight(0);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [setKeyboardHeight]);

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

  if (isStyle === true) {
    return (
      <InputBarStyle
        onGift={() => {}}
        onInputBar={() => {
          isClosedEmoji.current = false;
          isClosedKeyboard.current = false;
          setIsStyle(false);
          setIconName('face');
          onInputBarWillShow?.();
          timeoutTask(() => {
            if (inputRef.current.focus) {
              inputRef.current.focus();
            }
          });
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
        <View
          style={{
            backgroundColor:
              style === 'light' ? colors.neutral[98] : colors.neutral[1],
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              margin: 8,
            }}
          >
            <View
              style={{
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'center',
                flexShrink: 1,
                marginHorizontal: 6,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 16,
                  paddingVertical: 7,
                  backgroundColor:
                    style === 'light' ? colors.neutral[95] : colors.neutral[2],
                  borderRadius: 18,
                }}
              >
                <TextInput
                  ref={inputRef}
                  numberOfLines={4}
                  multiline={true}
                  unitHeight={Platform.OS === 'ios' ? 24 : 22}
                  style={{
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 22,
                  }}
                  containerStyle={{
                    width: '100%',
                  }}
                  onFocus={() => {
                    setIconName('face');
                    if (Platform.OS !== 'ios') {
                      setEmojiHeight(0);
                    }
                  }}
                  onBlur={() => {
                    setIconName('keyboard2');
                    LayoutAnimation.configureNext({
                      duration: 250, // from keyboard event
                      update: {
                        duration: 250,
                        type: Platform.OS === 'ios' ? 'keyboard' : 'linear',
                      },
                    });
                    if (isClosedEmoji.current === true) {
                      setEmojiHeight(0);
                    } else {
                      setEmojiHeight(keyboardHeight - bottom);
                    }
                  }}
                />
              </View>
            </View>
            <IconButton
              style={{
                width: 30,
                height: 30,
                tintColor:
                  style === 'light' ? colors.neutral[3] : colors.neutral[95],
              }}
              containerStyle={{
                alignSelf: 'flex-end',
                margin: 6,
              }}
              onPress={() => {
                if (iconName === 'face') {
                  isClosedEmoji.current = false;
                  isClosedKeyboard.current = true;
                  closeKeyboard();
                } else {
                  isClosedKeyboard.current = false;
                  inputRef.current.focus();
                }
              }}
              iconName={iconName}
            />
            <IconButton
              style={{
                width: 30,
                height: 30,
                tintColor:
                  style === 'light' ? colors.primary[5] : colors.primary[6],
                backgroundColor: style === 'light' ? undefined : undefined,
                borderRadius: 30,
              }}
              containerStyle={{
                alignSelf: 'flex-end',
                margin: 6,
              }}
              onPress={() => {}}
              iconName={'airplane'}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <View
        style={{
          backgroundColor:
            style === 'light' ? colors.neutral[98] : colors.neutral[1],
          height: emojiHeight,
          // overflow: 'hidden',
        }}
      >
        <EmojiListMemo style={{ flex: 1 }} onFace={() => {}} />
        <View
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            backgroundColor:
              style === 'light' ? colors.neutral[98] : colors.neutral[1],
            borderRadius: 40,
          }}
        >
          <IconButton
            iconName={'arrow_left_thick'}
            style={{
              width: 40,
              height: 40,
            }}
          />
        </View>
      </View>
    </>
  );
});
