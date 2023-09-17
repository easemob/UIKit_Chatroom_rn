import * as React from 'react';
import { View } from 'react-native';
import { TabPage, TabPageBodyItem } from 'react-native-chat-room';

export function BodyPages(): React.ReactNode[] {
  const list = [1, 2, 3];
  const r = list.map((_, i) => {
    const color = () => {
      if (i === 0) {
        return ['blue', 'red'];
      } else if (i === 1) {
        return ['orange', 'yellow'];
      } else if (i === 2) {
        return ['yellow', 'gray'];
      }
      return [];
    };
    return (
      <TabPageBodyItem key={i} style={{ backgroundColor: color()[0] }}>
        <View style={{ height: 40, backgroundColor: color()[1], margin: 15 }} />
      </TabPageBodyItem>
    );
  });
  return r;
}

export function TestTab() {
  return (
    <View style={{ top: 100 }}>
      <TabPage
        header={{
          // Header: TabPage.DefaultHeader,
          titles: ['1', '2', '3'],
        }}
        body={{
          // Body: TabPage.DefaultBody,
          BodyPages: BodyPages(),
        }}
        // height={300}
        // width={300}
      />
    </View>
  );
}

export default function test_tab() {
  return <TestTab />;
}
