import {
  ChatCustomMessageBody,
  ChatMessage,
  ChatMessageType,
} from 'react-native-chat-sdk';

import { ErrorCode, UIKitError } from '../../error';
import {
  chatroom_uikit_gift,
  custom_msg_event_type_gift,
  custom_msg_event_type_join,
  GiftServiceData,
} from '../../im';
import { seqId } from '../../utils';
import { ChatroomBase, ChatroomProps } from './Chatroom';

export class Chatroom extends ChatroomBase {
  constructor(props: ChatroomProps) {
    super(props);
  }
  componentDidMount?(): void {
    this.init();
  }
  componentWillUnmount?(): void {
    this.unInit();
  }
  componentDidCatch?(_error: Error, _errorInfo: React.ErrorInfo): void {}

  async init() {
    this.listener = {
      onUserJoined: (roomId, user) => {
        console.log('test:zuoyu:onUserJoined:', roomId, user);
        if (user.userId === this.im?.userId) {
          this.im?.sendJoinCmd({
            roomId: roomId,
            result: ({ error }) => {
              if (error) this.props.onError?.(error);
            },
          });
        }
      },
      onMessageReceived: (roomId, message) => {
        if (this.im?.roomState === 'joined') {
          if (this.im?.roomId === roomId) {
            if (message.body.type === ChatMessageType.CUSTOM) {
              const body = message.body as ChatCustomMessageBody;
              if (body.event === custom_msg_event_type_gift) {
                this._onReceiveGift(message);
              } else if (body.event === custom_msg_event_type_join) {
                this._onJoinCmd(message);
              }
            }
          }
        }
      },
    };
    this.im?.addListener(this.listener);
    const r = await this.im?.loginState();
    console.log('test:init:', r);
    if (r === 'logged') {
      this.im
        ?.joinRoom(this.props.roomId, { ownerId: this.props.ownerId })
        .catch((e) => {
          this.props.onError?.(
            new UIKitError({ code: ErrorCode.room_join_error, extra: e })
          );
        });
    } else {
      this.props.onError?.(new UIKitError({ code: ErrorCode.login_error }));
    }
  }
  async unInit() {
    if (this.listener) {
      this.im?.removeListener(this.listener);
    }
    const r = await this.im?.loginState();
    if (r === 'logged') {
      this.im?.leaveRoom(this.props.roomId).catch((e) => {
        this.props.onError?.(
          new UIKitError({ code: ErrorCode.room_leave_error, extra: e })
        );
      });
    } else {
      this.props.onError?.(new UIKitError({ code: ErrorCode.login_error }));
    }
  }

  joinRoom(params: {
    roomId: string;
    ownerId: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): void {
    if (this.im?.roomState === 'joined') {
      params?.result({
        isOk: true,
        error: new UIKitError({
          code: ErrorCode.room_join_error,
          desc: 'Already joined the chat room.',
        }),
      });
      return;
    }
    this.im
      ?.joinRoom(params.roomId, { ownerId: params.ownerId })
      .then(() => {
        params.result({ isOk: true });
      })
      .catch((e) => {
        params.result({
          isOk: false,
          error: new UIKitError({
            code: ErrorCode.room_join_error,
            extra: e.toString(),
          }),
        });
      });
  }
  leaveRoom(params: {
    roomId: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): void {
    this.im
      ?.leaveRoom(params.roomId)
      .then(() => {
        params.result({ isOk: true });
      })
      .catch((e) => {
        params.result({
          isOk: false,
          error: new UIKitError({
            code: ErrorCode.room_leave_error,
            extra: e.toString(),
          }),
        });
      });
  }

  _onReceiveGift(message: ChatMessage) {
    const body = message.body as ChatCustomMessageBody;
    const jsonGift = (body.params as any)[chatroom_uikit_gift];

    if (jsonGift) {
      const gift = JSON.parse(jsonGift) as GiftServiceData;
      this.giftRef?.current?.pushTask?.({
        model: {
          id: seqId('_gf').toString(),
          nickName: gift.sender?.nickName ?? gift.sender?.userId ?? 'unknown',
          giftCount: gift.count,
          giftIcon: gift.icon,
          content: this.i18n?.tr("Sent '@${0}'", gift.name) ?? '',
        },
      });
    }
  }
  _onJoinCmd(message: ChatMessage) {
    const user = this.im?.getUserInfo(message.from);
    if (user === undefined) {
      this.im
        ?.fetchUserInfos([message.from])
        .then((list) => {
          this.im?.updateUserInfos(list ?? []);
        })
        .catch((e) => {
          this.im?.sendError({
            error: new UIKitError({
              code: ErrorCode.room_fetch_member_info_error,
              extra: JSON.stringify(e),
            }),
          });
        });
    }
  }
}
