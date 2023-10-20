import * as React from 'react';
import { View } from 'react-native';

import { g_flatlist_border_bottom_width } from '../../const';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { IconButton } from '../../ui/Button';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { Avatar } from '../Avatar';
import { gMemberListItemHeight } from './MemberList.const';
import type { MemberListIteModel } from './types';

export type MemberListItemProps = {
  id: string;
  userInfo: MemberListIteModel;
};

export function MemberListItem(props: MemberListItemProps) {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    color: {
      light: colors.neutral[1],
      dark: colors.neutral[98],
    },
    color2: {
      light: colors.neutral[6],
      dark: colors.neutral[5],
    },
    color3: {
      light: colors.neutral[9],
      dark: colors.neutral[2],
    },
  });
  const { id, userInfo } = props;
  return (
    <View
      key={id}
      style={{
        backgroundColor: getColor('backgroundColor'),
        paddingHorizontal: 10,
        width: '100%',
        height: gMemberListItemHeight,
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
        <Avatar
          url={userInfo.avatarURL ?? 'https://no-existed?'}
          size={40}
          borderRadius={40}
        />
        <View style={{ width: 12 }} />
        <View style={{ marginVertical: 10 }}>
          <Text
            textType={'medium'}
            paletteType={'title'}
            style={{
              color: getColor('color'),
            }}
          >
            {userInfo?.nickName ?? userInfo.userId}
          </Text>
          {/* <Text
            textType={'medium'}
            paletteType={'body'}
            style={{
              color: getColor('color2'),
            }}
          >
            {'Role'}
          </Text> */}
        </View>
        <View style={{ flex: 1 }} />
        <IconButton
          iconName={'ellipsis_vertical'}
          style={{
            tintColor: getColor('color2'),
            width: 24,
            height: 24,
            margin: 4,
          }}
        />
      </View>
      <View
        style={{
          backgroundColor: getColor('color2'),
          height: g_flatlist_border_bottom_width,
          marginLeft: 50,
        }}
      />
    </View>
  );
}

export const MemberListItemMemo = React.memo(MemberListItem);
