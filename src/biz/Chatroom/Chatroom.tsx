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
import { I18nContext, I18nTr } from '../../i18n';
import { IMContext, IMService, IMServiceListener } from '../../im';
import {
  GiftFloating,
  GiftFloatingComponent,
  GiftFloatingProps,
  GiftFloatingRef,
} from '../GiftFloating';
import { gGiftFloatingListHeight } from '../GiftFloating/GiftFloating.const'; // for test
import { InputBar, InputBarProps, InputBarRef } from '../InputBar';
import { gInputBarStyleHeight } from '../InputBar/InputBar.const';
import {
  Marquee,
  MarqueeComponent,
  MarqueeProps,
  MarqueeRef,
} from '../Marquee';
import {
  BottomSheetMemberList,
  BottomSheetMemberListProps,
  BottomSheetMemberListRef,
} from '../MemberList';
import { MessageList, MessageListProps, MessageListRef } from '../MessageList';
import { gMessageListHeight } from '../MessageList/MessageList.const'; // for test
import type { PropsWithError, PropsWithTest } from '../types';

/**
 * Data model for the Chatroom component.
 */
type ChatroomModel = {
  roomId: string;
  ownerId: string;
};
/**
 * Properties of the `Chatroom` component.
 */
export type ChatroomProps = React.PropsWithChildren<
  {
    /**
     * Style of the container. This property can mainly change the display or hiding, position, size, background color, style, etc.
     */
    containerStyle?: StyleProp<ViewStyle>;
    /**
     * Renderer for the GiftFloating component. If not set, the built-in one is used.
     *
     * You can set whether to load through `RoomOption.gift`.
     */
    GiftFloating?: GiftFloatingComponent;
    /**
     * Renderer for the Marquee component. If not set, the built-in one is used.
     *
     * You can set whether to load through `RoomOption.marquee`.
     */
    Marquee?: MarqueeComponent;
    /**
     * Properties of the InputBar component. If not set, the default value is used.
     */
    input?: {
      props?: Omit<
        InputBarProps,
        'onInputBarWillShow' | 'onInputBarWillHide' | 'onSend'
      >;
    };
    /**
     * Properties of the MessageList component. If not set, the default value is used.
     */
    messageList?: {
      props?: Omit<
        MessageListProps,
        'onRequestCloseInputBar' | 'isInputBarShow' | 'onLongPressItem'
      >;
    };
    /**
     * Properties of the Marquee component. If not set, the default value is used.
     */
    marquee?: {
      props?: MarqueeProps;
    };
    /**
     * Properties of the GiftFloating component. If not set, the default value is used.
     */
    gift?: {
      props?: GiftFloatingProps;
    };
    /**
     * Properties of the MemberList component. If not set, the default value is used.
     */
    memberList?: {
      props?: BottomSheetMemberListProps;
    };
    /**
     * Renderer for the background view.
     *
     * Typical usage scenarios: placing background images and placing live videos.
     */
    backgroundView?: React.ReactElement;
  } & ChatroomModel &
    PropsWithTest &
    PropsWithError
>;
/**
 * State variable of the `Chatroom` component.
 */
type ChatroomState = {
  isInputBarShow: boolean;
  pageY: number;
};

let GGiftFloating: GiftFloatingComponent;
let GMarquee: MarqueeComponent;

/**
 * Component for chat room.
 *
 * The ChatroomBase component defines properties and UI styles. The business logic part is separated into `Chatroom`.
 *
 * The Chatroom component is a first-level component, and there are sub-components below. Errors in the request network or caused by business problems will be notified through `IMServiceListener.onError`. If the request network ends, it will be notified through `IMServiceListener.onFinished`.
 */
export abstract class ChatroomBase extends React.PureComponent<
  ChatroomProps,
  ChatroomState
> {
  /**
   * Reference to the InputBar component.
   */
  inputBarRef?: React.RefObject<InputBarRef>;
  /**
   * Reference to the MessageList component.
   */
  messageRef?: React.RefObject<MessageListRef>;
  /**
   * Reference to the Marquee component.
   */
  marqueeRef?: React.RefObject<MarqueeRef>;
  /**
   * Reference to the GiftFloating component.
   */
  giftRef?: React.RefObject<GiftFloatingRef>;
  /**
   * Reference to the MemberList component.
   */
  memberRef?: React.RefObject<BottomSheetMemberListRef>;
  /**
   * Reference to the container.
   */
  containerRef?: React.RefObject<View>;
  /**
   * IM service.
   */
  im?: IMService;
  /**
   * Global Configuration.
   */
  config?: Config;
  /**
   * Internationalization service.
   */
  i18n?: I18nTr;
  /**
   * IM service listener.
   */
  listener?: IMServiceListener;
  constructor(props: ChatroomProps) {
    super(props);

    this.inputBarRef = React.createRef();
    this.messageRef = React.createRef();
    this.marqueeRef = React.createRef();
    this.giftRef = React.createRef();
    this.memberRef = React.createRef();
    this.containerRef = React.createRef();

    GGiftFloating = props.GiftFloating ?? GiftFloating;
    GMarquee = props.Marquee ?? Marquee;

    this.state = {
      isInputBarShow: false,
      pageY: 0,
    };
  }

  /**
   * Get the reference of the InputBar component.
   * @returns MarqueeRef | null.
   */
  getMarqueeRef() {
    return this.marqueeRef?.current;
  }

  /**
   * Get the reference of the InputBar component.
   * @returns GiftFloatingRef | null.
   */
  getGiftFloatingRef() {
    return this.giftRef?.current;
  }

  /**
   * Get the reference of the InputBar component.
   * @returns BottomSheetMemberListRef | null.
   */
  getMemberListRef() {
    return this.memberRef?.current;
  }

  /**
   * Get the reference of the InputBar component.
   * @returns MessageListRef | null.
   */
  getMessageListRef() {
    return this.messageRef?.current;
  }

  /**
   * Join chatroom.
   *
   * Different from `IMService`, it will update the internal state of UI components. It is not recommended to use `IMService.joinRoom` directly
   *
   * @params
   * - roomId: Room ID.
   * - ownerId: Room owner ID.
   * - result: Callback for joining chatroom.
   */
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
                return (
                  <I18nContext.Consumer>
                    {(t) => {
                      this.i18n = t;
                      this.config = config;
                      return this._render();
                    }}
                  </I18nContext.Consumer>
                );
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
          {backgroundView}

          <MessageList
            ref={this.messageRef}
            containerStyle={[
              {
                position: 'absolute',
                top: this._getMessageListTop() - 8,
                // bottom: 54, // !!! Not supported on Android platform.
              },
            ]}
            {...messageList?.props}
          />

          {this.config?.roomOption.gift.isVisible === true ? (
            <GGiftFloating
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
            <GMarquee
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
          onSended={(_content, message) => {
            this.messageRef?.current?.addSendedMessage?.(message);
          }}
          closeAfterSend={true}
          {...input?.props}
        />

        <BottomSheetMemberList
          ref={this.memberRef}
          maskStyle={{ transform: [{ translateY: -this.state.pageY }] }}
          {...memberList?.props}
        />
      </View>
    );
  }
}
