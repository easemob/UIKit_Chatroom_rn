import * as React from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';

type MemberListItemProps = { id: string };

export function MemberListParticipants() {
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
  ]);
  const [data] = React.useState<MemberListItemProps[]>(dataRef.current);

  return (
    <View
      style={{
        height: 300,
      }}
    >
      <FlatList
        data={data}
        renderItem={(info: ListRenderItemInfo<MemberListItemProps>) => {
          const { item } = info;
          return (
            <View
              key={item.id}
              style={{
                backgroundColor: 'yellow',
                margin: 1,
              }}
            >
              <Text>{item.id + 'sdlkfjsdlfksdjflskdjf'}</Text>
            </View>
          );
        }}
        keyExtractor={(item: MemberListItemProps) => {
          return item.id;
        }}
      />
    </View>
  );
}

export function MemberListItem(): React.JSX.Element {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'green',
        width: '100%',
        marginTop: 100,
      }}
    >
      <View
        style={
          {
            // flex: 1, // Not setting this will cause the FlatList to not scroll.
          }
        }
      >
        <View style={{ position: 'absolute' }}>
          <MemberListParticipants />
        </View>
      </View>
    </View>
  );
}

export default function test_flatlist() {
  return <MemberListItem />;
}
