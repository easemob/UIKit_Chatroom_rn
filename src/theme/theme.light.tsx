import { generateButton } from './generate.button';
import type { Palette, Theme } from './types';

export function createLightTheme(palette: Palette): Theme {
  return {
    style: 'light',
    button: generateButton({
      palette: palette,
      themeType: 'light',
    }),
  };
}
