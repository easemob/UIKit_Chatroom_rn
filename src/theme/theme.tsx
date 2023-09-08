import * as React from 'react';

import { ErrorCode, UIKitError } from '../error';
import { createDarkTheme } from './theme.dark';
import { createLightTheme } from './theme.light';
import type { createThemeParams, Theme } from './types';

const ThemeContext = React.createContext<Theme | undefined>(undefined);
ThemeContext.displayName = 'UIKitThemeContext';

type ThemeContextProps = React.PropsWithChildren<{ value: Theme }>;

export function ThemeContextProvider({ value, children }: ThemeContextProps) {
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeContext(): Theme {
  const theme = React.useContext(ThemeContext);
  if (!theme) throw Error(`${ThemeContext.displayName} is not provided`);
  return theme;
}

export function createTheme(params: createThemeParams): Theme {
  const { palette, themeType } = params;
  switch (themeType) {
    case 'light':
      return createDarkTheme(palette);
    case 'dark':
      return createLightTheme(palette);
    default:
      throw new UIKitError({
        code: ErrorCode.common,
      });
  }
}
