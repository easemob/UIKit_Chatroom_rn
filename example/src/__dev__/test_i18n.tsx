import * as React from 'react';
import { Text, View } from 'react-native';
import {
  Container,
  createDarkTheme,
  createLightTheme,
  createPresetPalette,
  LanguageCode,
  StringSet,
  useI18nContext,
} from 'react-native-chat-room';

export function I18nComponent(): React.JSX.Element {
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

function I18nComponent3(): React.JSX.Element {
  const { tr } = useI18nContext();
  return (
    <View style={{ top: 100 }}>
      <Text>{tr('French text.')}</Text>
    </View>
  );
}

function createLanguage(type: LanguageCode): StringSet {
  console.log('test:zuoyu:createLanguage:', type);
  if (type === 'fr') {
    return {
      'French text.': 'Texte français.',
    };
  }
  return {
    'French text.': 'French text.',
  };
}

export default function test_i18n() {
  const pal = createPresetPalette();
  const dark = createDarkTheme(pal);
  const light = createLightTheme(pal);

  return (
    <Container
      appKey={'sdf'}
      palette={pal}
      theme={light ? light : dark}
      language={'fr'}
      languageFactory={createLanguage}
    >
      <I18nComponent3 />
    </Container>
  );
}
