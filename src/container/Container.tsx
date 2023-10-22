import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ConfigContextProvider, RoomOption } from '../config';
import { DispatchContextProvider } from '../dispatch';
import { I18nContextProvider, StringSetType } from '../i18n';
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

type PartialRoomOption = PartialDeep<RoomOption>;

export type ContainerProps = React.PropsWithChildren<{
  appKey: string;
  isDevMode?: boolean;
  Language?: StringSetType;
  palette?: Palette;
  theme?: Theme;
  roomOption?: PartialRoomOption;
}>;

export function Container(props: ContainerProps) {
  const {
    appKey,
    children,
    Language,
    isDevMode = false,
    palette,
    theme,
    roomOption,
  } = props;
  const _palette = usePresetPalette();
  const light = useLightTheme(palette ?? _palette);

  return (
    <DispatchContextProvider>
      <PaletteContextProvider value={palette ?? _palette}>
        <ThemeContextProvider value={theme ?? light}>
          <I18nContextProvider value={{ stringSetType: Language ?? 'en' }}>
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
