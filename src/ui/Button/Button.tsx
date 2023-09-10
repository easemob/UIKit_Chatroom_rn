import * as React from 'react';
import type {
  GestureResponderEvent,
  TouchableOpacityProps,
} from 'react-native';
import { Pressable, PressableStateCallbackType } from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
import { FontProps, IconProps, useThemeContext } from '../../theme';
import {
  ButtonColors,
  ButtonSize,
  ButtonSizesType,
  ButtonStateColor,
  ButtonStateColorType,
  ButtonStyleType,
  CornerRadiusPaletteType,
  usePaletteContext,
} from '../../theme';
import { Text } from '../Text';

const MAX_TIMEOUT = 500;

export type ButtonProps = TouchableOpacityProps & {
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
  icon?: string;
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
      style={(state: PressableStateCallbackType) => {
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
  const { contentType, text } = props;
  const buttonSize = useGetButtonSizeStyle(props);
  const buttonState = useGetButtonStateStyle(props);
  switch (contentType) {
    case 'icon-text':
      break;
    case 'only-icon':
      break;
    case 'only-text':
      return (
        <Text style={[buttonSize.text, { color: buttonState.color }]}>
          {text}
        </Text>
      );
    case 'text-icon':
      break;

    default:
      break;
  }
  throw new UIKitError({
    code: ErrorCode.enum,
    extra: `contentType: ${contentType}`,
  });
};

const useGetButtonSizeStyle = (
  props: ButtonProps
): {
  button: ButtonSize;
  text: FontProps;
  icon: IconProps;
} => {
  const { button } = useThemeContext();
  const { sizesType } = props;
  type RetType = ReturnType<typeof useGetButtonSizeStyle>;
  switch (sizesType) {
    case 'small':
      return button.size.small as RetType;
    case 'middle':
      return button.size.middle as RetType;
    case 'large':
      return button.size.large as RetType;

    default:
      break;
  }
  throw new UIKitError({
    code: ErrorCode.enum,
    extra: `ButtonSizesType: ${sizesType}`,
  });
};
const useGetButtonStyle = (
  props: ButtonProps
): {
  state: ButtonStateColor;
} => {
  const { buttonStyle } = props;
  const { button } = useThemeContext();
  switch (buttonStyle) {
    case 'borderButton':
      return button.style.borderButton;
    case 'commonButton':
      return button.style.commonButton;
    case 'textButton1':
      return button.style.textButton1;
    case 'textButton2':
      return button.style.textButton2;
    default:
      break;
  }
  throw new UIKitError({
    code: ErrorCode.enum,
    extra: `ButtonStyleType: ${buttonStyle}`,
  });
};
const useGetButtonStateStyle = (props: ButtonProps): ButtonColors => {
  const { disabled } = props;
  const stateType = React.useRef<ButtonStateColorType>(
    disabled === true ? 'disabled' : 'enabled'
  ).current;
  const { state } = useGetButtonStyle(props);
  switch (stateType) {
    case 'disabled':
      return state.disabled;
    case 'enabled':
      return state.enabled;
    case 'loading':
      return state.loading;
    case 'pressed':
      return state.pressed;

    default:
      break;
  }
  throw new UIKitError({
    code: ErrorCode.enum,
    extra: `ButtonStateColorType: ${stateType}`,
  });
};
const useGetButtonRadiusStyle = (props: ButtonProps) => {
  const { radiusType } = props;
  const { button } = useThemeContext();
  const { cornerRadius } = usePaletteContext();
  switch (radiusType) {
    case 'extraSmall':
      return cornerRadius.extraSmall;
    case 'small':
      return cornerRadius.small;
    case 'medium':
      return cornerRadius.medium;
    case 'large':
      return button.size.large.button.height as number;

    default:
      break;
  }
  return undefined;
};
