import * as React from 'react';

import { createTheme, useCreateTheme } from './theme';
import type { Palette, Theme, ThemeType } from './types';

export function createLightTheme(palette: Palette): Theme {
  return createTheme({ palette, themeType: 'light' });
}
export function useLightTheme(palette: Palette): Theme {
  const params = React.useMemo(() => {
    return { palette, themeType: 'light' as ThemeType };
  }, [palette]);
  const { createTheme } = useCreateTheme(params);
  return createTheme();
}
