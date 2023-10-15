import * as React from 'react';
import type { LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';
import { FlatList, ListRenderItemInfo, View } from 'react-native';

import { timeoutTask } from '../../utils';
import {
  gMessageListHeight,
  gMessageListMarginBottom,
  gMessageListMarginLeft,
  gMessageListWidth,
} from './MessageList.const';
import { useMessageListApi } from './MessageList.hooks';
import { MessageListItemMemo } from './MessageList.item';
import type { MessageListItemModel, MessageListItemProps } from './types';

export type MessageListRef = {
  /**
   * The message comes from the input box. Automatically scroll to the bottom.
   */
  addNewMessage: (content: string) => void;
  scrollToEnd: () => void;
};

export type MessageListProps = {
  visible?: boolean;
  onLongPressItem?: (item: MessageListItemModel) => void;
  onUnreadCount?: (count: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;
};

export const MessageList = React.forwardRef<MessageListRef, MessageListProps>(
  function (props: MessageListProps, ref?: React.ForwardedRef<MessageListRef>) {
    const {
      onLongPressItem,
      onUnreadCount,
      containerStyle,
      visible = true,
      onLayout,
    } = props;
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

    if (visible === false) {
      return null;
    }

    return (
      <View
        style={[
          {
            marginLeft: gMessageListMarginLeft,
            marginBottom: gMessageListMarginBottom,
            width: gMessageListWidth,
            height: gMessageListHeight,
            // backgroundColor: '#ffd700',
          },
          containerStyle,
        ]}
        onLayout={onLayout}
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
          onEndReached={() => {
            onEndReached();
          }}
        />
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
