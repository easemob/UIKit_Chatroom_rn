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
import type {
  ColorLineGradientPalette,
  ColorsPalette,
  CornerRadiusPalette,
  createPaletteParams,
  FontsPalette,
  Palette,
} from './types';

export const PaletteContext = React.createContext<Palette | undefined>(
  undefined
);
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

export function createPalette(params: createPaletteParams): Palette {
  const { colors } = params;
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
    cornerRadius: {
      extraSmall: generateExtraSmallCornerRadius(),
      small: generateSmallCornerRadius(),
      medium: generateMediumCornerRadius(),
    } as CornerRadiusPalette,
  } as Palette;
}

export function useCreatePalette(params: createPaletteParams) {
  const palette = React.useMemo(() => createPalette(params), [params]);
  return {
    createPalette: () => palette,
  };
}
