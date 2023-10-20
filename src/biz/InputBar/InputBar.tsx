import * as React from 'react';
import {
  Keyboard,
  LayoutAnimation,
  Platform,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconNameType } from '../../assets';
import { useColors, useKeyboardHeight } from '../../hook';
import { usePaletteContext, useThemeContext } from '../../theme';
import { IconButtonMemo } from '../../ui/Button';
import { KeyboardAvoidingView } from '../../ui/Keyboard';
import { TextInput } from '../../ui/TextInput';
import { timeoutTask } from '../../utils';
import { EmojiListMemo } from '../EmojiList';
import { DelButtonMemo } from './DelButton';
import { useInputValue } from './InputBar.hooks';
import { InputBarStyle, InputBarStyleProps } from './InputBarStyle';

export type InputBarRef = {
  close: () => void;
};
export type InputBarProps = Omit<InputBarStyleProps, 'onClickInput'> & {
  onInputBarWillShow?: () => void;
  onInputBarWillHide?: () => void;
  onSend: (content: string) => void;
  keyboardVerticalOffset?: number;
};

export const InputBar = React.forwardRef<InputBarRef, InputBarProps>(function (
  props: React.PropsWithChildren<InputBarProps>,
  ref?: React.ForwardedRef<InputBarRef>
) {
  const {
    onInputBarWillHide,
    onInputBarWillShow,
    onSend,
    keyboardVerticalOffset = 0,
    onLayout,
    ...others
  } = props;
  const { bottom } = useSafeAreaInsets();
  const { colors } = usePaletteContext();
  const { style } = useThemeContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    backgroundColor2: {
      light: colors.neutral[95],
      dark: colors.neutral[2],
    },
    tintColor: {
      light: colors.neutral[3],
      dark: colors.neutral[95],
    },
    tintColor2: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
  });

  const keyboardHeight = useKeyboardHeight();

  const [isStyle, _setIsStyle] = React.useState(true);
  const inputRef = React.useRef<RNTextInput>({} as any);

  const isClosedEmoji = React.useRef(true);
  const isClosedKeyboard = React.useRef(true);
  const [emojiHeight, _setEmojiHeight] = React.useState(0);

  const [iconName, setIconName] = React.useState<IconNameType>('face');

  const { value, valueRef, setValue, onFace, onDel } = useInputValue();

  const closeKeyboard = () => {
    Keyboard.dismiss();
  };

  const setIsStyle = (isStyle: boolean) => {
    if (isStyle === false) {
      LayoutAnimation.configureNext({
        duration: 250, // from keyboard event
        update: {
          duration: 10,
          type: Platform.OS === 'ios' ? 'easeIn' : 'easeIn',
        },
      });
    }
    _setIsStyle(isStyle);
  };

  const setEmojiHeight = (h: number) => {
    // if (h === 0) {
    //   LayoutAnimation.configureNext({
    //     duration: 250, // from keyboard event
    //     update: {
    //       duration: 10,
    //       type: Platform.OS === 'ios' ? 'keyboard' : 'easeIn',
    //     },
    //   });
    // }
    _setEmojiHeight(h);
  };

  const _onSend = () => {
    onSend?.(valueRef.current);
    inputRef.current?.clear();
  };

  React.useImperativeHandle(ref, () => {
    return {
      close: () => {
        isClosedEmoji.current = true;
        isClosedKeyboard.current = true;
        setIsStyle(true);
        setEmojiHeight(0);
        onInputBarWillHide?.();
        closeKeyboard();
      },
    };
  });

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <InputBarStyle
          onClickInput={() => {
            isClosedEmoji.current = false;
            isClosedKeyboard.current = false;
            setIsStyle(false);
            setIconName('face');
            onInputBarWillShow?.();
            timeoutTask(() => {
              if (inputRef.current?.focus) {
                inputRef.current?.focus();
              }
            });
          }}
          onLayout={onLayout}
          isShow={isStyle}
          {...others}
        />
        <View
          style={{
            backgroundColor: getColor('backgroundColor'),
            display: isStyle === false ? 'flex' : 'none',
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
                  backgroundColor: getColor('backgroundColor2'),
                  borderRadius: 18,
                }}
              >
                <TextInput
                  ref={inputRef}
                  numberOfLines={4}
                  multiline={true}
                  unitHeight={Platform.OS === 'ios' ? 22 : 22}
                  style={{
                    fontSize: 16,
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 22,
                  }}
                  containerStyle={{
                    width: '100%',
                    minHeight: 22,
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
                      setEmojiHeight(keyboardHeight);
                    }
                  }}
                  onChangeText={setValue}
                  value={value}
                  keyboardAppearance={style === 'light' ? 'light' : 'dark'}
                />
              </View>
            </View>
            <IconButtonMemo
              style={{
                width: 30,
                height: 30,
                tintColor: getColor('tintColor'),
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
                  inputRef.current?.focus();
                }
              }}
              iconName={iconName}
            />
            <IconButtonMemo
              style={{
                width: 30,
                height: 30,
                tintColor: getColor('tintColor2'),
                backgroundColor: undefined,
                borderRadius: 30,
              }}
              containerStyle={{
                alignSelf: 'flex-end',
                margin: 6,
              }}
              onPress={_onSend}
              iconName={'airplane'}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <View
        style={{
          backgroundColor:
            emojiHeight === 0 ? undefined : getColor('backgroundColor'),
          height: emojiHeight,
          // overflow: 'hidden',
          paddingBottom: bottom,
          // display: isStyle === false ? 'flex' : 'none',
        }}
      >
        <EmojiListMemo style={{ flex: 1, marginBottom: 8 }} onFace={onFace} />
        <DelButtonMemo
          getColor={getColor}
          emojiHeight={emojiHeight}
          onClicked={onDel}
        />
      </View>
    </>
  );
});
