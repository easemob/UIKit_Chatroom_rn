import * as React from 'react';
import {
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { Pressable, PressableStateCallbackType } from 'react-native';

import type { IconNameType } from '../../assets';
import { ErrorCode, UIKitError } from '../../error';
import type {
  ButtonColors,
  ButtonSizesType,
  ButtonStyleType,
  CornerRadiusPaletteType,
} from '../../theme';
import { Icon } from '../Image';
import { Text } from '../Text';
import {
  useGetButtonRadiusStyle,
  useGetButtonSizeStyle,
  useGetButtonStateStyle,
  useGetButtonStyle,
} from './Button.hooks';

const MAX_TIMEOUT = 500;

export type ButtonProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle> | undefined;
  buttonStyle: ButtonStyleType;
  sizesType: ButtonSizesType;
  radiusType: CornerRadiusPaletteType;
  contentType:
    | 'only-text'
    | 'only-icon'
    | 'icon-text'
    | 'text-icon'
    | 'loading';
  text?: string;
  icon?: IconNameType;
  preventHighFrequencyClicks?: boolean;
  frequencyInterval?: number;
};

export function Button(props: ButtonProps) {
  const {
    style,
    buttonStyle,
    preventHighFrequencyClicks = true,
    frequencyInterval = MAX_TIMEOUT,
    disabled,
    onPress,
    ...others
  } = props;
  const buttonSize = useGetButtonSizeStyle(props);
  const { state: buttonState } = useGetButtonStyle(props);

  const buttonRadius = useGetButtonRadiusStyle(props);
  const clicked = React.useRef(false);

  const onPressInternal = (event: GestureResponderEvent) => {
    if (preventHighFrequencyClicks === true) {
      if (onPress) {
        if (clicked.current === false) {
          setTimeout(() => {
            clicked.current = false;
          }, frequencyInterval);
          clicked.current = true;
          onPress(event);
        }
      }
    } else {
      onPress?.(event);
    }
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPressInternal}
      style={(state: PressableStateCallbackType): StyleProp<ViewStyle> => {
        let buttonColors: ButtonColors;
        if (state.pressed === true) {
          buttonColors = buttonState.pressed;
        } else {
          if (disabled === true) {
            buttonColors = buttonState.disabled;
          } else {
            buttonColors = buttonState.enabled;
          }
        }
        return [
          buttonSize.button,
          {
            backgroundColor: buttonColors.backgroundColor,
            borderRadius: buttonRadius,
            borderWidth: buttonStyle === 'borderButton' ? 1 : undefined,
            borderColor:
              buttonStyle === 'borderButton'
                ? buttonColors.borderColor
                : undefined,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ];
      }}
      {...others}
    >
      <ButtonContent {...props} />
    </Pressable>
  );
}

const ButtonContent = (props: ButtonProps): React.JSX.Element => {
  const { contentType, text, icon } = props;
  const buttonSize = useGetButtonSizeStyle(props);
  const buttonState = useGetButtonStateStyle(props);
  switch (contentType) {
    case 'icon-text':
      return (
        <View style={{ flexDirection: 'row' }}>
          <Icon
            style={[
              {
                width: buttonSize.icon.size,
                height: buttonSize.icon.size,
                tintColor: buttonState.color,
                // backgroundColor: buttonState.backgroundColor,
              },
            ]}
            name={icon ?? 'default'}
          />
          <View style={{ width: 4 }} />
          <Text style={[buttonSize.text, { color: buttonState.color }]}>
            {text}
          </Text>
        </View>
      );
    case 'only-icon':
      return (
        <Icon
          style={[
            {
              width: buttonSize.icon.size,
              height: buttonSize.icon.size,
              tintColor: buttonState.color,
              // backgroundColor: buttonState.backgroundColor,
            },
          ]}
          name={icon ?? 'default'}
        />
      );
    case 'only-text':
      return (
        <Text style={[buttonSize.text, { color: buttonState.color }]}>
          {text}
        </Text>
      );
    case 'text-icon':
      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={[buttonSize.text, { color: buttonState.color }]}>
            {text}
          </Text>
          <Icon
            style={[
              {
                width: buttonSize.icon.size,
                height: buttonSize.icon.size,
                tintColor: buttonState.color,
                // backgroundColor: buttonState.backgroundColor,
              },
            ]}
            name={icon ?? 'default'}
          />
        </View>
      );

    default:
      break;
  }
  throw new UIKitError({
    code: ErrorCode.enum,
    extra: `contentType: ${contentType}`,
  });
};
