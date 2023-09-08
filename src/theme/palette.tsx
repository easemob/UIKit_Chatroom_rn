import * as React from 'react';

import {
  generateBarrageColor,
  generateNeutralColor,
  generateNeutralSpecialColor,
  generatePrimaryColor,
} from './generate.color';
import {
  generateExtraSmallCornerRadius,
  generateMediumCornerRadius,
  generateSmallCornerRadius,
} from './generate.cr';
import {
  generateBodyFont,
  generateHeadlineFont,
  generateLabelFont,
  generateTitleFont,
} from './generate.font';
import { generateLineGradientPoint } from './generate.gradient';
import {
  generateLargeShadow,
  generateMiddleShadow,
  generateSmallShadow,
} from './generate.shadow';
import type {
  ColorLineGradientPalette,
  ColorsPalette,
  CornerRadiusPalette,
  createPaletteParams,
  createShadowParams,
  FontsPalette,
  Palette,
  ShadowPalette,
} from './types';

const PaletteContext = React.createContext<Palette | undefined>(undefined);
PaletteContext.displayName = 'UIKitPaletteContextContext';

type PaletteContextProps = React.PropsWithChildren<{ value: Palette }>;

export function PaletteContextProvider({
  value,
  children,
}: PaletteContextProps) {
  return (
    <PaletteContext.Provider value={value}>{children}</PaletteContext.Provider>
  );
}

export function usePaletteContext(): Palette {
  const palette = React.useContext(PaletteContext);
  if (!palette) throw Error(`${PaletteContext.displayName} is not provided`);
  return palette;
}

function createShadow(params: createShadowParams): ShadowPalette {
  const { color1, color2 } = params;
  return {
    small: generateSmallShadow(color1, color2),
    middle: generateMiddleShadow(color1, color2),
    large: generateLargeShadow(color1, color2),
  };
}

export function createPalette(params: createPaletteParams): Palette {
  const { colors, shadow } = params;
  return {
    colors: {
      primary: generatePrimaryColor(colors.primary),
      secondary: generatePrimaryColor(colors.secondary),
      error: generatePrimaryColor(colors.error),
      neutral: generateNeutralColor(colors.neutral),
      neutralSpecial: generateNeutralSpecialColor(colors.neutralSpecial),
      barrage: generateBarrageColor(),
    } as ColorsPalette,
    fonts: {
      headline: generateHeadlineFont(),
      title: generateTitleFont(),
      label: generateLabelFont(),
      body: generateBodyFont(),
    } as FontsPalette,
    lineGradient: {
      topToBottom: generateLineGradientPoint('topToBottom'),
      bottomToTop: generateLineGradientPoint('bottomToTop'),
      leftToRight: generateLineGradientPoint('leftToRight'),
      rightToLeft: generateLineGradientPoint('rightToLeft'),
      leftTopToRightBottom: generateLineGradientPoint('leftTopToRightBottom'),
      leftBottomToRightTop: generateLineGradientPoint('leftBottomToRightTop'),
      rightTopToLeftBottom: generateLineGradientPoint('rightTopToLeftBottom'),
      rightBottomToLeftTop: generateLineGradientPoint('rightBottomToLeftTop'),
    } as ColorLineGradientPalette,
    shadow: createShadow(shadow),
    cornerRadius: {
      extraSmall: generateExtraSmallCornerRadius(),
      small: generateSmallCornerRadius(),
      medium: generateMediumCornerRadius(),
    } as CornerRadiusPalette,
  } as Palette;
}
