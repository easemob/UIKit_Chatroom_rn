import type { TextStyle } from 'react-native';
import type { ColorValue, ViewStyle } from 'react-native';

import type { Keyof } from '../types';

export type Colors = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  95: string;
  98: string;
  100: string;
};

export type ColorsPalette = {
  primary: Colors;
  secondary: Colors;
  error: Colors;
  neutral: Colors;
  neutralSpecial: Colors;
  barrage: Colors;
};

export type FontProps = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight'
>;

export type Fonts = {
  large: FontProps;
  medium: FontProps;
  small: FontProps;
  extraSmall?: FontProps;
};

export type FontsPalette = {
  headline: Fonts;
  title: Fonts;
  label: Fonts;
  body: Fonts;
};

export type GradientPoint = {
  x: number; // [0 - 1]
  y: number; // [0 - 1]
};

export type LineGradientPoint = {
  start: GradientPoint;
  end: GradientPoint;
};

export type ColorLineGradientDirection = Keyof<ColorLineGradientPalette>;

export type ColorLineGradientPalette = {
  topToBottom: LineGradientPoint; // ⬇️
  bottomToTop: LineGradientPoint; // ⬆️
  leftToRight: LineGradientPoint; // ➡️
  rightToLeft: LineGradientPoint; // ⬅️
  leftTopToRightBottom: LineGradientPoint; // ↘️
  rightTopToLeftBottom: LineGradientPoint; // ↙️
  rightBottomToLeftTop: LineGradientPoint; // ↖️
  leftBottomToRightTop: LineGradientPoint; // ↗️
};

export type ShadowDesc = {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
};

export type ShadowPalette = {
  small: ShadowDesc[];
  middle: ShadowDesc[];
  large: ShadowDesc[];
};

export type CornerRadiusPaletteType = Keyof<CornerRadiusPalette>;

export type CornerRadiusPalette = {
  extraSmall: number;
  small: number;
  medium: number;
  large?: number;
};

export interface Palette {
  colors: ColorsPalette;
  fonts: FontsPalette;
  lineGradient: ColorLineGradientPalette;
  shadow: ShadowPalette;
  cornerRadius: CornerRadiusPalette;
}

export type ButtonColors = {
  color?: ColorValue | undefined;
  backgroundColor?: ColorValue | undefined;
  borderColor?: ColorValue | undefined;
};

export type ButtonSize = Pick<
  ViewStyle,
  | 'borderWidth'
  | 'borderRadius'
  | 'height'
  | 'minWidth'
  | 'maxWidth'
  | 'paddingHorizontal'
  | 'paddingVertical'
  | 'width'
>;

export type ButtonSizes = {
  small: {
    button: ButtonSize;
    text: FontProps;
  };
  middle: {
    button: ButtonSize;
    text: FontProps;
  };
  large: {
    button: ButtonSize;
    text: FontProps;
  };
};

export type ButtonStateColor = {
  enabled: ButtonColors;
  disabled: ButtonColors;
  pressed: ButtonColors;
  loading: ButtonColors;
};

export type ButtonStyleType = Keyof<ButtonStyle>;

export type ButtonStyle = {
  commonButton: {
    state: ButtonStateColor;
    sizes: ButtonSizes;
  };
  textButton: {
    state: ButtonStateColor;
    sizes: ButtonSizes;
  };
  borderButton: {
    state: ButtonStateColor;
    sizes: ButtonSizes;
  };
};

export interface Theme {
  button: ButtonStyle;
}

export type createShadowParams = {
  color1: string;
  color2: string;
};

export type createPaletteParams = {
  colors: {
    primary: number;
    secondary: number;
    error: number;
    neutral: number;
    neutralSpecial: number;
  };
  shadow: {
    color1: string;
    color2: string;
  };
};

export type ThemeType = 'light' | 'dark';

export type createThemeParams = {
  palette: Palette;
  themeType: ThemeType;
};
