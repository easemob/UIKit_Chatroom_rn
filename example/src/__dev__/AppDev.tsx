import * as React from 'react';
import { Text, View } from 'react-native';

export function AppDev(): JSX.Element {
  console.log('test:zuoyu:');
  return (
    <View style={{ backgroundColor: 'red', flex: 1 }}>
      <Text style={{ color: 'blue', fontSize: 100 }}>dev ...</Text>
    </View>
  );
}
