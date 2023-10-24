import * as React from 'react';
import { PanResponder } from 'react-native';

import type { ReportListItemProps } from './ReportList.item';
import type { ReportItemModel } from './types';

export function useReportListApi(itemData: ReportItemModel[]) {
  const dataRef = React.useRef<ReportListItemProps[]>(
    itemData.map((v) => {
      return { data: v };
    })
  );
  const [data, setData] = React.useState<ReportListItemProps[]>(
    dataRef.current
  );

  const _onUpdate = (clickedItem: ReportListItemProps) => {
    let isNeedUpdate = false;
    for (const data of dataRef.current) {
      if (data.data.id === clickedItem.data.id) {
        if (clickedItem.data.checked === false) {
          data.data.checked = true;
          isNeedUpdate = true;
        }
      } else {
        data.data.checked = false;
      }
    }
    if (isNeedUpdate === true) {
      setData([...dataRef.current]);
    }
  };

  return {
    data: data,
    onUpdate: _onUpdate,
  };
}

export function useScrollGesture(
  requestUseScrollGesture?: (finished: boolean) => void
) {
  const isScrollingRef = React.useRef(false);
  const r = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (isScrollingRef.current === false) {
          isScrollingRef.current = true;
          requestUseScrollGesture?.(false);
        }
        if (isScrollingRef.current === true) {
          return false;
        }
        return true;
      },
      onMoveShouldSetPanResponder: () => {
        if (isScrollingRef.current === false) {
          isScrollingRef.current = true;
          requestUseScrollGesture?.(false);
        }
        if (isScrollingRef.current === true) {
          return false;
        }
        return true;
      },
    })
  ).current;
  return {
    isScrollingRef: isScrollingRef,
    handles: r.panHandlers,
  };
}
