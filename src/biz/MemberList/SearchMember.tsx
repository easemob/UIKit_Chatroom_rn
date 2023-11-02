import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Image } from '../../ui/Image';
import type { PropsWithError, PropsWithTest } from '../types';
import { useSearchMemberListAPI } from './MemberList.hooks';
import { MemberListItemMemo, MemberListItemProps } from './MemberList.item';
import { Search } from './Search';
import type { MemberListType } from './types';

/**
 * Properties of the `MemberList` component.
 */
export type SearchMemberProps = {
  /**
   * List type. {@link MemberListType}
   */
  memberType: MemberListType;
  /**
   * Callback function when cancel button is clicked.
   */
  onRequestClose: () => void;
} & PropsWithTest &
  PropsWithError;

/**
 * Search member components.
 * @param props {@link SearchMemberProps}
 * @returns React.JSX.Element
 */
export function SearchMember(props: SearchMemberProps) {
  const { onRequestClose, memberType } = props;
  const [value, setValue] = React.useState('');
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    backgroundColor2: {
      light: colors.neutral[8],
      dark: colors.neutral[3],
    },
  });
  const { _data, deferSearch } = useSearchMemberListAPI({
    memberType,
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: getColor('backgroundColor'),
      }}
    >
      <Search
        value={value}
        onChangeText={(v) => {
          setValue(v);
          deferSearch(v);
        }}
        onCancel={function () {
          onRequestClose();
        }}
      />
      <FlatList
        data={_data}
        renderItem={(info: ListRenderItemInfo<MemberListItemProps>) => {
          const { item } = info;
          return <MemberListItemMemo {...item} />;
        }}
        keyExtractor={(item: MemberListItemProps) => {
          return item.id;
        }}
        ListEmptyComponent={EmptyBlank}
      />
    </SafeAreaView>
  );
}

const EmptyBlank = () => {
  const { height: winHeight } = useWindowDimensions();
  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        height: winHeight - 94,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Image
        source={require('../../assets/bg/blank.png')}
        style={{ height: 140 }}
        resizeMode={'contain'}
      />
    </View>
  );
};
