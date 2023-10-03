import * as React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { gSearchTimeout } from './MemberList.const';
import { MemberListItem, MemberListItemProps } from './MemberList.item';
import { Search } from './Search';

export type SearchMemberProps = {};

export function SearchMember() {
  const dataRef = React.useRef<MemberListItemProps[]>([
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
    { id: '11' },
    { id: '12' },
    { id: '13' },
    { id: '14' },
    { id: '15' },
    { id: '16' },
    { id: '17' },
    { id: '18' },
    { id: '19' },
    { id: '20' },
    { id: '21' },
  ]);
  const [data, setData] = React.useState<MemberListItemProps[]>(
    dataRef.current
  );
  const [value, setValue] = React.useState('');
  const ds = React.useRef<NodeJS.Timeout | undefined>();

  const execSearch = (key: string) => {
    const ret = dataRef.current.filter((v) => {
      return v.id.includes(key) === true;
    });
    setData([...ret]);
  };

  const deferSearch = async (text: string) => {
    if (ds.current) {
      clearTimeout(ds.current);
      ds.current = undefined;
    }
    ds.current = setTimeout(() => {
      execSearch(text);
    }, gSearchTimeout);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Search
        value={value}
        onChangeText={(v) => {
          setValue(v);
          deferSearch(v);
        }}
        onCancel={function () {
          // todo: go back
        }}
      />
      <FlatList
        data={data}
        renderItem={(info: ListRenderItemInfo<MemberListItemProps>) => {
          const { item } = info;
          return <MemberListItem id={item.id} />;
        }}
        keyExtractor={(item: MemberListItemProps) => {
          return item.id;
        }}
      />
    </SafeAreaView>
  );
}
