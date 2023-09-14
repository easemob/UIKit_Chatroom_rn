import * as React from 'react';
import { Text, View } from 'react-native';
import { I18nContextProvider, useI18nContext } from 'react-native-chat-room';

function I18nComponent(): React.JSX.Element {
  const { tr } = useI18nContext();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{tr('Enabled')}</Text>
      <I18nComponent2 />
    </View>
  );
}

function I18nComponent2(): React.JSX.Element {
  const { tr } = useI18nContext();
  return <Text>{tr('Ts is ${0}', '1')}</Text>;
}

export default function test_i18n() {
  return (
    <I18nContextProvider
      value={{
        stringSetType: 'en',
        stringSet: {
          'Enabled': 'This is Enabled',
          'Ts is ${0}': (first: string) => {
            return `Ts is ${first}`;
          },
        },
      }}
    >
      <I18nComponent />
    </I18nContextProvider>
  );
}
