import * as React from 'react';
import { View } from 'react-native';

import { default as Test } from './test_modal';

export function AppDev(): JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <Test />
    </View>
  );
}
