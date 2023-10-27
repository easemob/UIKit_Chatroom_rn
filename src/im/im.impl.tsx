import {
  ChatClient,
  ChatCursorResult,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageStatusCallback,
  ChatOptions,
  ChatRoom,
} from 'react-native-chat-sdk';

import { ErrorCode, UIKitError } from '../error';
import { asyncTask } from '../utils';
import {
  custom_msg_event_type_gift,
  custom_msg_event_type_join,
} from './im.const';
import {
  DisconnectReasonType,
  GiftServiceData,
  IMService,
  IMServiceListener,
  RoomMemberOperate,
  RoomState,
  UserServiceData,
} from './types';

export abstract class IMServiceImpl implements IMService {
  _listeners: Set<IMServiceListener>;
  _userMap: Map<string, UserServiceData>;
  _muterMap: Map<string, number>;
  _currentRoomId?: string;
  _currentOwnerId?: string;
  _roomState: RoomState;
  _user?: UserServiceData;

  // static _instance?: IMServiceImpl;
  // public static getInstance(): IMService {
  //   if (
  //     IMServiceImpl._instance === null ||
  //     IMServiceImpl._instance === undefined
  //   ) {
  //     IMServiceImpl._instance = new IMServiceImpl();
  //   }
  //   return IMServiceImpl._instance;
  // }

  constructor() {
    this._userMap = new Map();
    this._muterMap = new Map();
    this._listeners = new Set();
    this._roomState = 'leaved';
  }

