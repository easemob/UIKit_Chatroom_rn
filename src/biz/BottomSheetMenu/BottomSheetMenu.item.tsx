import * as React from 'react';
import {
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import type { IconNameType } from '../../assets';
import { g_border_bottom_width } from '../../const';
import { useDispatchContext } from '../../dispatch';
import { ErrorCode, UIKitError } from '../../error';
import { usePaletteContext, useThemeContext } from '../../theme';
import { Icon, IconResolutionType } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { gItemHeight } from './BottomSheetMenu.const';

type ButtonInitState = 'enabled' | 'disabled' | 'warned';
type ButtonState = 'disabled' | 'enabled' | 'pressed' | 'warned';

export type BottomSheetMenuItemProps = {
  id: string;
  initState: ButtonInitState;
  text: string;
  iconName?: IconNameType;
  onPress?: () => void;
  preventHighFrequencyClicks?: boolean;
  frequencyInterval?: number;
  iconResolution?: IconResolutionType;
  containerStyle?: StyleProp<ViewStyle>;
};

export function BottomSheetMenuItem(props: BottomSheetMenuItemProps) {
  console.log('test:BottomSheetMenuItem');
  const {
    id,
    initState,
    iconName,
    onPress,
    preventHighFrequencyClicks,
    frequencyInterval,
    containerStyle,
  } = props;
  const clicked = React.useRef(false);
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  const { emit } = useDispatchContext();
  const disabled = initState === 'disabled' ? true : false;

  const onPressInternal = () => {
    if (preventHighFrequencyClicks === true) {
      if (onPress) {
        if (clicked.current === false) {
          setTimeout(() => {
            clicked.current = false;
          }, frequencyInterval);
          clicked.current = true;
          onPress?.();
        }
      }
    } else {
      onPress?.();
    }
  };

  const getBackgroundColor = () => {
    return {
      disabled: style === 'light' ? colors.neutral[98] : colors.barrage[1],
      enabled: style === 'light' ? colors.neutral[98] : colors.barrage[1],
      pressed: style === 'light' ? colors.neutral[95] : colors.barrage[1],
    };
  };

  return (
    <Pressable
      key={id}
      disabled={disabled}
      onPress={onPressInternal}
      style={(state: PressableStateCallbackType): StyleProp<ViewStyle> => {
        let buttonColors;
        if (state.pressed === true) {
          buttonColors = getBackgroundColor().pressed;
          emit(
            `_$${ItemContent.name}`,
            initState === 'warned' ? 'warned' : 'pressed',
            id
          );
        } else {
          if (disabled === true) {
            buttonColors = getBackgroundColor().disabled;
            emit(`_$${ItemContent.name}`, 'disabled', id);
          } else {
            buttonColors = getBackgroundColor().enabled;
            emit(
              `_$${ItemContent.name}`,
              initState === 'warned' ? 'warned' : 'enabled',
              id
            );
          }
        }
        return [
          {
            backgroundColor: buttonColors,
            justifyContent: iconName ? 'flex-start' : 'center',
            alignItems: 'center',
            height: gItemHeight,
            width: '100%',
          },
          containerStyle,
        ];
      }}
    >
      <ItemContent {...props} />
      <ItemDivider />
    </Pressable>
  );
}

const ItemDivider = () => {
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  return (
    <View
      style={{
        width: '80%',
        borderBottomColor:
          style === 'light' ? colors.neutral[95] : colors.barrage[1],
        borderBottomWidth: g_border_bottom_width,
        justifyContent: 'flex-end',
      }}
    />
  );
};

const ItemContent = (props: BottomSheetMenuItemProps) => {
  console.log('test:BottomSheetMenuItem:ItemContent:');
  const { initState, text, iconName, iconResolution, id: pid } = props;

  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  const { addListener, removeListener } = useDispatchContext();

  const disabled = initState === 'disabled' ? true : false;
  const warned = initState === 'warned' ? true : false;

  const [buttonState, setButtonState] = React.useState<ButtonState>(
    disabled === true ? 'disabled' : warned === true ? 'warned' : 'enabled'
  );

  React.useEffect(() => {
    const listener = (state: ButtonState, id: string) => {
      if (id === pid) {
        setButtonState(state);
      }
    };
    addListener(`_$${ItemContent.name}`, listener);
    return () => {
      removeListener(`_$${ItemContent.name}`, listener);
    };
  }, [addListener, removeListener, pid]);

  const getColor = (state: ButtonState) => {
    const c = {
      disabled: style === 'light' ? colors.neutral[7] : colors.barrage[1],
      enabled: style === 'light' ? colors.primary[5] : colors.barrage[1],
      pressed: style === 'light' ? colors.primary[4] : colors.barrage[1],
      warned: style === 'light' ? colors.error[5] : colors.barrage[1],
    };
    switch (state) {
      case 'warned':
        return c.warned;
      case 'disabled':
        return c.disabled;
      case 'enabled':
        return c.enabled;
      case 'pressed':
        return c.pressed;
      default:
        break;
    }
    throw new UIKitError({ code: ErrorCode.params });
  };

  const getContentText = () => {
    return (
      <Text
        paletteType={'body'}
        textType={'large'}
        style={{ color: getColor(buttonState) }}
      >
        {text}
      </Text>
    );
  };

  if (iconName) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            width: '100%',
            alignItems: 'center',
            paddingLeft: 16,
          }}
        >
          <Icon
            name={iconName}
            style={[
              {
                tintColor: getColor(buttonState),
                height: 22,
                width: 22,
              },
            ]}
            resolution={iconResolution}
          />
          <View style={{ width: 2 }} />
          {getContentText()}
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {getContentText()}
      </View>
    );
  }
};
