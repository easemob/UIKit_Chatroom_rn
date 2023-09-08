import { ErrorCode, UIKitError } from '../error';
import type {
  ButtonSizes,
  ButtonStyle,
  ButtonStyleType,
  Palette,
  ThemeType,
} from './types';

export function generateButton(params: {
  palette: Palette;
  themeType: ThemeType;
}): ButtonStyle {
  const { themeType } = params;
  switch (themeType) {
    case 'light':
      return generateLightButton(params);
    case 'dark':
      return generateDarkButton(params);
    default:
      throw new UIKitError({
        code: ErrorCode.common,
      });
  }
}

function generateLightButton(params: { palette: Palette }): ButtonStyle {
  const { palette } = params;
  const ret = {} as ButtonStyle;
  ret.commonButton = {
    state: {
      enabled: {
        color: palette.colors.neutral[98],
        backgroundColor: palette.colors.primary[5],
        borderColor: undefined,
      },
      disabled: {
        color: palette.colors.neutral[7],
        backgroundColor: palette.colors.neutral[95],
        borderColor: undefined,
      },
      pressed: {
        color: palette.colors.neutral[95],
        backgroundColor: palette.colors.primary[4],
        borderColor: undefined,
      },
      loading: {
        color: palette.colors.neutral[7],
        backgroundColor: palette.colors.neutral[95],
        borderColor: undefined,
      },
    },
    sizes: generateSizeButton({ ...params, buttonType: 'commonButton' }),
  };
  ret.textButton = {
    state: {
      enabled: {
        color: undefined,
        backgroundColor: palette.colors.primary[5],
        borderColor: undefined,
      },
      disabled: {
        color: undefined,
        backgroundColor: palette.colors.neutral[7],
        borderColor: undefined,
      },
      pressed: {
        color: undefined,
        backgroundColor: palette.colors.primary[4],
        borderColor: undefined,
      },
      loading: {
        color: undefined,
        backgroundColor: palette.colors.primary[5],
        borderColor: undefined,
      },
    },
    sizes: generateSizeButton({ ...params, buttonType: 'textButton' }),
  };
  ret.borderButton = {
    state: {
      enabled: {
        color: palette.colors.neutral[3],
        backgroundColor: palette.colors.neutral[98],
        borderColor: palette.colors.neutral[7],
      },
      disabled: {
        color: palette.colors.neutral[8],
        backgroundColor: palette.colors.neutral[98],
        borderColor: palette.colors.neutral[7],
      },
      pressed: {
        color: palette.colors.primary[5],
        backgroundColor: palette.colors.primary[95],
        borderColor: palette.colors.primary[5],
      },
      loading: {
        color: palette.colors.neutral[3],
        backgroundColor: palette.colors.neutral[98],
        borderColor: palette.colors.neutral[7],
      },
    },
    sizes: generateSizeButton({ ...params, buttonType: 'borderButton' }),
  };
  return ret;
}

function generateDarkButton(params: { palette: Palette }): ButtonStyle {
  const { palette } = params;
  const ret = {} as ButtonStyle;
  ret.commonButton = {
    state: {
      enabled: {
        color: palette.colors.neutral[98],
        backgroundColor: palette.colors.primary[6],
        borderColor: undefined,
      },
      disabled: {
        color: palette.colors.neutral[4],
        backgroundColor: palette.colors.neutral[2],
        borderColor: undefined,
      },
      pressed: {
        color: palette.colors.neutral[95],
        backgroundColor: palette.colors.primary[5],
        borderColor: undefined,
      },
      loading: {
        color: palette.colors.neutral[98],
        backgroundColor: palette.colors.primary[6],
        borderColor: undefined,
      },
    },
    sizes: generateSizeButton({ ...params, buttonType: 'commonButton' }),
  };
  ret.textButton = {
    state: {
      enabled: {
        color: undefined,
        backgroundColor: palette.colors.primary[6],
        borderColor: undefined,
      },
      disabled: {
        color: undefined,
        backgroundColor: palette.colors.neutral[3],
        borderColor: undefined,
      },
      pressed: {
        color: undefined,
        backgroundColor: palette.colors.primary[5],
        borderColor: undefined,
      },
      loading: {
        color: undefined,
        backgroundColor: palette.colors.primary[6],
        borderColor: undefined,
      },
    },
    sizes: generateSizeButton({ ...params, buttonType: 'textButton' }),
  };
  ret.borderButton = {
    state: {
      enabled: {
        color: palette.colors.neutral[98],
        backgroundColor: palette.colors.neutral[1],
        borderColor: palette.colors.neutral[4],
      },
      disabled: {
        color: palette.colors.neutral[3],
        backgroundColor: palette.colors.neutral[1],
        borderColor: palette.colors.neutral[2],
      },
      pressed: {
        color: palette.colors.primary[5],
        backgroundColor: palette.colors.primary[2],
        borderColor: palette.colors.primary[6],
      },
      loading: {
        color: palette.colors.neutral[98],
        backgroundColor: palette.colors.neutral[1],
        borderColor: palette.colors.neutral[4],
      },
    },
    sizes: generateSizeButton({ ...params, buttonType: 'borderButton' }),
  };
  return ret;
}

