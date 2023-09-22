import * as React from 'react';
import { FlatList, useWindowDimensions } from 'react-native';

import { getCurTs, seqId } from '../../utils';
import { gAnimateDuration, gItemHeight } from './GiftFloating.const';
import type { GiftFloatingItem } from './GiftFloating.item.hooks';
import type { GiftFloatingTask } from './types';

export const useAddData = (params: {
  dataRef: React.MutableRefObject<GiftFloatingItem[]>;
  setData: React.Dispatch<React.SetStateAction<GiftFloatingItem[]>>;
  ref: React.MutableRefObject<FlatList<GiftFloatingItem>>;
}) => {
  const { dataRef, setData, ref } = params;
  const { width: winWidth } = useWindowDimensions();
  const preTaskTs = React.useRef(0);
  const delayedScrolling = React.useRef<NodeJS.Timeout>();

  return (task: GiftFloatingTask) => {
    let isUseAnimation = true;
    if (preTaskTs.current === 0) {
      preTaskTs.current = getCurTs();
    } else {
      const curTaskTs = getCurTs();
      if (curTaskTs - preTaskTs.current < 250) {
        isUseAnimation = false;
      } else {
        isUseAnimation = true;
      }
      preTaskTs.current = curTaskTs;
    }

    const data = dataRef.current;
    if (data.length === 0) {
      data.push({
        id: seqId().toString(),
        height: gItemHeight,
        width: winWidth,
        idState: '1-0',
        isUseAnimation: isUseAnimation,
        gift: task.gift,
      });
    } else if (data.length === 1) {
      data[0]!.isUseAnimation = isUseAnimation;
      data[0]!.idState = '2-1';
      data.push({
        id: seqId().toString(),
        height: gItemHeight,
        width: winWidth,
        idState: '1-1',
        isUseAnimation: isUseAnimation,
        gift: task.gift,
      });
    } else if (data.length === 2) {
      data[0]!.idState = '3-2';
      data[0]!.isUseAnimation = isUseAnimation;
      data[1]!.idState = '2-2';
      data[1]!.isUseAnimation = isUseAnimation;
      data.push({
        id: seqId().toString(),
        height: gItemHeight,
        width: winWidth,
        idState: '1-1',
        isUseAnimation: isUseAnimation,
        gift: task.gift,
      });
    } else if (data.length === 3) {
      data.shift();
      data[0]!.idState = '3-3';
      data[0]!.isUseAnimation = isUseAnimation;
      data[1]!.idState = '2-3';
      data[1]!.isUseAnimation = isUseAnimation;
      data.push({
        id: seqId().toString(),
        height: gItemHeight,
        width: winWidth,
        idState: '1-1',
        isUseAnimation: isUseAnimation,
        gift: task.gift,
      });
    }

    setData([...data]);

    if (delayedScrolling.current) {
      clearTimeout(delayedScrolling.current);
      delayedScrolling.current = undefined;
    }
    delayedScrolling.current = setTimeout(() => {
      delayedScrolling.current = undefined;
      ref.current.scrollToEnd({ animated: true });
    }, gAnimateDuration * 2);
  };
};
