import * as React from 'react';
import {
  ColorValue,
  Keyboard,
  LayoutAnimation,
  Platform,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { IconNameType } from '../../assets';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { KeyboardAvoidingView } from '../../ui/Keyboard';
import { TextInput } from '../../ui/TextInput';
import { timeoutTask } from '../../utils';
import { EmojiListMemo } from '../EmojiList';
import { InputBarStyle, InputBarStyleProps } from './InputBarStyle';

export type InputBarRef = {
  close: () => void;
};
export type InputBarProps = Omit<InputBarStyleProps, 'onInputBar'> & {
  onInputBarWillShow?: () => void;
  onInputBarWillHide?: () => void;
};

export const InputBar = React.forwardRef<InputBarRef, InputBarProps>(function (
  props: React.PropsWithChildren<InputBarProps>,
  ref: React.ForwardedRef<InputBarRef>
) {
  const { onInputBarWillHide, onInputBarWillShow, ...others } = props;
  const { bottom } = useSafeAreaInsets();
  const { colors } = usePaletteContext();
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
        {...others}
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
            backgroundColor: getColor('backgroundColor'),
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
                    // backgroundColor: 'red',
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
                  inputRef.current.focus();
                }
              }}
              iconName={iconName}
            />
            <IconButton
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
              onPress={() => {}}
              iconName={'airplane'}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
      <View
        style={{
          backgroundColor: getColor('backgroundColor'),
          height: emojiHeight,
          // overflow: 'hidden',
        }}
      >
        <EmojiListMemo style={{ flex: 1 }} onFace={() => {}} />
        <DelButton
          getColor={getColor}
          emojiHeight={emojiHeight}
          onClicked={() => {
            // todo:
          }}
        />
      </View>
    </>
  );
});

const DelButton = (params: {
  getColor: (key: string) => ColorValue | undefined;
  emojiHeight: number;
  onClicked: () => void;
}) => {
  const { getColor, emojiHeight, onClicked } = params;
  const b = (
    <View
      style={{
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: getColor('backgroundColor'),
        borderRadius: 40,
      }}
    >
      <IconButton
        iconName={'arrow_left_thick'}
        style={{
          width: 40,
          height: 40,
        }}
        onPress={onClicked}
      />
    </View>
  );
  if (Platform.OS === 'ios') {
    return b;
  } else {
    if (emojiHeight === 0) {
      return null;
    }
    return b;
  }
};
