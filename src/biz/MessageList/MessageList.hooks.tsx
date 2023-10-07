import * as React from 'react';
import { FlatList, Keyboard, Platform } from 'react-native';

import { useDispatchContext } from '../../dispatch';
import { seqId } from '../../utils';
import type { MessageListItemProps } from './types';

export const useKeyboardOnAndroid = (isInputBarShow: boolean) => {
  const { addListener, removeListener, emit } = useDispatchContext();
  const [translateY, seTranslateY] = React.useState(0);
  const keyboardHeight = React.useRef(0);

  React.useEffect(() => {
    const s1 = Keyboard.addListener('keyboardDidShow', (e) => {
      // !!! both ios and android
      if (Platform.OS !== 'ios') {
        keyboardHeight.current = e.endCoordinates.height;
        emit(
          `_$${useKeyboardOnAndroid.name}`,
          isInputBarShow,
          keyboardHeight.current
        );
      }
    });
    const s3 = Keyboard.addListener('keyboardDidHide', (e) => {
      // !!! both ios and android
      if (Platform.OS !== 'ios') {
        keyboardHeight.current = e.endCoordinates.height;
        emit(
          `_$${useKeyboardOnAndroid.name}`,
          isInputBarShow,
          keyboardHeight.current
        );
      }
    });
    return () => {
      s1.remove();
      s3.remove();
    };
  }, [emit, isInputBarShow]);

  React.useEffect(() => {
    const changeLayout = (isInputBarShow: boolean, keyboardHeight: number) => {
      if (keyboardHeight > 0) {
        if (isInputBarShow === true) {
          seTranslateY(keyboardHeight);
        } else {
          seTranslateY(0);
        }
      } else {
        seTranslateY(0);
      }
    };
    addListener(`_$${useKeyboardOnAndroid.name}`, changeLayout);
    return () => {
      removeListener(`_$${useKeyboardOnAndroid.name}`, changeLayout);
    };
  }, [addListener, removeListener]);

  return translateY;
};

export function useMessageListApi() {
  const listRef = React.useRef<FlatList>({} as any);
  const dataRef = React.useRef<MessageListItemProps[]>([
    // {
    //   id: '1',
    //   type: 'text',
    //   basic: {
    //     timestamp: Date.now(),
    //     nickName: 'self',
    //   },
    //   content: {
    //     text: 'John, go on.',
    //   } as TextContent,
    // },
    // {
    //   id: '2',
    //   type: 'gift',
    //   basic: {
    //     timestamp: Date.now(),
    //     nickName: 'self',
    //   },
    //   content: {
    //     gift: 'sdf',
    //     text: 'send a gift',
    //   } as GiftContent,
    // },
    // {
    //   id: '3',
    //   type: 'voice',
    //   basic: {
    //     timestamp: Date.now(),
    //     nickName: 'self',
    //   },
    //   content: {
    //     icon: '2_bars_in_circle',
    //     length: 8,
    //   } as VoiceContent,
    // },
    // {
    //   id: '4',
    //   type: 'text',
    //   basic: {
    //     timestamp: Date.now(),
    //     nickName: 'self',
    //   },
    //   content: {
    //     text: 'Sei la cosa più bella che mi sia mai capitato non so stare senza te.',
    //   } as TextContent,
    // },
    // {
    //   id: '5',
    //   type: 'text',
    //   basic: {
    //     timestamp: Date.now(),
    //     nickName: 'self',
    //   },
    //   content: {
    //     text: '2 Sei la cosa più bella che mi sia mai capitato non so stare senza te.',
    //   } as TextContent,
    // },
  ]);
  const [data, setData] = React.useState<MessageListItemProps[]>(
    dataRef.current
  );

  const _addTextMessage = (content: string) => {
    dataRef.current.push({
      id: `${seqId('_msg')}`,
      type: 'text',
      basic: {
        timestamp: Date.now(),
        nickName: 'self',
      },
      content: {
        text: content,
      },
    });
    setData([...dataRef.current]);
  };

  const _scrollToEnd = () => {
    listRef.current?.scrollToEnd();
  };

  return {
    data: data,
    listRef: listRef,
    addTextMessage: _addTextMessage,
    scrollToEnd: _scrollToEnd,
  };
}
