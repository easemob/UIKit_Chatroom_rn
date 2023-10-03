import type { ColorValue, TextStyle, ViewStyle } from 'react-native';

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

export type FontStyles = Pick<
  TextStyle,
  'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight'
>;

export type IconStyles = {
  size?: number | string | undefined;
};

export type FontsType = Keyof<Fonts>;

export type Fonts = {
  large: FontStyles;
  medium: FontStyles;
  small: FontStyles;
  extraSmall?: FontStyles;
};

export type FontsPaletteType = Keyof<FontsPalette>;

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

export type CornerRadiusPaletteType = Keyof<CornerRadiusPalette>;

export type CornerRadiusPalette = {
  extraSmall: number;
  small: number;
  medium: number;
  large: number;
};

export interface Palette {
  colors: ColorsPalette;
  fonts: FontsPalette;
  lineGradient: ColorLineGradientPalette;
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

export type ButtonSizesType = Keyof<ButtonSizes>;

export type ButtonSizes = {
  small: {
    button: ButtonSize;
    text: FontStyles;
    icon: IconStyles;
  };
  middle: {
    button: ButtonSize;
    text: FontStyles;
    icon: IconStyles;
  };
  large: {
    button: ButtonSize;
    text: FontStyles;
    icon: IconStyles;
  };
};

export type ButtonStateColorType = Keyof<ButtonStateColor>;

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
  };
  textButton1: {
    state: ButtonStateColor;
  };
  textButton2: {
    state: ButtonStateColor;
  };
  borderButton: {
    state: ButtonStateColor;
  };
};

export type Shadow = {
  shadowColor?: ColorValue | undefined;
  shadowOffset?: { width: number; height: number } | undefined;
  shadowOpacity?: number | undefined;
  shadowRadius?: number | undefined;
  elevation?: number | undefined;
};

export type ShadowStyle = {
  small: Shadow[];
  middle: Shadow[];
  large: Shadow[];
};

export interface Theme {
  style: ThemeType;
  button: {
    style: ButtonStyle;
    size: ButtonSizes;
  };
  shadow: {
    style: ShadowStyle;
  };
}

export type createPaletteParams = {
  colors: {
    primary: number;
    secondary: number;
    error: number;
    neutral: number;
    neutralSpecial: number;
  };
};

export type ThemeType = 'light' | 'dark';

export type createThemeParams = {
  palette: Palette;
  themeType: ThemeType;
};
