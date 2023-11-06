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
import { mergeObjects } from '../utils';
import { getI18nLanguage, getTranslateLanguage } from './Container.hook';

type PartialRoomOption = PartialDeep<RoomOption>;

/**
 * Properties of the Container.
 */
export type ContainerProps = React.PropsWithChildren<{
  /**
   * The application key.
   */
  appKey: string;
  /**
   * Whether to enable the development mode.
   */
  isDevMode?: boolean;
  /**
   * The language code.
   */
  language?: LanguageCode;
  /**
   * The language factory.
   */
  languageFactory?: CreateStringSet;
  /**
   * The palette.
   */
  palette?: Palette;
  /**
   * The theme.
   */
  theme?: Theme;
  /**
   * The room option.
   */
  roomOption?: PartialRoomOption;
  /**
   * IM initialization is completed.
   */
  onInitialized?: () => void;
}>;

/**
 * Entry to the UIKit component library. It will complete initialization, configure custom parameters and other preparations.
 * 
 * **Note** IM will be initialized here. If other UIKit is integrated at the same time, the parameters initialized first shall prevail.
For example: if `chat uikit sdk` and `chat room uikit sdk` are integrated at the same time, then the parameter initialized first will prevail.
 * @param props {@link ContainerProps}
 * @returns JSX.Element
 */
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
    onInitialized,
  } = props;
  const _palette = usePresetPalette();
  const light = useLightTheme(palette ?? _palette);

  const _languageFactory = languageFactory ?? createStringSet;

  return (
    <DispatchContextProvider>
      <PaletteContextProvider value={palette ?? _palette}>
        <ThemeContextProvider value={theme ?? light}>
          <I18nContextProvider
            value={{
              languageCode: getI18nLanguage(language, languageFactory),
              factory: _languageFactory,
            }}
          >
            <IMContextProvider
              value={{
                appKey,
                debugMode: isDevMode,
                onInitialized: onInitialized,
              }}
            >
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
                  languageCode: getTranslateLanguage(language),
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
