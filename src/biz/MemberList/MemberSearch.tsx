import * as React from 'react';
import { View } from 'react-native';

import { usePaletteContext, useThemeContext } from '../../theme';
import { Text1Button } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { TextInput } from '../../ui/TextInput';

export type MemberSearchProps = {
  onCancel: () => {};
  onChangeText?: ((text: string) => void) | undefined;
  value?: string | undefined;
};

export function MemberSearch(props: MemberSearchProps) {
  const { onCancel, onChangeText, value } = props;
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 100,
        backgroundColor: 'yellow',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor:
            style === 'light' ? colors.neutral[98] : colors.neutral[1],
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
              backgroundColor:
                style === 'light' ? colors.neutral[95] : colors.neutral[2],
              justifyContent: 'center',
              borderRadius: 18,
              height: 36,
            }}
            style={{
              paddingLeft: 35,
              color: style === 'light' ? colors.neutral[5] : colors.neutral[5],
            }}
            onChangeText={onChangeText}
            value={value}
          />
          <Icon
            name={'magnifier'}
            style={{
              position: 'absolute',
              left: 8,
              width: 22,
              height: 22,
              tintColor:
                style === 'light' ? colors.neutral[5] : colors.neutral[5],
            }}
          />
        </View>
        <Text1Button
          sizesType={'middle'}
          radiusType={'large'}
          contentType={'only-text'}
          text={'Cancel'}
          onPress={onCancel}
        />
      </View>
    </View>
  );
}
