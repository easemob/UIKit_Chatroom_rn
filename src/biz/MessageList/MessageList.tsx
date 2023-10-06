import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { gInputBarStyleHeight } from '../InputBar/InputBar.const';
import {
  gMessageListHeight,
  gMessageListMarginBottom,
  gMessageListMarginLeft,
  gMessageListWidth,
} from './MessageList.const';
import { useKeyboardOnAndroid } from './MessageList.hooks';
import {
  GiftContent,
  MessageListItem,
  MessageListItemProps,
  TextContent,
  VoiceContent,
} from './MessageList.item';

export type MessageListProps = {
  onRequestCloseInputBar?: () => void;
  isInputBarShow: boolean;
};

export function MessageList(props: MessageListProps) {
  const { onRequestCloseInputBar, isInputBarShow } = props;
  const { width, height } = useWindowDimensions();
  const { bottom, top } = useSafeAreaInsets();
  const dataRef = React.useRef<MessageListItemProps[]>([
    {
      id: '1',
      type: 'text',
      content: {
        text: 'John, go on.',
      } as TextContent,
    },
    {
      id: '2',
      type: 'gift',
      content: {
        gift: 'sdf',
        text: 'send a gift',
      } as GiftContent,
    },
    {
      id: '3',
      type: 'voice',
      content: {
        icon: '2_bars_in_circle',
        length: 8,
      } as VoiceContent,
    },
    {
      id: '4',
      type: 'text',
      content: {
        text: 'Sei la cosa più bella che mi sia mai capitato non so stare senza te.',
      } as TextContent,
    },
    {
      id: '5',
      type: 'text',
      content: {
        text: '2 Sei la cosa più bella che mi sia mai capitato non so stare senza te.',
      } as TextContent,
    },
  ]);
  const [data] = React.useState<MessageListItemProps[]>(dataRef.current);

  const translateY = useKeyboardOnAndroid(isInputBarShow);

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
          data={data}
          renderItem={(info: ListRenderItemInfo<MessageListItemProps>) => {
            const { item } = info;
            return <MessageListItem {...item} />;
          }}
          keyExtractor={(item: MessageListItemProps) => {
            return item.id;
          }}
        />
      </View>
    </View>
  );
}
