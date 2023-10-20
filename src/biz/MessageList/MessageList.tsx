import * as React from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { useDispatchContext } from '../../dispatch';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { BorderButton } from '../../ui/Button';
import { timeoutTask } from '../../utils';
import type { PropsWithError, PropsWithTest } from '../types';
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
} & PropsWithTest &
  PropsWithError;

export const MessageList = React.forwardRef<MessageListRef, MessageListProps>(
  function (props: MessageListProps, ref?: React.ForwardedRef<MessageListRef>) {
    const {
      onLongPressItem,
      onUnreadCount,
      containerStyle,
      visible = true,
      onLayout,
    } = props;
    const {
      data,
      addTextMessage,
      listRef,
      scrollToEnd,
      onEndReached,
      onScroll,
      scrollToLastMessage,
    } = useMessageListApi({ onLongPress: onLongPressItem, onUnreadCount });

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
          onEndReached={onEndReached}
          onScroll={onScroll}
        />
        <NewMsgButton onPress={scrollToLastMessage} />
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

const NewMsgButton = ({ onPress }: { onPress: () => void }) => {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    text: {
      light: colors.primary[5],
      dark: colors.primary[6],
    },
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const [text, setText] = React.useState('99+ new message(s)');
  const { addListener, removeListener } = useDispatchContext();

  React.useEffect(() => {
    const getText = (count: number) => {
      const n = count > 99 ? '99+' : count.toString();
      const content = count === 0 ? '' : `${n} new message(s)`;
      setText(content);
    };
    addListener(`_$${NewMsgButton.name}`, getText);
    return () => {
      removeListener(`_$${NewMsgButton.name}`, getText);
    };
  }, [addListener, removeListener]);
  return (
    <BorderButton
      style={{
        position: 'absolute',
        width: 181,
        height: 26,
        // borderRadius: 24,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: getColor('bg'),
        borderWidth: 0,
        display: text.length === 0 ? 'none' : 'flex',
      }}
      textStyle={{ color: getColor('text') }}
      iconStyle={{ tintColor: getColor('text') }}
      sizesType={'small'}
      radiusType={'large'}
      contentType={'icon-text'}
      icon={'chevron_down_small'}
      text={text}
      onPress={onPress}
    />
  );
};