function generateSizeButton(params: {
  palette: Palette;
  buttonType: ButtonStyleType;
}): ButtonSizes {
  const { palette, buttonType } = params;
  switch (buttonType) {
    case 'commonButton':
      return {
        small: {
          button: {
            borderWidth: undefined,
            borderRadius: undefined,
            height: 28,
            minWidth: 28,
            maxWidth: undefined,
            paddingHorizontal: 16,
            paddingVertical: 5,
            width: undefined,
          },
          text: palette.fonts.label.medium,
        },
        middle: {
          button: {
            borderWidth: undefined,
            borderRadius: undefined,
            height: 36,
            minWidth: 36,
            maxWidth: undefined,
            paddingHorizontal: 20,
            paddingVertical: 8,
            width: undefined,
          },
          text: palette.fonts.label.medium,
        },
        large: {
          button: {
            borderWidth: undefined,
            borderRadius: undefined,
            height: 48,
            minWidth: 48,
            maxWidth: undefined,
            paddingHorizontal: 24,
            paddingVertical: 12,
            width: undefined,
          },
          text: palette.fonts.headline.small,
        },
      };
    case 'textButton':
      return {
        small: {
          button: {
            borderWidth: undefined,
            borderRadius: undefined,
            height: 28,
            minWidth: 28,
            maxWidth: undefined,
            paddingHorizontal: 16,
            paddingVertical: 5,
            width: undefined,
          },
          text: palette.fonts.label.medium,
        },
        middle: {
          button: {
            borderWidth: undefined,
            borderRadius: undefined,
            height: 36,
            minWidth: 36,
            maxWidth: undefined,
            paddingHorizontal: 20,
            paddingVertical: 8,
            width: undefined,
          },
          text: palette.fonts.label.medium,
        },
        large: {
          button: {
            borderWidth: undefined,
            borderRadius: undefined,
            height: 48,
            minWidth: 48,
            maxWidth: undefined,
            paddingHorizontal: 24,
            paddingVertical: 12,
            width: undefined,
          },
          text: palette.fonts.headline.small,
        },
      };
    case 'borderButton':
      return {
        small: {
          button: {
            borderWidth: 1,
            borderRadius: undefined,
            height: 28,
            minWidth: 28,
            maxWidth: undefined,
            paddingHorizontal: 16,
            paddingVertical: 5,
            width: undefined,
          },
          text: palette.fonts.label.medium,
        },
        middle: {
          button: {
            borderWidth: 1,
            borderRadius: undefined,
            height: 36,
            minWidth: 36,
            maxWidth: undefined,
            paddingHorizontal: 20,
            paddingVertical: 8,
            width: undefined,
          },
          text: palette.fonts.label.medium,
        },
        large: {
          button: {
            borderWidth: 1,
            borderRadius: undefined,
            height: 48,
            minWidth: 48,
            maxWidth: undefined,
            paddingHorizontal: 24,
            paddingVertical: 12,
            width: undefined,
          },
          text: palette.fonts.headline.small,
        },
      };

    default:
      throw new UIKitError({
        code: ErrorCode.common,
      });
  }
}
