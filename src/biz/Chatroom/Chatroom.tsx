import * as React from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

import { Config, ConfigContext } from '../../config';
import type { UIKitError } from '../../error';
import { IMContext, IMService, IMServiceListener } from '../../im';
import {
  GiftFloating,
  GiftFloatingProps,
  GiftFloatingRef,
} from '../GiftFloating';
import { gGiftFloatingListHeight } from '../GiftFloating/GiftFloating.const'; // for test
import { InputBar, InputBarProps, InputBarRef } from '../InputBar';
import { gInputBarStyleHeight } from '../InputBar/InputBar.const';
import { Marquee, MarqueeProps, MarqueeRef } from '../Marquee';
import { MemberList, MemberListProps, MemberListRef } from '../MemberList';
import { MessageList, MessageListProps, MessageListRef } from '../MessageList';
import { gMessageListHeight } from '../MessageList/MessageList.const'; // for test
import type { PropsWithError, PropsWithTest } from '../types';

type ChatroomData = {
  roomId: string;
  ownerId: string;
};
export type ChatroomProps = React.PropsWithChildren<
  {
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
    memberList?: {
      props?: MemberListProps;
    };
    backgroundView?: React.ReactElement;
  } & ChatroomData &
    PropsWithTest &
    PropsWithError
>;
type ChatroomState = {
  isInputBarShow: boolean;
  pageY: number;
};

export abstract class ChatroomBase extends React.PureComponent<
  ChatroomProps,
  ChatroomState
> {
  inputBarRef?: React.RefObject<InputBarRef>;
  messageRef?: React.RefObject<MessageListRef>;
  marqueeRef?: React.RefObject<MarqueeRef>;
  giftRef?: React.RefObject<GiftFloatingRef>;
  memberRef?: React.RefObject<MemberListRef>;
  containerRef?: React.RefObject<View>;
  im?: IMService;
  config?: Config;
  listener?: IMServiceListener;
  constructor(props: ChatroomProps) {
    super(props);

    this.inputBarRef = React.createRef();
    this.messageRef = React.createRef();
    this.marqueeRef = React.createRef();
    this.giftRef = React.createRef();
    this.memberRef = React.createRef();
    this.containerRef = React.createRef();

    this.state = {
      isInputBarShow: false,
      pageY: 0,
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

  getMemberListRef() {
    return this.memberRef?.current;
  }

  abstract joinRoom(params: {
    roomId: string;
    ownerId: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): void;
  abstract leaveRoom(params: {
    roomId: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): void;

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

  render() {
    return (
      <IMContext.Consumer>
        {(im) => {
          this.im = im;
          return (
            <ConfigContext.Consumer>
              {(config) => {
                this.config = config;
                return this._render();
              }}
            </ConfigContext.Consumer>
          );
        }}
      </IMContext.Consumer>
    );
  }

  _render(): React.ReactNode {
    const {
      containerStyle,
      messageList,
      marquee,
      input,
      gift,
      children,
      backgroundView,
      memberList,
    } = this.props;
    return (
      <View
        ref={this.containerRef}
        style={[
          {
            flex: 1,
            // justifyContent: 'flex-end',
          },
          containerStyle,
        ]}
        onLayout={() => {
          this.containerRef?.current?.measure(
            (
              _x: number,
              _y: number,
              _width: number,
              _height: number,
              _pageX: number,
              pageY: number
            ) => {
              this.setState({ pageY: pageY });
            }
          );
        }}
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
            containerStyle={[
              {
                position: 'absolute',
                top: this._getMessageListTop() - 8,
              },
            ]}
            {...messageList?.props}
          />

          {this.config?.roomOption.gift.isVisible === true ? (
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
          ) : null}

          {this.config?.roomOption.marquee.isVisible === true ? (
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
          ) : null}

          {children}
        </View>

        <InputBar
          ref={this.inputBarRef}
          onSended={(content, message) => {
            console.log('test:onSended:', content, message);
            this.messageRef?.current?.addNewMessage?.(content, message);
            // todo:
          }}
          // closeAfterSend={true}
          {...input?.props}
        />

        <MemberList
          ref={this.memberRef}
          maskStyle={{ transform: [{ translateY: -this.state.pageY }] }}
          {...memberList?.props}
        />
      </View>
    );
  }
}
