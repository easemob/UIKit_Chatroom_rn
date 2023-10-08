import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ConfigContextProvider } from '../config';
import { DispatchContextProvider } from '../dispatch';
import { I18nContextProvider, StringSetType } from '../i18n';
import { IMContextProvider } from '../im';
import {
  createLightTheme,
  createPresetPalette,
  Palette,
  PaletteContextProvider,
  Theme,
  ThemeContextProvider,
} from '../theme';

export type ContainerProps = React.PropsWithChildren<{
  appKey: string;
  isDevMode?: boolean;
  Language?: StringSetType;
  palette?: Palette;
  theme?: Theme;
}>;

export function Container(props: ContainerProps) {
  const {
    appKey,
    children,
    Language,
    isDevMode = false,
    palette,
    theme,
  } = props;
  const _palette = createPresetPalette();
  const light = createLightTheme(palette ?? _palette);

  return (
    <DispatchContextProvider>
      <PaletteContextProvider value={palette ?? _palette}>
        <ThemeContextProvider value={theme ?? light}>
          <I18nContextProvider value={{ stringSetType: Language ?? 'en' }}>
            <IMContextProvider value={{ appKey, debugMode: isDevMode }}>
              <ConfigContextProvider value={{ isDevMode }}>
                <SafeAreaProvider>{children}</SafeAreaProvider>
              </ConfigContextProvider>
            </IMContextProvider>
          </I18nContextProvider>
        </ThemeContextProvider>
      </PaletteContextProvider>
    </DispatchContextProvider>
  );
}
