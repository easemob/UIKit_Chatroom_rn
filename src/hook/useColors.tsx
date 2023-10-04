import * as React from 'react';
import type { ColorValue } from 'react-native';

import { ThemeType, useThemeContext } from '../theme';
import type { KV } from '../types';

export type StyleColor = {
  styleName: ThemeType;
  color?: ColorValue | undefined;
};

export type StyleColorParams = KV<
  string,
  KV<ThemeType, ColorValue | undefined>
>;

export function useColors(pairs?: StyleColorParams) {
  const { style } = useThemeContext();
  const list = React.useRef(
    new Map<string, KV<ThemeType, ColorValue | undefined>>()
  );
  const func = () => {
    return {
      initColor: (pairs: StyleColorParams) => {
        list.current.clear();
        const keys = Object.getOwnPropertyNames(pairs);
        for (const key of keys) {
          list.current.set(key, pairs[key]!);
        }
      },
      getColor: (key: string) => {
        const item = list.current.get(key);
        return item?.[style];
      },
    };
  };

  if (pairs) {
    func().initColor(pairs);
  }

  return func();
}
