import * as React from 'react';
import type {
  GestureResponderEvent,
  ImageStyle,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Pressable, PressableStateCallbackType } from 'react-native';

import type { IconNameType } from '../../assets';
import type { ButtonColors } from '../../theme';
import {
  ButtonStateColor,
  usePaletteContext,
  useThemeContext,
} from '../../theme';
import type { PartialDeep } from '../../types';
import { Icon } from '../Image';
import { gMaxTimeout } from './Button.const';

export type IconButtonProps = Pick<PressableProps, 'onPress' | 'disabled'> & {
  style?: StyleProp<ImageStyle> | undefined;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  icon: IconNameType;
  preventHighFrequencyClicks?: boolean;
  frequencyInterval?: number;
  buttonStateColors?: PartialDeep<ButtonStateColor>;
};

export function IconButton(props: IconButtonProps) {
  const {
    style,
    containerStyle,
    preventHighFrequencyClicks = true,
    frequencyInterval = gMaxTimeout,
    disabled,
    onPress,
    icon,
    buttonStateColors,
  } = props;

  const { style: themeStyle } = useThemeContext();
  const { colors } = usePaletteContext();

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

  const buttonState = (): PartialDeep<ButtonStateColor> => {
    if (buttonStateColors) {
      return buttonStateColors;
    }
    return {
      enabled: {
        color: themeStyle === 'light' ? colors.neutral[3] : colors.neutral[95],
        backgroundColor: undefined,
        borderColor: undefined,
      },
      disabled: {
        color: themeStyle === 'light' ? colors.neutral[3] : colors.neutral[95],
        backgroundColor: undefined,
        borderColor: undefined,
      },
      pressed: {
        color: themeStyle === 'light' ? colors.neutral[3] : colors.neutral[95],
        backgroundColor: undefined,
        borderColor: undefined,
      },
    };
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={onPressInternal}
      style={(state: PressableStateCallbackType): StyleProp<ViewStyle> => {
        let buttonColors: ButtonColors;
        if (state.pressed === true) {
          buttonColors = buttonState().pressed?.backgroundColor as any;
        } else {
          if (disabled === true) {
            buttonColors = buttonState().disabled?.backgroundColor as any;
          } else {
            buttonColors = buttonState().enabled?.backgroundColor as any;
          }
        }
        return [
          {
            backgroundColor: buttonColors?.backgroundColor,
            justifyContent: 'center',
            alignItems: 'center',
          },
          containerStyle,
        ];
      }}
    >
      <Icon
        name={icon}
        style={[
          {
            tintColor: buttonState().enabled?.color as any,
          },
          style,
        ]}
      />
    </Pressable>
  );
}
