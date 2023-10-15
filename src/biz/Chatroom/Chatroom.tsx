import * as React from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import {
  GiftFloating,
  GiftFloatingProps,
  GiftFloatingRef,
} from '../GiftFloating';
import { gGiftFloatingListHeight } from '../GiftFloating/GiftFloating.const'; // for test
import { InputBar, InputBarProps, InputBarRef } from '../InputBar';
import { gInputBarStyleHeight } from '../InputBar/InputBar.const';
import { Marquee, MarqueeProps, MarqueeRef } from '../Marquee';
import {
  MessageContextMenu,
  MessageContextMenuRef,
} from '../MessageContextMenu';
import { MessageList, MessageListProps, MessageListRef } from '../MessageList';
import { gMessageListHeight } from '../MessageList/MessageList.const'; // for test

export type ChatroomProps = React.PropsWithChildren<{
  containerStyle?: StyleProp<ViewStyle>;
  input?: {
    props?: Omit<
      InputBarProps,
      'onInputBarWillShow' | 'onInputBarWillHide' | 'onSend'
    >;
  };
  messageList?: {
    props?: Omit<
      MessageListProps,
      'onRequestCloseInputBar' | 'isInputBarShow' | 'onLongPressItem'
    >;
  };
  marquee?: {
    props?: MarqueeProps;
  };
  gift?: {
    props?: GiftFloatingProps;
  };
  backgroundView?: React.ReactElement;
}>;
type ChatroomState = {
  isInputBarShow: boolean;
};

export class Chatroom extends React.Component<ChatroomProps, ChatroomState> {
  inputBarRef?: React.RefObject<InputBarRef>;
  messageRef?: React.RefObject<MessageListRef>;
  marqueeRef?: React.RefObject<MarqueeRef>;
  menuRef?: React.RefObject<MessageContextMenuRef>;
  giftRef?: React.RefObject<GiftFloatingRef>;
  constructor(props: ChatroomProps) {
    super(props);
    this.inputBarRef = React.createRef();
    this.messageRef = React.createRef();
    this.marqueeRef = React.createRef();
    this.menuRef = React.createRef();
    this.giftRef = React.createRef();
    this.state = {
      isInputBarShow: false,
    };
  }

  /**
   * fot test
   * @returns
   */
  getMarqueeRef() {
    return this.marqueeRef?.current;
  }

  /**
   * fot test
   * @returns
   */
  getGiftFloatingRef() {
    return this.giftRef?.current;
  }

  _getMessageListTop() {
    const mh = gMessageListHeight;
    const ih = gInputBarStyleHeight;
    if (Platform.OS === 'ios') {
      return (
        Dimensions.get('window').height -
        ih - //
        mh -
        34 - // bottom height
        94
      ); // navigator header height
    } else {
      return (
        Dimensions.get('window').height -
        ih -
        mh -
        0 - // bottom height
        56 - // navigator header height
        (StatusBar.currentHeight ?? 0) // android platform
      );
    }
  }

  _getGiftTop() {
    return this._getMessageListTop() - gGiftFloatingListHeight;
  }

  _getBackgroundHeight() {
    if (Platform.OS === 'ios') {
      return (
        Dimensions.get('window').height -
        0 - // bottom height
        94
      ); // navigator header height
    } else {
      return (
        Dimensions.get('window').height -
        0 - // bottom height
        56 - // navigator header height
        (StatusBar.currentHeight ?? 0) // android platform
      );
    }
  }

  componentDidMount?(): void {}
  componentWillUnmount?(): void {}
  componentDidCatch?(_error: Error, _errorInfo: React.ErrorInfo): void {}

  render(): React.ReactNode {
    const {
      containerStyle,
      messageList,
      marquee,
      input,
      gift,
      children,
      backgroundView,
    } = this.props;
    return (
      <View
        style={[
          {
            flex: 1,
            // justifyContent: 'flex-end',
          },
          containerStyle,
        ]}
      >
        <View
          style={{
            flex: 1,
          }}
          onTouchEnd={() => {
            if (this.inputBarRef?.current?.close) {
              this.inputBarRef.current.close();
            }
          }}
        >
          <View
            style={[
              {
                width: '100%',
                height: this._getBackgroundHeight(),
              },
            ]}
          >
            {backgroundView}
          </View>

          <MessageList
            ref={this.messageRef}
            onLongPressItem={() => {
              this.menuRef?.current?.startShow?.();
            }}
            containerStyle={[
              {
                position: 'absolute',
                top: this._getMessageListTop() - 8,
              },
            ]}
            {...messageList?.props}
          />

          <GiftFloating
            ref={this.giftRef}
            containerStyle={{
              left: 16,
              position: 'absolute',
              // bottom: this._getGiftTop(), // The keyboard will push the component up.
              top: this._getGiftTop() - 8 - 8,
            }}
            {...gift?.props}
          />

          <Marquee
            ref={this.marqueeRef}
            containerStyle={{
              position: 'absolute',
              marginTop: 8,
              marginHorizontal: 8,
              width: Dimensions.get('window').width - 16,
            }}
            {...marquee?.props}
          />

          {children}
        </View>

        <InputBar
          ref={this.inputBarRef}
          onSend={(content) => {
            this.messageRef?.current?.addNewMessage?.(content);
            // todo:
          }}
          {...input?.props}
        />

        <MessageContextMenu
          ref={this.menuRef}
          onRequestModalClose={() => {
            this.menuRef?.current?.startHide?.();
          }}
        />
      </View>
    );
  }
}
