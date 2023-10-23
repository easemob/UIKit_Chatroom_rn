import * as React from 'react';
import {
  FlatList,
  LayoutChangeEvent,
  ListRenderItemInfo,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import type { ChatMessage } from 'react-native-chat-sdk';

import { useDispatchListener } from '../../dispatch';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { BorderButton } from '../../ui/Button';
import { seqId } from '../../utils';
import { Report, ReportItemModel, ReportProps, ReportRef } from '../Report';
import type { PropsWithError, PropsWithTest } from '../types';
import { useGetItems } from './MessageContextMenu';
import {
  MessageContextMenu,
  MessageContextMenuRef,
} from './MessageContextMenu';
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
  addNewMessage: (content: string, message?: ChatMessage) => void;
  scrollToEnd: () => void;
};

export type MessageListProps = {
  visible?: boolean;
  onLongPressItem?: (item: MessageListItemModel) => void;
  onUnreadCount?: (count: number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  backgroundStyle?: StyleProp<ViewStyle>;
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined;

  reportProps?: ReportProps;
} & PropsWithTest &
  PropsWithError;

export const MessageList = React.forwardRef<MessageListRef, MessageListProps>(
  function (props: MessageListProps, ref?: React.ForwardedRef<MessageListRef>) {
    const {
      onLongPressItem,
      onUnreadCount,
      containerStyle,
      visible = true,
      onLayout: onLayoutProps,
      reportProps,
    } = props;
    const { getItems } = useGetItems();
    const _onLongPress = (item: MessageListItemModel) => {
      menuRef?.current?.startShowWithInit?.(
        getItems({
          list: ['Translate', 'Delete', 'Report'],
          onClicked: (type) => {
            if (type === 'Delete') {
              deleteMessage(item.msg);
              menuRef?.current?.startHide?.();
            } else if (type === 'Report') {
              menuRef?.current?.startHide?.(() => {
                // todo : report
              });
            } else if (type === 'Translate') {
              translateMessage(item.msg);
              menuRef?.current?.startHide?.();
            }
          },
          onRequestModalClose: () => {
            menuRef?.current?.startHide?.();
          },
        })
      );
    };
    const {
      data,
      addTextMessage,
      listRef,
      scrollToEnd,
      onEndReached,
      onScroll,
      scrollToLastMessage,
      onScrollBeginDrag,
      onScrollEndDrag,
      onMomentumScrollEnd,
      onLayout,
      translateMessage,
      deleteMessage,
      reportMessage,
    } = useMessageListApi({
      onLongPress: onLongPressItem ?? _onLongPress,
      onUnreadCount,
      onLayoutProps,
    });

    const menuRef = React.useRef<MessageContextMenuRef>({} as any);
    const reportRef = React.useRef<ReportRef>({} as any);

    React.useImperativeHandle(
      ref,
      () => {
        return {
          addNewMessage: (content: string, message?: ChatMessage) => {
            addTextMessage(content, message);
          },
          scrollToEnd: () => {
            scrollToEnd();
          },
        };
      },
      [addTextMessage, scrollToEnd]
    );

    const getReportData = React.useMemo(() => {
      if (reportProps?.data) {
        return reportProps.data;
      }
      return reportDefaultData;
    }, [reportProps?.data]);

    const getOnReport = React.useMemo(() => {
      if (reportProps?.onReport) {
        return { onReport: reportProps.onReport };
      }
      return {
        onReport: (result: ReportItemModel[]) => {
          reportMessage(result);
        },
      };
    }, [reportMessage, reportProps?.onReport]);

    if (visible === false) {
      return null;
    }

    return (
      <>
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
            onScrollBeginDrag={onScrollBeginDrag}
            onScrollEndDrag={onScrollEndDrag}
            onMomentumScrollEnd={onMomentumScrollEnd}
          />
          <UnreadButton onPress={scrollToLastMessage} />
        </View>
        <MessageContextMenu
          ref={menuRef}
          onRequestModalClose={() => {
            menuRef?.current?.startHide?.();
          }}
          list={[]}
        />
        <Report
          ref={reportRef}
          {...reportProps}
          onReport={getOnReport.onReport}
          data={getReportData}
        />
      </>
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

const UnreadButton = ({ onPress }: { onPress: () => void }) => {
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
  const [text, setText] = React.useState('');

  useDispatchListener(
    `_$useMessageListApi_updateUnreadCount`,
    (count: number) => {
      const n = count > 99 ? '99+' : count.toString();
      const content = count === 0 ? '' : `${n} new message(s)`;
      setText(content);
    }
  );

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

const reportDefaultData: ReportItemModel[] = [
  {
    id: seqId('_rp').toString(),
    title: 'Unwelcome commercial content or spam',
    checked: true,
  },
  {
    id: seqId('_rp').toString(),
    title: 'Pornographic or explicit content',
    checked: false,
  },
  {
    id: seqId('_rp').toString(),
    title: 'Child abuse',
    checked: false,
  },
  {
    id: seqId('_rp').toString(),
    title: 'Hate speech or graphic violence',
    checked: false,
  },
  {
    id: seqId('_rp').toString(),
    title: 'Promote terrorism',
    checked: false,
  },
  {
    id: seqId('_rp').toString(),
    title: 'Harassment or bullying',
    checked: false,
  },
];
