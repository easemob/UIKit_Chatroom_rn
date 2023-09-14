import * as React from 'react';
import { Text, View } from 'react-native';

import { default as Test } from './test_dispatch';

export function AppDev(): JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: 'blue', fontSize: 100 }}>dev ...</Text>
      <Test />
    </View>
  );
}
