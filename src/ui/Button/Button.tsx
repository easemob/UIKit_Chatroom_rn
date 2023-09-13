import * as React from 'react';
import {
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { Pressable, PressableStateCallbackType } from 'react-native';
import type { IconNameType } from 'src/assets';

import { ErrorCode, UIKitError } from '../../error';
import { FontStyles, IconStyles, useThemeContext } from '../../theme';
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
import { Icon } from '../Image';
import { Text } from '../Text';

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

const useGetButtonSizeStyle = (
  props: ButtonProps
): {
  button: ButtonSize;
  text: FontStyles;
  icon: IconStyles;
} => {
  const { button } = useThemeContext();
  const { sizesType, contentType } = props;
  type RetType = ReturnType<typeof useGetButtonSizeStyle>;

  const trimming = (params: RetType) => {
    const ret = params;
    switch (contentType) {
      case 'only-icon':
        ret.button.paddingHorizontal = ret.button.paddingVertical;
        break;
      case 'icon-text':
      case 'only-text':
      case 'text-icon':
        break;

      default:
        break;
    }
    return ret;
  };

  switch (sizesType) {
    case 'small':
      return button.size.small as RetType;
    case 'middle':
      return button.size.middle as RetType;
    case 'large':
      return trimming(button.size.large as RetType);

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