  async init(params: {
    appKey: string;
    debugMode?: boolean;
    autoLogin?: boolean;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    const { appKey, debugMode, autoLogin } = params;
    const options = new ChatOptions({
      appKey,
      debugModel: debugMode,
      autoLogin,
    });
    try {
      await this.client.init(options);
      params.result?.({ isOk: true });
    } catch (error) {
      params.result?.({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.init_error,
          extra: JSON.stringify(error),
        }),
      });
    }
  }
  unInit() {}

  addListener(listener: IMServiceListener): void {
    this._listeners.add(listener);
  }
  removeListener(listener: IMServiceListener): void {
    this._listeners.delete(listener);
  }
  clearListener(): void {
    this._listeners.clear();
  }

  abstract _updateMember(user: UserServiceData): UserServiceData;
  abstract _removeMember(userId: string): void;
  abstract _clearMember(): void;
  abstract _clearMuter(): void;

  abstract _setRoomId(roomId: string | undefined): void;
  get roomId() {
    return this._currentRoomId;
  }
  abstract _setOwner(ownerId: string): void;
  get ownerId() {
    return this._currentOwnerId;
  }
  abstract _setRoomState(s: RoomState): void;
  get roomState() {
    return this._roomState;
  }

  abstract _reset(): void;
  abstract _join(roomId: string, ownerId: string): void;
  abstract _leave(roomId: string): void;
  abstract _onJoined(roomId: string, ownerId?: string): void;
  abstract _onLeaved(roomId: string): void;

  get client(): ChatClient {
    return ChatClient.getInstance();
  }

  async login(params: {
    userId: string;
    userToken: string;
    userNickname?: string | undefined;
    userAvatarURL?: string | undefined;
    gender?: number;
    identify?: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    const {
      userId,
      userToken,
      userNickname,
      userAvatarURL,
      gender,
      identify,
      result,
    } = params;
    try {
      if (userToken.startsWith('00')) {
        await this.client.loginWithAgoraToken(userId, userToken);
      } else {
        await this.client.login(userId, userToken, false);
      }

      this._user = {
        nickName: userNickname,
        avatarURL: userAvatarURL,
        userId: userId,
        gender: gender,
        identify: identify,
      } as UserServiceData;

      this.client.getCurrentUsername();

      const self = this._userMap.get(userId);
      if (self) {
        this.updateSelfInfo(self);
      }

      result?.({ isOk: true });
    } catch (error: any) {
      if (error?.code === 200) {
        this._updateMember({
          nickName: userNickname,
          avatarURL: userAvatarURL,
          userId: userId,
        });
        this.client.getCurrentUsername();
      }
      result?.({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.login_error,
          extra: JSON.stringify(error),
        }),
      });
    }
  }
  async logout(params: {
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    try {
      await this.client.logout();
      params.result?.({ isOk: true });
      this._user = undefined;
    } catch (error) {
      params.result?.({
        isOk: false,
        error: new UIKitError({ code: ErrorCode.logout_error }),
      });
    }
  }
  async loginState(): Promise<'logged' | 'noLogged'> {
    const r = await this.client.isLoginBefore();
    return r === true ? 'logged' : 'noLogged';
  }
  async refreshToken(params: {
    token: string;
    result?: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void> {
    try {
      await this.client.renewAgoraToken(params.token);
      params?.result?.({ isOk: true });
    } catch (error) {
      params.result?.({
        isOk: false,
        error: new UIKitError({ code: ErrorCode.refresh_token_error }),
      });
    }
  }

  get userId(): string | undefined {
    return this.client.currentUserName as string | undefined;
  }
  getMuter(id: string): number | undefined {
    return this._muterMap.get(id);
  }
  updateMuter(ids: string[]): void {
    for (const id of ids) {
      this._muterMap.set(id, -1);
    }
  }
  getUserInfo(id?: string): UserServiceData | undefined {
    if (id === undefined) return undefined;
    return this._userMap.get(id);
  }
  getUserInfos(ids: string[]): UserServiceData[] {
    return ids
      .map((id) => {
        return this._userMap.get(id);
      })
      .filter((v) => {
        return v !== undefined;
      }) as UserServiceData[];
  }
  updateUserInfos(users: UserServiceData[]): void {
    for (const user of users) {
      this._updateMember(user);
    }
  }
  async fetchUserInfos(ids: string[]): Promise<UserServiceData[]> {
    if (ids === undefined || ids.length === 0) {
      return [];
    }
    const list = await this.client.userManager.fetchUserInfoById(ids);
    if (list) {
      const ret: UserServiceData[] = [];
      for (const item of list) {
        let identify;
        try {
          if (item[1].ext && item[1].ext?.length > 0) {
            identify = JSON.parse(item[1].ext)?.identify;
          }
        } catch (error) {
          console.warn('fetchUserInfos:', error);
        }
        ret.push({
          userId: item[1].userId,
          nickName: item[1].nickName ?? undefined,
          avatarURL: item[1].avatarUrl ?? undefined,
          gender: item[1].gender ?? 0,
          identify: identify,
        });
      }
      return ret;
    }
    return [];
  }
  updateSelfInfo(self: UserServiceData): Promise<void> {
    const p = {
      userId: self.userId,
      nickName: self.nickName,
      avatarUrl: self.avatarURL,
      gender: self.gender,
      ext: JSON.stringify({ identify: self.identify }),
    };
    return this.client.userManager.updateOwnUserInfo(p);
  }
  getNoExisted(ids: string[]): string[] {
    return ids.filter((v) => {
      return !this._userMap.has(v);
    });
  }
  getIncludes(key: string): UserServiceData[] {
    return Array.from(this._userMap, (v) => {
      return v[1];
    }).filter((v) => {
      return v.userId.includes(key);
    });
  }
  async fetchChatroomList(
    pageNum: number,
    pageSize?: number
  ): Promise<ChatRoom[]> {
    const r = await this.client.roomManager.fetchPublicChatRoomsFromServer(
      pageNum,
      pageSize
    );
    return r.list ?? [];
  }
  async joinRoom(roomId: string, room: { ownerId: string }): Promise<void> {
    this._join(roomId, room.ownerId);
    await this.client.roomManager.joinChatRoom(roomId);
    this._onJoined(roomId);
  }
  async leaveRoom(roomId: string): Promise<void> {
    this._leave(roomId);
    await this.client.roomManager.leaveChatRoom(roomId);
    this._onLeaved(roomId);
  }
  resetRoom(roomId: string): void {
    if (roomId === this.roomId) {
      this._setRoomState('leaved');
      this._reset();
    }
  }
  kickMember(roomId: string, userId: string): Promise<void> {
    return this.client.roomManager.removeChatRoomMembers(roomId, [userId]);
  }
  async fetchMembers(
    roomId: string,
    pageSize: number,
    cursor?: string
  ): Promise<ChatCursorResult<string>> {
    return this.client.roomManager.fetchChatRoomMembers(
      roomId,
      cursor,
      pageSize
    );
  }
  fetchMutedMembers(roomId: string, pageSize: number): Promise<string[]> {
    return this.client.roomManager.fetchChatRoomMuteList(roomId, pageSize);
  }
  fetchAnnouncement(roomId: string): Promise<string | undefined> {
    return this.client.roomManager.fetchChatRoomAnnouncement(roomId);
  }
  updateAnnouncement(roomId: string, announcement: string): Promise<void> {
    return this.client.roomManager.updateChatRoomAnnouncement(
      roomId,
      announcement
    );
  }
  updateMemberState(
    roomId: string,
    userId: string,
    op: RoomMemberOperate
  ): Promise<void> {
    if (op === 'mute') {
      return this.client.roomManager.muteChatRoomMembers(roomId, [userId]);
    } else if (op === 'unmute') {
      return this.client.roomManager.unMuteChatRoomMembers(roomId, [userId]);
    } else {
      throw new UIKitError({ code: ErrorCode.not_impl });
    }
  }
  sendText(params: {
    roomId: string;
    content: string;
    mentionIds?: string[];
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void {
    return this._sendTextMessage(params);
  }
  sendGift(params: {
    roomId: string;
    gift: GiftServiceData;
    mentionIds?: string[];
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void {
    return this._sendCustomMessage({
      roomId: params.roomId,
      eventType: custom_msg_event_type_gift,
      eventParams: { chatroom_uikit_gift: JSON.stringify(params.gift) },
      mentionIds: params.mentionIds,
      result: params.result,
    });
  }
  sendJoinCmd(params: {
    roomId: string;
    mentionIds?: string[];
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void {
    return this._sendCustomMessage({
      roomId: params.roomId,
      eventType: custom_msg_event_type_join,
      eventParams: {},
      mentionIds: params.mentionIds,
      result: params.result,
    });
  }

  _sendTextMessage(params: {
    roomId: string;
    content: string;
    mentionIds?: string[] | undefined;
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void {
    const { roomId, content, mentionIds, result } = params;
    const curUserId = this.userId;
    if (curUserId === undefined) {
      result({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.msg_send_error,
          extra: 'Not logged in yet.',
        }),
      });
      return;
    }
    const user = this._userMap.get(curUserId);
    if (user === undefined) {
      throw new UIKitError({
        code: ErrorCode.existed,
        extra: `use is not existed. ${curUserId}`,
      });
    }
    const msg = ChatMessage.createTextMessage(
      roomId,
      content,
      ChatMessageChatType.ChatRoom
    );
    msg.receiverList = mentionIds;
    msg.attributes = { chatroom_uikit_userInfo: user };
    this.client.chatManager
      .sendMessage(msg, {
        onError: (_localMsgId, error) => {
          result({
            isOk: false,
            error: new UIKitError({
              code: ErrorCode.msg_send_error,
              extra: `${error.code}: ${error.description}`,
            }),
          });
        },
        onSuccess: (message: ChatMessage) => {
          result({ isOk: true, message });
        },
      } as ChatMessageStatusCallback)
      .catch((e) => {
        result({
          isOk: false,
          error: new UIKitError({
            code: ErrorCode.msg_send_error,
            extra: `${e.code}: ${e.description}`,
          }),
        });
      });
  }
  _sendCustomMessage(params: {
    roomId: string;
    eventType: string;
    eventParams: Record<string, string>;
    mentionIds?: string[] | undefined;
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): void {
    const { roomId, eventType, eventParams, mentionIds, result } = params;
    const curUserId = this.userId;
    if (curUserId === undefined) {
      result({
        isOk: false,
        error: new UIKitError({
          code: ErrorCode.msg_send_error,
          extra: 'Not logged in yet.',
        }),
      });
      return;
    }
    const msg = ChatMessage.createCustomMessage(
      roomId,
      eventType,
      ChatMessageChatType.ChatRoom,
      { params: eventParams }
    );
    const user = this._userMap.get(curUserId);
    if (user === undefined) {
      throw new UIKitError({
        code: ErrorCode.existed,
        extra: `use is not existed. ${curUserId}`,
      });
    }
    msg.receiverList = mentionIds;
    msg.attributes = { chatroom_uikit_userInfo: user };
    this.client.chatManager
      .sendMessage(msg, {
        onError: (_localMsgId, error) => {
          result({
            isOk: false,
            error: new UIKitError({
              code: ErrorCode.msg_send_error,
              extra: `${error.code}: ${error.description}`,
            }),
          });
        },
        onSuccess: (message: ChatMessage) => {
          result({ isOk: true, message });
        },
      } as ChatMessageStatusCallback)
      .catch((e) => {
        result({
          isOk: false,
          error: new UIKitError({
            code: ErrorCode.msg_send_error,
            extra: `${e.code}: ${e.description}`,
          }),
        });
      });
  }
  recallMessage(messageId: string): Promise<void> {
    return this.client.chatManager.recallMessage(messageId);
  }
  reportMessage(params: {
    messageId: string;
    tag: string;
    reason: string;
  }): Promise<void> {
    const { messageId, tag, reason } = params;
    return this.client.chatManager.reportMessage(messageId, tag, reason);
  }
  translateMessage(
    message: ChatMessage,
    languagesCode: string
  ): Promise<ChatMessage> {
    return this.client.chatManager.translateMessage(message, [languagesCode]);
  }
  sendError(params: { error: UIKitError; from?: string; extra?: any }): void {
    this._listeners.forEach((v) => {
      asyncTask(() => v.onError?.(params));
    });
  }
  // destructor() {}
}

export class IMServicePrivateImpl extends IMServiceImpl {
  constructor() {
    super();
    this._initListener();
  }

  _initListener() {
    this._initConnectListener();
    this._initChatroomListener();
    this._initMessageListener();
  }
  _initConnectListener() {
    this.client.removeAllConnectionListener();
    this.client.addConnectionListener({
      onConnected: () => {
        this._listeners.forEach((v) => {
          v.onConnected?.();
        });
      },
      onDisconnected: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.others);
        });
      },
      onTokenWillExpire: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.token_will_expire);
        });
      },
      onTokenDidExpire: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.token_did_expire);
        });
      },
      onAppActiveNumberReachLimit: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(
            DisconnectReasonType.app_active_number_reach_limit
          );
        });
      },
      onUserDidLoginFromOtherDevice: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(
            DisconnectReasonType.user_did_login_from_other_device
          );
        });
      },
      onUserDidRemoveFromServer: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.user_did_remove_from_server);
        });
      },
      onUserDidForbidByServer: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.user_did_forbid_by_server);
        });
      },
      onUserDidChangePassword: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.user_did_change_password);
        });
      },
      onUserDidLoginTooManyDevice: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(
            DisconnectReasonType.user_did_login_too_many_device
          );
        });
      },
      onUserKickedByOtherDevice: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.user_kicked_by_other_device);
        });
      },
      onUserAuthenticationFailed: () => {
        this._listeners.forEach((v) => {
          v.onDisconnected?.(DisconnectReasonType.user_authentication_failed);
        });
      },
    });
  }
  _initMessageListener() {
    this.client.chatManager.removeAllMessageListener();
    this.client.chatManager.addMessageListener({
      onMessagesRecalled: (messages) => {
        this._listeners.forEach((v) => {
          if (this._currentRoomId) {
            for (const message of messages) {
              v.onMessageRecalled?.(this._currentRoomId, message);
            }
          }
        });
      },
      onMessagesReceived: (messages) => {
        this._listeners.forEach((v) => {
          if (this._currentRoomId) {
            for (const message of messages) {
              v.onMessageReceived?.(this._currentRoomId, message);
            }
          }
        });
      },
    });
  }
  _initChatroomListener() {
    this.client.roomManager.removeAllRoomListener();
    this.client.roomManager.addRoomListener({
      onDestroyed: (params: { roomId: string; roomName?: string }) => {
        this._listeners.forEach((v) => {
          v.onUserBeKicked?.(params.roomId, 1);
        });
      },
      onMemberJoined: (params: { roomId: string; participant: string }) => {
        this._listeners.forEach((v) => {
          v.onUserJoined?.(params.roomId, {
            userId: params.participant,
          } as UserServiceData);
        });
      },
      onMemberExited: (params: {
        roomId: string;
        participant: string;
        roomName?: string;
      }) => {
        this._listeners.forEach((v) => {
          v.onUserLeave?.(params.roomId, params.participant);
        });
      },
      onMemberRemoved: (params: {
        roomId: string;
        participant?: string;
        roomName?: string;
        reason?: string;
      }) => {
        this._listeners.forEach((v) => {
          v.onUserLeave?.(params.roomId, params.participant ?? '');
        });
      },
      onMuteListAdded: (params: {
        roomId: string;
        mutes: Array<string>;
        expireTime?: string;
      }) => {
        this._listeners.forEach((v) => {
          v.onUserMuted?.(params.roomId, params.mutes, '');
        });
      },
      onMuteListRemoved: (params: { roomId: string; mutes: Array<string> }) => {
        this._listeners.forEach((v) => {
          v.onUserUnmuted?.(params.roomId, params.mutes, '');
        });
      },
      onAdminAdded: (params: { roomId: string; admin: string }) => {
        this._listeners.forEach((v) => {
          v.onUserAdmin?.(params.roomId, params.admin, '');
        });
      },
      onAdminRemoved: (params: { roomId: string; admin: string }) => {
        this._listeners.forEach((v) => {
          v.onUserUnAmin?.(params.roomId, params.admin, '');
        });
      },
      onOwnerChanged: (params: {
        roomId: string;
        newOwner: string;
        oldOwner: string;
      }) => {
        const {} = params;
      },
      onAnnouncementChanged: (params: {
        roomId: string;
        announcement: string;
      }) => {
        this._listeners.forEach((v) => {
          v.onAnnouncementUpdate?.(params.roomId, params.announcement);
        });
      },
      onAllowListAdded: (params: {
        roomId: string;
        members: Array<string>;
      }) => {
        const {} = params;
      },
      onAllowListRemoved: (params: {
        roomId: string;
        members: Array<string>;
      }) => {
        const {} = params;
      },
      onAllChatRoomMemberMuteStateChanged: (params: {
        roomId: string;
        isAllMuted: boolean;
      }) => {
        const {} = params;
      },
      onSpecificationChanged: (_room: ChatRoom) => {},
      onAttributesUpdated: (params: {
        roomId: string;
        attributes: Map<string, string>;
        from: string;
      }) => {
        const {} = params;
      },
      onAttributesRemoved: (params: {
        roomId: string;
        removedKeys: Array<string>;
        from: string;
      }) => {
        const {} = params;
      },
    });
  }

  _updateMember(user: UserServiceData): UserServiceData {
    if (this._userMap.has(user.userId)) {
      const old = this._userMap.get(user.userId);
      const n = { ...old, ...user };
      this._userMap.set(user.userId, n);
      return n;
    } else {
      this._userMap.set(user.userId, user);
      return user;
    }
  }
  _removeMember(userId: string): void {
    this._userMap.delete(userId);
  }
  _clearMember(): void {
    this._userMap.clear();
  }
  _clearMuter(): void {
    this._muterMap.clear();
  }

  _setRoomId(roomId: string | undefined): void {
    this._currentRoomId = roomId;
  }
  _setOwner(ownerId: string | undefined): void {
    this._currentOwnerId = ownerId;
  }
  _setRoomState(s: RoomState): void {
    this._roomState = s;
  }

  _reset(): void {
    this._setRoomId(undefined);
    this._setOwner(undefined);
    this._clearMember();
    this._clearMuter();
  }

  _join(roomId: string, ownerId: string): void {
    if (this.roomState === 'leaving' || this.roomState === 'joining') {
      this._reset();
    }
    this._setRoomState('joining');
    this._setRoomId(roomId);
    this._setOwner(ownerId);
    this._updateMember(this._user!);
  }
  _leave(_roomId: string): void {
    this._setRoomState('leaving');
  }
  _onJoined(roomId: string, _ownerId?: string): void {
    this._setRoomState('joined');
    this._listeners.forEach((v) => {
      v.onUserJoined?.(roomId, {
        userId: this.client.currentUserName,
      } as UserServiceData);
    });
  }
  _onLeaved(roomId: string): void {
    this._setRoomState('leaved');
    this._listeners.forEach((v) => {
      v.onUserLeave?.(roomId, this.client.currentUserName);
    });
    this._reset();
  }
}

let gIMService: IMService;

export function getIMService(): IMService {
  if (gIMService === undefined) {
    gIMService = new IMServicePrivateImpl();
  }
  return gIMService;
}

// export class IMServicePrivateImplTest extends IMServicePrivateImpl {
//   constructor() {
//     super();
//   }
//   test() {
//     this._clearMuter();
//   }
// }
