import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ConfigContextProvider, RoomOption } from '../config';
import { DispatchContextProvider } from '../dispatch';
import { CreateStringSet, I18nContextProvider, LanguageCode } from '../i18n';
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
    languageFactory = createStringSet,
    isDevMode = false,
    palette,
    theme,
    roomOption,
  } = props;
  const _palette = usePresetPalette();
  const light = useLightTheme(palette ?? _palette);

  const getLanguage = (): LanguageCode => {
    if (language) {
      return language;
    }
    const systemLanguage = getSystemLanguage();
    if (systemLanguage?.includes('zh_CN')) {
      return 'zh-Hans';
    }
    return 'en';
  };

  return (
    <DispatchContextProvider>
      <PaletteContextProvider value={palette ?? _palette}>
        <ThemeContextProvider value={theme ?? light}>
          <I18nContextProvider
            value={{
              languageCode: getLanguage(),
              factory: languageFactory,
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
