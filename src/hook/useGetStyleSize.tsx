import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

type SizeType = {
  height?: number | string | undefined;
  width?: number | string | undefined;
};
export function useGetStyleSize() {
  const ret = React.useMemo(() => {
    return {
      getViewStyleSize: (styles?: StyleProp<ViewStyle>) => {
        const s = styles as any;
        return {
          height: s?.height,
          width: s?.width,
        } as SizeType;
      },
    };
  }, []);
  return ret;
}
