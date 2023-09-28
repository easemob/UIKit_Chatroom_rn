import { generateButton } from './generate.button';
import { generateShadow } from './generate.shadow';
import type { Palette, Theme } from './types';

export function createLightTheme(palette: Palette): Theme {
  return {
    style: 'light',
    button: generateButton({
      palette: palette,
      themeType: 'light',
    }),
    shadow: generateShadow({
      palette: palette,
      themeType: 'light',
    }),
  };
}
