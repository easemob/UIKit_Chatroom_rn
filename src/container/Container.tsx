import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ConfigContextProvider, RoomOption } from '../config';
import { DispatchContextProvider } from '../dispatch';
import {
  CreateStringSet,
  I18nContextProvider,
  LanguageCode,
  languageCodes,
} from '../i18n';
import { createStringSet } from '../i18n/StringSet';
import { IMContextProvider } from '../im';
import {
  Palette,
  PaletteContextProvider,
  Theme,
  ThemeContextProvider,
  useLightTheme,
  usePresetPalette,
} from '../theme';
import type { PartialDeep } from '../types';
import { getSystemLanguage, mergeObjects } from '../utils';

type PartialRoomOption = PartialDeep<RoomOption>;

export type ContainerProps = React.PropsWithChildren<{
  appKey: string;
  isDevMode?: boolean;
  language?: LanguageCode;
  languageFactory?: CreateStringSet;
  palette?: Palette;
  theme?: Theme;
  roomOption?: PartialRoomOption;
}>;

export function Container(props: ContainerProps) {
  const {
    appKey,
    children,
    language,
    languageFactory,
    isDevMode = false,
    palette,
    theme,
    roomOption,
  } = props;
  const _palette = usePresetPalette();
  const light = useLightTheme(palette ?? _palette);

  const _languageFactory = languageFactory ?? createStringSet;

  const getLanguage = (): LanguageCode => {
    let ret = language;
    if (language) {
      const isExisted = languageCodes.includes(language);
      if (isExisted === true) {
        ret = language;
      } else if (isExisted === false && languageFactory) {
        ret = language;
      } else {
        ret = require('../config.local').language as LanguageCode;
      }
    } else {
      const systemLanguage = getSystemLanguage();
      if (systemLanguage?.includes('zh_CN')) {
        ret = 'zh-Hans';
      } else if (systemLanguage?.includes('en')) {
        ret = 'en';
      } else {
        ret = require('../config.local').language as LanguageCode;
      }
    }

    console.log('dev:language:', ret);
    return ret;
  };

  return (
    <DispatchContextProvider>
      <PaletteContextProvider value={palette ?? _palette}>
        <ThemeContextProvider value={theme ?? light}>
          <I18nContextProvider
            value={{
              languageCode: getLanguage(),
              factory: _languageFactory,
            }}
          >
            <IMContextProvider value={{ appKey, debugMode: isDevMode }}>
              <ConfigContextProvider
                value={{
                  isDevMode,
                  enableCompare: false,
                  enableCheckType: false,
                  roomOption: mergeObjects<RoomOption>(
                    roomOption ?? ({} as PartialDeep<RoomOption>),
                    {
                      marquee: {
                        isVisible: true,
                      },
                      gift: {
                        isVisible: true,
                      },
                      messageList: {
                        isVisibleGift: true,
                        isVisibleAvatar: true,
                        isVisibleTag: true,
                        isVisibleTime: true,
                      },
                    } as RoomOption
                  ),
                }}
              >
                <SafeAreaProvider>{children}</SafeAreaProvider>
              </ConfigContextProvider>
            </IMContextProvider>
          </I18nContextProvider>
        </ThemeContextProvider>
      </PaletteContextProvider>
    </DispatchContextProvider>
  );
}
