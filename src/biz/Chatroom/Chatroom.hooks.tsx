import { ErrorCode, UIKitError } from '../../error';
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
        console.log('test:onUserJoined:', roomId, user);
      },
    };
    this.im?.addListener(this.listener);
    const r = await this.im?.loginState();
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
    if (this.im?.roomState === 'joined' || this.im?.roomState === 'joining') {
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
            code: ErrorCode.room_join_error,
            extra: e.toString(),
          }),
        });
      });
  }
}
