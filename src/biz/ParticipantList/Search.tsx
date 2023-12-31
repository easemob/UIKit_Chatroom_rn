import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext, useThemeContext } from '../../theme';
import { Text1Button } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { TextInput } from '../../ui/TextInput';

export type SearchProps = {
  onCancel: () => void;
  onChangeText?: ((text: string) => void) | undefined;
  value?: string | undefined;
};

export function Search(props: SearchProps) {
  const { onCancel, onChangeText, value } = props;
  const { tr } = useI18nContext();
  const { style } = useThemeContext();
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
    color: {
      light: colors.neutral[5],
      dark: colors.neutral[5],
    },
    text: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
  });
  return (
    <View
      style={
        {
          // flex: 1,
          // paddingTop: 100,
        }
      }
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: getColor('backgroundColor'),
          paddingLeft: 16,
          paddingRight: 8,
        }}
      >
        <View
          style={{
            height: 44,
            justifyContent: 'center',
            flex: 1,
          }}
        >
          <TextInput
            containerStyle={{
              backgroundColor: getColor('backgroundColor2'),
              justifyContent: 'center',
              borderRadius: 18,
              height: 36,
            }}
            style={{
              paddingLeft: 35,
              color: getColor('text'),
            }}
            onChangeText={onChangeText}
            value={value}
            keyboardAppearance={style === 'light' ? 'light' : 'dark'}
          />
          <Icon
            name={'magnifier'}
            style={{
              position: 'absolute',
              left: 8,
              width: 22,
              height: 22,
              tintColor: getColor('color'),
            }}
          />
        </View>
        <Text1Button
          sizesType={'middle'}
          radiusType={'large'}
          contentType={'only-text'}
          text={tr('Cancel')}
          onPress={onCancel}
        />
      </View>
    </View>
  );
}
