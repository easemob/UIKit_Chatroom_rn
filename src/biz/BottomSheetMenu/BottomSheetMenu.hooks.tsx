import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { BottomSheetMenuItem } from './BottomSheetMenu.item';

export function useGetItems(initItems?: React.ReactElement[]) {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[0],
    },
  });
  return {
    items: React.useMemo(() => {
      return (
        initItems ?? [
          <BottomSheetMenuItem
            key={0}
            id={'1'}
            initState={'enabled'}
            text={'Private Chat'}
          />,
          <BottomSheetMenuItem
            key={1}
            id={'2'}
            initState={'enabled'}
            text={'Translate'}
          />,
          <BottomSheetMenuItem
            key={2}
            id={'3'}
            initState={'enabled'}
            text={'Deleted'}
          />,
          <BottomSheetMenuItem
            key={3}
            id={'4'}
            initState={'enabled'}
            text={'Muted'}
          />,
          <BottomSheetMenuItem
            key={4}
            id={'5'}
            initState={'warned'}
            text={'Report'}
          />,
          <View
            key={6}
            style={{
              height: 8,
              width: '100%',
              backgroundColor: getColor('divider'),
            }}
          />,
          <BottomSheetMenuItem
            key={5}
            id={'6'}
            initState={'enabled'}
            text={'Cancel'}
          />,
        ]
      );
    }, [getColor, initItems]),
  };
}
