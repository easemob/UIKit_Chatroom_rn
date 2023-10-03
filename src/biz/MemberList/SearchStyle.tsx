import * as React from 'react';
import { Pressable, View } from 'react-native';

import { usePaletteContext, useThemeContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';

export function SearchStyle({ onPress }: { onPress: () => void }) {
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  return (
    <View
      style={{
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 4,
      }}
    >
      <Pressable onPress={onPress}>
        <View
          style={{
            flexDirection: 'row',
            borderRadius: 18,
            height: 36,
            paddingVertical: 7,
            width: '100%',
            backgroundColor:
              style === 'light' ? colors.neutral[95] : colors.neutral[2],
            justifyContent: 'center',
          }}
        >
          <Icon
            name={'magnifier'}
            style={{
              width: 22,
              height: 22,
              tintColor:
                style === 'light' ? colors.neutral[6] : colors.neutral[4],
            }}
          />
          <View style={{ width: 4 }} />
          <Text
            textType={'large'}
            paletteType={'body'}
            style={{
              color: style === 'light' ? colors.neutral[6] : colors.neutral[4],
            }}
          >
            {'Search'}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
