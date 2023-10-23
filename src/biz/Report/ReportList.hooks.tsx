import * as React from 'react';
import { PanResponder } from 'react-native';

import { seqId } from '../../utils';
import type { ReportListItemProps } from './ReportList.item';
import type { ReportItemModel } from './types';

export function useReportListApi(itemData: ReportItemModel[]) {
  const dataRef = React.useRef<ReportListItemProps[]>(
    itemData
      ? itemData.map((v) => {
          return { data: v };
        })
      : [
          {
            data: {
              id: seqId('_rp').toString(),
              title: 'Unwelcome commercial content or spam',
              checked: true,
            },
          },
          {
            data: {
              id: seqId('_rp').toString(),
              title: 'Pornographic or explicit content',
              checked: false,
            },
          },
          {
            data: {
              id: seqId('_rp').toString(),
              title: 'Child abuse',
              checked: false,
            },
          },
          {
            data: {
              id: seqId('_rp').toString(),
              title: 'Hate speech or graphic violence',
              checked: false,
            },
          },
          {
            data: {
              id: seqId('_rp').toString(),
              title: 'Promote terrorism',
              checked: false,
            },
          },
          {
            data: {
              id: seqId('_rp').toString(),
              title: 'Harassment or bullying',
              checked: false,
            },
          },
        ]
  );
  const [data, setData] = React.useState<ReportListItemProps[]>(
    dataRef.current
  );

  const _onUpdate = (item: ReportListItemProps) => {
    for (const data of dataRef.current) {
      if (data.data.id === item.data.id) {
        data.data.checked = item.data.checked;
        break;
      }
    }
    setData([...dataRef.current]);
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
