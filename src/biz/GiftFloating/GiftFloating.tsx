import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

import { Queue } from '../../utils';
import {
  gGiftFloatingListHeight,
  gGiftFloatingListWidth,
  gItemInterval,
  gTimeoutTask,
} from './GiftFloating.const';
import { useAddData } from './GiftFloating.hooks';
import {
  GiftFloatingItemFC,
  GiftFloatingItemFCProps,
} from './GiftFloating.item';
import type { GiftFloatingItem } from './GiftFloating.item.hooks';
import type { GiftFloatingTask } from './types';

/**
 * The reference of the `GiftFloating` component.
 */
export type GiftFloatingRef = {
  /**
   * Push a task to the queue.
   */
  pushTask: (task: GiftFloatingTask) => void;
};
/**
 * Properties of the `GiftFloating` component.
 */
export type GiftFloatingProps = {
  /**
   * Whether to display the component.
   *
   * Changing the display or hiding in this way usually does not trigger the loading and unloading of components.
   */
  visible?: boolean;
  /**
   * The style of the container.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * The component used to render the item.
   */
  GiftFloatingItemComponent?: React.ComponentType<GiftFloatingItemFCProps>;
};

/**
 * The GiftFloating component provides a floating gift animation.
 *
 * @test {@link https://github.com/AsteriskZuo/react-native-chat-room/blob/3d538038480dda62e8046ceb1afe65c644a6e55f/example/src/__dev__/test_gift_floating.tsx}
 *
 * @param props {@link GiftFloatingProps}
 * @param ref {@link GiftFloatingRef}
 * @returns React.JSX.Element
 * @example
 *
 * ```tsx
 * const ref = React.useRef<GiftFloatingRef>({} as any);
 * // ...
 * <GiftFloating
 *   ref={ref}
 *   containerStyle={
 *     {
 *       // top: 50,
 *       // left: 100,
 *     }
 *   }
 * />
 * // ...
 * ref.current?.pushTask({
 *       model: {
 *         id: seqId('_gf').toString(),
 *         nickName: 'NickName',
 *         giftCount: '1',
 *         giftIcon: 'http://notext.png',
 *         content: 'send Agoraship too too too long',
 *       },
 *     });
 * ```
 */
export const GiftFloating = React.forwardRef<
  GiftFloatingRef,
  GiftFloatingProps
>(function (
  props: GiftFloatingProps,
  ref?: React.ForwardedRef<GiftFloatingRef>
) {
  const { containerStyle, visible = true, GiftFloatingItemComponent } = props;

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

  const _GiftFloatingItemComponent =
    GiftFloatingItemComponent ?? GiftFloatingItemFC;

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
      style={[
        containerStyle,
        {
          height: gGiftFloatingListHeight,
          width: gGiftFloatingListWidth,
          // backgroundColor: '#ffd700',
          display: visible === false ? 'none' : 'flex',
        },
      ]}
    >
      <FlatList
        ref={listRef}
        data={data}
        renderItem={(info: ListRenderItemInfo<GiftFloatingItem>) => {
          return <_GiftFloatingItemComponent item={info.item} />;
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

export type GiftFloatingComponent = typeof GiftFloating;
