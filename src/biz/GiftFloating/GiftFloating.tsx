import * as React from 'react';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

import { Queue } from '../../utils';
import {
  gItemInterval,
  gListHeight,
  gListWidth,
  gTimeoutTask,
} from './GiftFloating.const';
import { useAddData } from './GiftFloating.hooks';
import { GiftFloatingItemFC } from './GiftFloating.item';
import type { GiftFloatingItem } from './GiftFloating.item.hooks';
import type { GiftFloatingTask } from './types';

export type GiftFloatingRef = {
  pushTask: (task: GiftFloatingTask) => void;
};
export type GiftFloatingProps = {};

export const GiftFloating = React.forwardRef<
  GiftFloatingRef,
  GiftFloatingProps
>(function (
  props: GiftFloatingProps,
  ref: React.ForwardedRef<GiftFloatingRef>
) {
  const {} = props;

  const dataRef = React.useRef<GiftFloatingItem[]>([]);
  const [data, setData] = React.useState<GiftFloatingItem[]>(dataRef.current);

  const listRef = React.useRef<FlatList<GiftFloatingItem>>({} as any);

  const tasks: Queue<GiftFloatingTask> = React.useRef(
    new Queue<GiftFloatingTask>()
  ).current;
  const preTask = React.useRef<GiftFloatingTask | undefined>(undefined);
  const curTask = React.useRef<GiftFloatingTask | undefined>(undefined);
  const delayClear = React.useRef<NodeJS.Timeout>();

  const { addData, clearData, scrollToEnd } = useAddData({
    dataRef: dataRef,
    setData: setData,
    ref: listRef,
  });

  const execTask = () => {
    if (curTask.current === undefined) {
      const task = tasks.dequeue();
      if (task) {
        curTask.current = task;
        delayClearData();
        addData(task);
        scrollToEnd();
        preTask.current = curTask.current;
        curTask.current = undefined;
        execTask();
      }
    }
  };

  const checkData = () => {
    delayClearData();
  };

  const delayClearData = () => {
    if (delayClear.current) {
      clearTimeout(delayClear.current);
    }
    delayClear.current = setTimeout(() => {
      delayClear.current = undefined;
      if (curTask.current === undefined) {
        if (dataRef.current.length > 0) {
          clearData();
          scrollToEnd();
          checkData();
        }
      }
    }, gTimeoutTask);
  };

  const pushTask = (task: GiftFloatingTask) => {
    tasks.enqueue(task);
    execTask();
  };

  React.useImperativeHandle(
    ref,
    () => {
      return {
        pushTask: (task: GiftFloatingTask) => {
          pushTask(task);
        },
      };
    },
    // !!!
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <View
      style={{
        height: gListHeight,
        width: gListWidth,
        // backgroundColor: 'gray',
      }}
    >
      <FlatList
        ref={listRef}
        data={data}
        renderItem={(info: ListRenderItemInfo<GiftFloatingItem>) => {
          return <GiftFloatingItemFC item={info.item} />;
        }}
        keyExtractor={(item: GiftFloatingItem) => {
          return item.id;
        }}
        bounces={false}
        ItemSeparatorComponent={ItemSeparatorComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

const ItemSeparatorComponent = () => {
  return <View style={{ height: gItemInterval }} />;
};
