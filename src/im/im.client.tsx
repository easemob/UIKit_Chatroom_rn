import {
  ChatClient,
  ChatConnectEventListener,
  ChatOptions,
} from 'react-native-chat-sdk';

import {
  ClientService,
  ClientServiceListener,
  DisconnectReasonType,
} from './types';

export class ClientServiceImpl implements ClientService {
  _connectListener: ChatConnectEventListener;
  _listeners: Set<ClientServiceListener>;
  constructor(params: {
    appKey: string;
    debugMode?: boolean;
    autoLogin?: boolean;
  }) {
    const { appKey, debugMode, autoLogin } = params;
    this._listeners = new Set();
    this._connectListener = {
      onConnected: () => {
        this._listeners.forEach((v) => {
          v.onConnected();
        });
      },
      onDisconnected: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected(DisconnectReasonType.others);
        });
      },
      onTokenWillExpire: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected(DisconnectReasonType.token_will_expire);
        });
      },
      onTokenDidExpire: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected(DisconnectReasonType.token_did_expire);
        });
      },
      onAppActiveNumberReachLimit: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected(DisconnectReasonType.app_active_number_reach_limit);
        });
      },
      onUserDidLoginFromOtherDevice: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected(
            DisconnectReasonType.user_did_login_from_other_device
          );
        });
      },
      onUserDidRemoveFromServer: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected(DisconnectReasonType.user_did_remove_from_server);
        });
      },
      onUserDidForbidByServer: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected(DisconnectReasonType.user_did_forbid_by_server);
        });
      },
      onUserDidChangePassword: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected(DisconnectReasonType.user_did_change_password);
        });
      },
      onUserDidLoginTooManyDevice: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected(DisconnectReasonType.user_did_login_too_many_device);
        });
      },
      onUserKickedByOtherDevice: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected(DisconnectReasonType.user_kicked_by_other_device);
        });
      },
      onUserAuthenticationFailed: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected(DisconnectReasonType.user_authentication_failed);
        });
      },
    };
    ChatClient.getInstance().addConnectionListener(this._connectListener);
    ChatClient.getInstance()
      .init(
        new ChatOptions({
          appKey: appKey,
          debugModel: debugMode,
          autoLogin: autoLogin,
        })
      )
      .then()
      .catch((e) => {
        console.warn(e);
      });
  }
  destructor() {
    ChatClient.getInstance().removeConnectionListener(this._connectListener);
  }
  currentUserId(): string | undefined {
    return ChatClient.getInstance().currentUserName as string | undefined;
  }
  addListener(listener: ClientServiceListener): void {
    this._listeners.add(listener);
  }
  removeListener(listener: ClientServiceListener): void {
    this._listeners.delete(listener);
  }
  clearListener(): void {
    this._listeners.clear();
  }
  login(params: {
    userId: string;
    userToken: string;
    userNickname?: string | undefined;
    userAvatarURL?: string | undefined;
  }): Promise<void> {
    const { userId, userToken } = params;
    if (userToken.startsWith('00')) {
      return ChatClient.getInstance().loginWithAgoraToken(userId, userToken);
    } else {
      return ChatClient.getInstance().login(userId, userToken);
    }
  }
  logout(): Promise<void> {
    return ChatClient.getInstance().logout();
  }
  getClientInstance(): ChatClient {
    return ChatClient.getInstance();
  }
}
