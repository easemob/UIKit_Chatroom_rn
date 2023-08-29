import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { multiply } from 'react-native-chat-room';

import { AppDev } from './__dev__/AppDev';

export function App() {
  const [result, setResult] = React.useState<number | undefined>();

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

let AppWrapper = App;
try {
  const isDev = require('./env').test;
  if (isDev === true) {
    AppWrapper = AppDev;
  }
} catch (error) {
  console.warn(error);
}

export default AppWrapper;
