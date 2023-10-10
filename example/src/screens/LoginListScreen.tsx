import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function LoginListScreen(props: Props) {
  const {} = props;
  const account = require('../env').account as { id: string; token: string }[];
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Text style={{ color: 'red' }}>
          {'Note: Click id to try to log in.'}
        </Text>
        <Text style={{ color: 'red' }}>{'login state: failed.'}</Text>
      </View>
      <ScrollView
        style={{ height: '80%', width: '100%' }}
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {account.map((v, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={{
                width: '90%',
                height: 60,
                marginVertical: 4,
                backgroundColor: '#fff8dc',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
              }}
              onPress={() => {
                // todo:
              }}
            >
              <Text style={{ color: '#8fbc8f', fontSize: 26 }}>{v.id}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={{ flex: 1 }} />
    </View>
  );
}
