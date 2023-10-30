import * as React from 'react';
import {
  FlatList,
  Keyboard,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import {
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessageType,
  ChatTextMessageBody,
} from 'react-native-chat-sdk';

import { useConfigContext } from '../../config';
import { useDispatchContext } from '../../dispatch';
import { ErrorCode, UIKitError } from '../../error';
import { useDelayExecTask } from '../../hook';
import { useI18nContext } from '../../i18n';
import {
  chatroom_uikit_gift,
  custom_msg_event_type_gift,
  custom_msg_event_type_join,
  GiftServiceData,
  IMServiceListener,
  useIMContext,
  useIMListener,
} from '../../im';
import { seqId, timeoutTask } from '../../utils';
import { emoji as convert } from '../EmojiList';
import type { ReportItemModel } from '../Report';
import { gIdleTimeout, gMaxMessageCount } from './MessageList.const';
import type {
  MessageListItemBasic,
  MessageListItemModel,
  MessageListItemProps,
} from './types';

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

export function useMessageListApi(params: {
  onLongPress?: (data: MessageListItemModel) => void;
  onUnreadCount?: (count: number) => void;
  onLayoutProps?: ((event: LayoutChangeEvent) => void) | undefined;
}) {
  const {
    onLongPress: propsOnLongPress,
    onLayoutProps,
    onUnreadCount,
  } = params;
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
  const unreadCount = React.useRef(0);
  const { emit } = useDispatchContext();

  const heightRef = React.useRef(0);

  // If idle for more than three seconds, the oldest messages will be cleared.
  const { delayExecTask: _startClearTask } = useDelayExecTask(
    gIdleTimeout,
    () => {
      if (dataRef.current.length > gMaxMessageCount) {
        dataRef.current.splice(0, dataRef.current.length - gMaxMessageCount);
        _updateUI(true);
      }
    }
  );

  const needScrollRef = React.useRef(true);
  const userScrollGestureRef = React.useRef(false);

  const im = useIMContext();
  const { tr, currentLanguage } = useI18nContext();
  const { roomOption } = useConfigContext();

  const langPressItemRef = React.useRef<MessageListItemModel | undefined>();

  const onLongPress = (item: MessageListItemModel) => {
    langPressItemRef.current = item;
    propsOnLongPress?.(item);
  };

  const msgListener = React.useRef<IMServiceListener>({
    onMessageReceived: (roomId, message) => {
      if (im.roomState === 'joined') {
        if (im.roomId === roomId) {
          if (message.body.type === ChatMessageType.TXT) {
            _onTextMessage(message);
          } else if (message.body.type === ChatMessageType.CUSTOM) {
            _onCustomMessage(message);
          }
        }
      }
    },
  });

  useIMListener(msgListener.current);

  const _setNeedScroll = (needScroll: boolean) => {
    needScrollRef.current = needScroll;
  };
  const _setUserScrollGesture = (isUser: boolean) => {
    userScrollGestureRef.current = isUser;
  };
  const _needScroll = () => {
    return (
      needScrollRef.current === true && userScrollGestureRef.current === false
    );
  };
  const _setUnreadCount = (count: number) => {
    unreadCount.current = count;
    onUnreadCount?.(unreadCount.current);
  };

  const _addJoinData = (message: ChatMessage) => {
    const getNickName = () => {
      const user = im.userInfoFromMessage(message);
      return user?.nickName ?? user?.userId ?? 'unknown';
    };
    const part = {
      type: 'text',
      msg: message,
      content: {
        text: tr('${0} Joined', getNickName()),
      },
    } as Pick<MessageListItemProps, 'type' | 'msg' | 'content'>;
    return _addCommonData(part);
  };
  const _addTextData = (message: ChatMessage, content?: string) => {
    const getContent = () => {
      if (content) return content;
      return convert.toCodePointText(
        (message.body as ChatTextMessageBody).content
      );
    };
    const part = {
      type: 'text',
      msg: message,
      content: {
        text: getContent(),
      },
    } as Pick<MessageListItemProps, 'type' | 'msg' | 'content'>;
    return _addCommonData(part);
  };
  const _addGiftData = (message: ChatMessage) => {
    const body = message.body as ChatCustomMessageBody;
    const jsonGift = (body.params as any)[chatroom_uikit_gift];
    if (jsonGift) {
      const gift = JSON.parse(jsonGift) as GiftServiceData;
      const part = {
        type: 'gift',
        msg: message,
        content: {
          gift: gift.giftIcon,
          text: tr("Sent '@${0}'", gift.giftName),
        },
      } as Pick<MessageListItemProps, 'type' | 'msg' | 'content'>;
      return _addCommonData(part);
    }
    return false;
  };
  const _addCommonData = (
    d: Pick<MessageListItemProps, 'type' | 'msg' | 'content'>
  ) => {
    const getBasic = (): MessageListItemBasic => {
      let user = im.getUserInfo(d.msg?.from);
      if (user === undefined) {
        user = im.userInfoFromMessage(d.msg);
      }
      const nickName =
        im.userId === d.msg?.from
          ? tr('self')
          : user?.nickName ?? user?.userId ?? 'unknown';
      return {
        timestamp: Date.now(),
        nickName: nickName,
        avatar: user?.avatarURL,
        tag: user?.identify,
      };
    };
    dataRef.current.push({
      id: `${seqId('_msg')}`,
      basic: getBasic(),
      action: {
        onStartPress: () => {},
        onLongPress: (data: MessageListItemModel) => {
          _setNeedScroll(false);
          onLongPress?.(data);
        },
      },
      ...d,
    } as MessageListItemProps);
    return true;
  };
  const _updateUI = (isNeedUpdate: boolean) => {
    if (isNeedUpdate === true) {
      setData([...dataRef.current]);
    }
  };

  const _onTextMessage = (message: ChatMessage) => {
    _updateUI(_addTextData(message));
    if (_needScroll() === false) {
      _setUnreadCount(unreadCount.current + 1);
      emit(
        `_$${useMessageListApi.name}_updateUnreadCount`,
        unreadCount.current
      );
    }
    _startClearTask();
    _scrollToEnd();
  };

  const _onCustomMessage = (message: ChatMessage) => {
    const body = message.body as ChatCustomMessageBody;
    if (body.event === custom_msg_event_type_gift) {
      if (roomOption.messageList.isVisibleGift === true) {
        _updateUI(_addGiftData(message));
        if (_needScroll() === false) {
          _setUnreadCount(unreadCount.current + 1);
          emit(
            `_$${useMessageListApi.name}_updateUnreadCount`,
            unreadCount.current
          );
        }
        _startClearTask();
        _scrollToEnd();
      }
    } else if (body.event === custom_msg_event_type_join) {
      _updateUI(_addJoinData(message));
    }
  };

  const _addTextMessage = (content: string, message?: ChatMessage) => {
    _updateUI(_addTextData(message!, content));
    _setNeedScroll(true);
    _setUnreadCount(0);
    emit(`_$${useMessageListApi.name}_updateUnreadCount`, unreadCount.current);
    _startClearTask();
    _scrollToEnd();
  };

  const _addJoinedMessage = (message: ChatMessage) => {
    _updateUI(_addJoinData(message));
    _setNeedScroll(true);
    _setUnreadCount(0);
    emit(`_$${useMessageListApi.name}_updateUnreadCount`, unreadCount.current);
    _startClearTask();
    _scrollToEnd();
  };

  const _scrollToEnd = () => {
    if (_needScroll() === true) {
      timeoutTask(() => listRef.current?.scrollToEnd?.());
    }
  };

  const _onEndReached = () => {
    _setNeedScroll(true);
    _setUnreadCount(0);
    emit(`_$${useMessageListApi.name}_updateUnreadCount`, unreadCount.current);
  };

  const { delayExecTask: _gestureHandler } = useDelayExecTask(
    500,
    (isBottom: boolean) => {
      if (userScrollGestureRef.current === false) {
        _setNeedScroll(isBottom === true);
      }
    }
  );

  const _onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (userScrollGestureRef.current === true) {
      const y = event.nativeEvent.contentOffset.y;
      if (y + heightRef.current > event.nativeEvent.contentSize.height - 10) {
        _gestureHandler(true);
      } else {
        _gestureHandler(false);
      }
    }
  };

  const _scrollToLastMessage = () => {
    _setNeedScroll(true);
    _setUnreadCount(0);
    emit(`_$${useMessageListApi.name}_updateUnreadCount`, unreadCount.current);
    _scrollToEnd();
  };

  const _onScrollEndDrag = () => {
    _setUserScrollGesture(false);
  };
  const _onScrollBeginDrag = () => {
    _setUserScrollGesture(true);
  };

  // !!! Both gestures and scrolling methods are triggered on the ios platform. However, the android platform only has gesture triggering.
  const _onMomentumScrollEnd = () => {};

  const _onLayout = (event: LayoutChangeEvent) => {
    onLayoutProps?.(event);
    heightRef.current = event.nativeEvent.layout.height;
  };

  const _translateMessage = (msg?: ChatMessage) => {
    if (msg) {
      im.translateMessage(msg, currentLanguage())
        .then((r) => {
          // todo: update ui
          for (const item of dataRef.current) {
            if (item.msg) {
              if (item.msg.msgId === r.msgId) {
                if (
                  item.type === 'text' &&
                  r.body.type === ChatMessageType.TXT
                ) {
                  const key = currentLanguage();
                  const body = r.body as ChatTextMessageBody;
                  const t = body.translations?.[key] as string;
                  // (item.content as TextContent).text = t; // !!! Unable to trigger update.
                  item.content = { ...item.content, text: t };
                  _updateUI(true);
                }
                break;
              }
            }
          }
        })
        .catch((e) => {
          im.sendError({
            error: new UIKitError({
              code: ErrorCode.msg_translate_error,
              extra: e.toString(),
            }),
            from: useMessageListApi?.caller?.name,
          });
        });
    }
  };
  const _deleteMessage = (msg?: ChatMessage) => {
    if (msg) {
      im.recallMessage(msg.msgId)
        .then(() => {
          // todo: update ui
          for (let index = 0; index < dataRef.current.length; index++) {
            const item = dataRef.current[index];
            if (item?.msg?.msgId === msg.msgId) {
              dataRef.current.splice(index, 1);
              _updateUI(true);
              break;
            }
          }
        })
        .catch((e) => {
          im.sendError({
            error: new UIKitError({
              code: ErrorCode.msg_recall_error,
              extra: e.toString(),
            }),
            from: useMessageListApi?.caller?.name,
          });
        });
    }
  };
  const _reportMessage = (_result?: ReportItemModel) => {
    if (langPressItemRef.current?.msg) {
      const msg = langPressItemRef.current.msg;
      im.reportMessage({
        messageId: msg.msgId,
        tag: _result?.title ?? '',
        reason: '',
      })
        .then(() => {
          // todo: test
        })
        .catch((e) => {
          im.sendError({
            error: new UIKitError({
              code: ErrorCode.msg_report_error,
              extra: e.toString(),
            }),
            from: useMessageListApi?.caller?.name,
          });
        });
    }
  };

  return {
    data: data,
    listRef: listRef,
    addTextMessage: _addTextMessage,
    addJoinedMessage: _addJoinedMessage,
    scrollToEnd: _scrollToEnd,
    onEndReached: _onEndReached,
    onScroll: _onScroll,
    scrollToLastMessage: _scrollToLastMessage,
    onScrollEndDrag: _onScrollEndDrag,
    onScrollBeginDrag: _onScrollBeginDrag,
    onLayout: _onLayout,
    onMomentumScrollEnd: _onMomentumScrollEnd,
    translateMessage: _translateMessage,
    deleteMessage: _deleteMessage,
    reportMessage: _reportMessage,
  };
}
