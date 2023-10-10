import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Report, seqId, SimulativeModalRef } from 'react-native-chat-room';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ReportScreen(props: Props) {
  const {} = props;
  const ref = React.useRef<SimulativeModalRef>({} as any);
  return (
    <View style={{ flex: 1 }}>
      <Report
        ref={ref}
        data={data}
        containerStyle={{ transform: [{ translateY: -94 }] }} // !!! Correct the offset.
      />
      <View
        style={{
          position: 'absolute', // !!! must
          marginTop: 100,
          height: 60,
          width: 300,
          backgroundColor: 'red',
          // padding: 10,
        }}
      >
        <Pressable
          style={{ height: 60, width: 300, backgroundColor: 'white' }}
          onPress={() => {
            ref.current?.startShow();
          }}
        >
          <Text>{'show report list'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const data = [
  {
    id: seqId('_rp').toString(),
    title: 'Unwelcome commercial content or spam',
    checked: true,
  },
  {
    id: seqId('_rp').toString(),
    title: 'Pornographic or explicit content',
    checked: false,
  },
  {
    id: seqId('_rp').toString(),
    title: 'Child abuse',
    checked: false,
  },
  {
    id: seqId('_rp').toString(),
    title: 'Hate speech or graphic violence',
    checked: false,
  },
  {
    id: seqId('_rp').toString(),
    title: 'Promote terrorism',
    checked: false,
  },
  {
    id: seqId('_rp').toString(),
    title: 'Harassment or bullying',
    checked: false,
  },
];
