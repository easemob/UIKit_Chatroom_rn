import * as React from 'react';
import { View } from 'react-native';

import { default as Test } from './test_textinput';

// if (
//   Platform.OS === 'android' &&
//   UIManager.setLayoutAnimationEnabledExperimental
// ) {
//   console.log('test:zuoyu:setLayoutAnimationEnabledExperimental');
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

export function AppDev(): JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <Test />
    </View>
  );
  // return (
  //   <React.StrictMode>
  //     <View style={{ flex: 1 }}>
  //       <Test />
  //     </View>
  //   </React.StrictMode>
  // );
}
