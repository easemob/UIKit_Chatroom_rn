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
export type GiftFloatingProps = {
  propsRef: React.RefObject<GiftFloatingRef>;
};

export function GiftFloating(props: GiftFloatingProps) {
  const { propsRef } = props;

  const dataRef = React.useRef<GiftFloatingItem[]>([]);
  const [data, setData] = React.useState<GiftFloatingItem[]>(dataRef.current);

  const ref = React.useRef<FlatList<GiftFloatingItem>>({} as any);

  const tasks: Queue<GiftFloatingTask> = React.useRef(
    new Queue<GiftFloatingTask>()
  ).current;
  const preTask = React.useRef<GiftFloatingTask | undefined>(undefined);
  const curTask = React.useRef<GiftFloatingTask | undefined>(undefined);
  const delayClear = React.useRef<NodeJS.Timeout>();

  const addData = useAddData({
    dataRef: dataRef,
    setData: setData,
    ref: ref,
  });

  if (propsRef.current) {
    propsRef.current.pushTask = async (task: GiftFloatingTask) => {
      tasks.enqueue(task);
      execTask();
    };
  }

  const execTask = () => {
    console.log('test:execTask:start:');
    if (curTask.current === undefined) {
      const task = tasks.dequeue();
      if (task) {
        console.log('test:execTask:ing:');
        curTask.current = task;
        delayClearTask();
        addData(task);
        preTask.current = curTask.current;
        curTask.current = undefined;
        console.log('test:execTask:finish:');
        execTask();
      }
    }
  };

  const delayClearTask = () => {
    if (delayClear.current) {
      clearTimeout(delayClear.current);
    }
    delayClear.current = setTimeout(() => {
      delayClear.current = undefined;
      if (curTask.current === undefined) {
        dataRef.current = [];
        setData([]);
      }
    }, gTimeoutTask);
  };

  return (
    <View
      style={{
        height: gListHeight,
        width: gListWidth,
        // backgroundColor: colors.barrage[1],
      }}
    >
      <FlatList
        ref={ref}
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
}

const ItemSeparatorComponent = () => {
  return <View style={{ height: gItemInterval }} />;
};
