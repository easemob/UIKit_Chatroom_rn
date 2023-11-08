import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

import { Queue } from '../../utils';
import {
  gGiftEffectListHeight,
  gGiftEffectListWidth,
  gItemInterval,
  gTimeoutTask,
} from './GiftBarrage.const';
import { useAddData } from './GiftBarrage.hooks';
import { GiftEffectItemFC, GiftEffectItemFCProps } from './GiftBarrage.item';
import type { GiftEffectItem } from './GiftBarrage.item.hooks';
import type { GiftEffectTask } from './types';

/**
 * The reference of the `GiftBarrage` component.
 */
export type GiftEffectRef = {
  /**
   * Push a task to the queue.
   */
  pushTask: (task: GiftEffectTask) => void;
};
/**
 * Properties of the `GiftBarrage` component.
 */
export type GiftEffectProps = {
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
  GiftEffectItemComponent?: React.ComponentType<GiftEffectItemFCProps>;
};

/**
 * The GiftBarrage component provides a floating gift animation.
 *
 * @test {@link https://github.com/AsteriskZuo/react-native-chat-room/blob/3d538038480dda62e8046ceb1afe65c644a6e55f/example/src/__dev__/test_gift_floating.tsx}
 *
 * @param props {@link GiftEffectProps}
 * @param ref {@link GiftEffectRef}
 * @returns JSX.Element
 * @example
 *
 * ```tsx
 * const ref = React.useRef<GiftEffectRef>({} as any);
 * // ...
 * <GiftBarrage
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
 *         giftCount: 1,
 *         giftIcon: 'http://notext.png',
 *         content: 'send Agoraship too too too long',
 *       },
 *     });
 * ```
 */
export const GiftBarrage = React.forwardRef<GiftEffectRef, GiftEffectProps>(
  function (props: GiftEffectProps, ref?: React.ForwardedRef<GiftEffectRef>) {
    const { containerStyle, visible = true, GiftEffectItemComponent } = props;

    const dataRef = React.useRef<GiftEffectItem[]>([]);
    const [data, setData] = React.useState<GiftEffectItem[]>(dataRef.current);

    const listRef = React.useRef<FlatList<GiftEffectItem>>({} as any);

    const tasks: Queue<GiftEffectTask> = React.useRef(
      new Queue<GiftEffectTask>()
    ).current;
    const preTask = React.useRef<GiftEffectTask | undefined>(undefined);
    const curTask = React.useRef<GiftEffectTask | undefined>(undefined);
    const delayClear = React.useRef<NodeJS.Timeout>();

    const { addData, clearData, scrollToEnd } = useAddData({
      dataRef: dataRef,
      setData: setData,
      ref: listRef,
    });

    const _GiftEffectItemComponent =
      GiftEffectItemComponent ?? GiftEffectItemFC;

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

    const pushTask = (task: GiftEffectTask) => {
      tasks.enqueue(task);
      execTask();
    };

    React.useImperativeHandle(
      ref,
      () => {
        return {
          pushTask: (task: GiftEffectTask) => {
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
            height: gGiftEffectListHeight,
            width: gGiftEffectListWidth,
            // backgroundColor: '#ffd700',
            display: visible === false ? 'none' : 'flex',
          },
        ]}
      >
        <FlatList
          ref={listRef}
          data={data}
          renderItem={(info: ListRenderItemInfo<GiftEffectItem>) => {
            return <_GiftEffectItemComponent item={info.item} />;
          }}
          keyExtractor={(item: GiftEffectItem) => {
            return item.id;
          }}
          bounces={false}
          ItemSeparatorComponent={ItemSeparatorComponent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
);

const ItemSeparatorComponent = () => {
  return <View style={{ height: gItemInterval }} />;
};

export type GiftEffectComponent = typeof GiftBarrage;
