import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { timeoutTask } from '../../utils';
import { gInputBarStyleHeight } from '../InputBar/InputBar.const';
import {
  gMessageListHeight,
  gMessageListMarginBottom,
  gMessageListMarginLeft,
  gMessageListWidth,
} from './MessageList.const';
import { useKeyboardOnAndroid, useMessageListApi } from './MessageList.hooks';
import { MessageListItemMemo } from './MessageList.item';
import type { MessageListItemProps } from './types';

export type MessageListRef = {
  /**
   * The message comes from the input box. Automatically scroll to the bottom.
   */
  addNewMessage: (content: string) => void;
  scrollToEnd: () => void;
};

export type MessageListProps = {
  onRequestCloseInputBar?: () => void;
  isInputBarShow: boolean;
  onLongPressItem?: (item: Omit<MessageListItemProps, 'action'>) => void;
  onUnreadCount?: (count: number) => void;
};

export const MessageList = React.forwardRef<MessageListRef, MessageListProps>(
  function (props: MessageListProps, ref: React.ForwardedRef<MessageListRef>) {
    const {
      onRequestCloseInputBar,
      isInputBarShow,
      onLongPressItem,
      onUnreadCount,
    } = props;
    const { width, height } = useWindowDimensions();
    const { bottom, top } = useSafeAreaInsets();

    const translateY = useKeyboardOnAndroid(isInputBarShow);
    const { data, addTextMessage, listRef, scrollToEnd, onEndReached } =
      useMessageListApi({ onLongPress: onLongPressItem, onUnreadCount });

    React.useImperativeHandle(
      ref,
      () => {
        return {
          addNewMessage: (content: string) => {
            addTextMessage(content);
            timeoutTask(() => scrollToEnd());
          },
          scrollToEnd: () => {
            scrollToEnd();
          },
        };
      },
      [addTextMessage, scrollToEnd]
    );

    return (
      <View
        style={{
          flex: 1,
          width: width,
          height: height - bottom - top - gInputBarStyleHeight,
          // backgroundColor: '#7fffd4',
          position: 'absolute',
          bottom: bottom + gInputBarStyleHeight,
          transform: [{ translateY: translateY }],
        }}
      >
        <View
          style={{
            flex: 1,
            // backgroundColor: '#8fbc8f',
          }}
          onTouchEnd={() => {
            onRequestCloseInputBar?.();
          }}
        />
        <View
          style={{
            marginLeft: gMessageListMarginLeft,
            marginBottom: gMessageListMarginBottom,
            width: gMessageListWidth,
            height: gMessageListHeight,
            // backgroundColor: '#ffd700',
          }}
        >
          <FlatList
            ref={listRef}
            data={data}
            renderItem={(info: ListRenderItemInfo<MessageListItemProps>) => {
              return <MessageListItemMemo {...info.item} />;
            }}
            // renderItem={RenderItemMemo}
            keyExtractor={(item: MessageListItemProps) => {
              return item.id;
            }}
            // onScroll={(e) => {
            //   console.log('test:onScroll', e.nativeEvent);
            // }}
            // onScrollAnimationEnd={() => {
            //   console.log('test:onScrollAnimationEnd');
            // }}
            // onMomentumScrollEnd={() => {
            //   console.log('test:onMomentumScrollEnd');
            // }}
            // onScrollToTop={() => {
            //   console.log('test:onScrollToTop');
            // }}
            onEndReached={(e) => {
              console.log('test:onEndReached', e);
              onEndReached();
            }}
          />
        </View>
      </View>
    );
  }
);

export const MessageListMemo = React.memo(MessageList);

// const RenderItemMemo = React.memo(
//   (info: ListRenderItemInfo<MessageListItemProps>) => {
//     const { item } = info;
//     return <MessageListItem {...item} />;
//   }
// );
