import * as React from 'react';

import { generateButton } from './generate.button';
import { generateShadow } from './generate.shadow';
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
  return {
    style: themeType,
    button: generateButton({
      palette: palette,
      themeType: themeType,
    }),
    shadow: generateShadow({
      palette: palette,
      themeType: themeType,
    }),
  };
}

export function useCreateTheme(params: createThemeParams) {
  const theme = React.useMemo(() => createTheme(params), [params]);
  return {
    createTheme: () => theme,
  };
}
