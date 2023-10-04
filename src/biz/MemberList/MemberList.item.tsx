import * as React from 'react';
import { View } from 'react-native';

import { g_flatlist_border_bottom_width } from '../../const';
import { usePaletteContext, useThemeContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';

export type MemberListItemProps = {
  id: string;
};

export function MemberListItem(props: MemberListItemProps) {
  const { style } = useThemeContext();
  const { colors } = usePaletteContext();
  const { id } = props;
  return (
    <View
      key={id}
      style={{
        backgroundColor:
          style === 'light' ? colors.neutral[98] : colors.neutral[1],
        paddingHorizontal: 10,
        width: '100%',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon
          name={'crown1'}
          style={{
            width: 22,
            height: 22,
            tintColor: 'orange',
            margin: 4,
          }}
        />

        <View style={{ width: 12 }} />
        <Avatar url={'https://note?'} size={40} borderRadius={40} />
        <View style={{ width: 12 }} />
        <View style={{ marginVertical: 10 }}>
          <Text
            textType={'medium'}
            paletteType={'title'}
            style={{
              color: style === 'light' ? colors.neutral[1] : colors.neutral[98],
            }}
          >
            {'NickName'}
          </Text>
          <Text
            textType={'medium'}
            paletteType={'body'}
            style={{
              color: style === 'light' ? colors.neutral[5] : colors.neutral[6],
            }}
          >
            {'Role'}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <IconButton
          iconName={'ellipsis_vertical'}
          style={{
            tintColor:
              style === 'light' ? colors.neutral[5] : colors.neutral[6],
            width: 24,
            height: 24,
            margin: 4,
          }}
        />
      </View>
      <View
        style={{
          // height: 0.5,
          borderBottomWidth: g_flatlist_border_bottom_width,
          backgroundColor:
            style === 'light' ? colors.neutral[5] : colors.neutral[6],
          marginLeft: 50,
        }}
      />
    </View>
  );
}
