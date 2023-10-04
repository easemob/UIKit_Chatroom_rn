import * as React from 'react';

import { BottomSheetMenuItem } from './BottomSheetMenu.item';

export function useGetItems(initItems?: React.ReactElement[]) {
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
          <BottomSheetMenuItem
            key={5}
            id={'6'}
            initState={'enabled'}
            text={'Cancel'}
          />,
        ]
      );
    }, [initItems]),
  };
}
