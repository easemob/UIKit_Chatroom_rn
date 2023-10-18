import {
  ChatClient,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageStatusCallback,
  ChatOptions,
  ChatRoom,
} from 'react-native-chat-sdk';

import { ErrorCode, UIKitError } from '../error';
import { ChatroomServiceImpl } from './im.chatroom';
import { ClientServiceImpl } from './im.client';
import {
  custom_msg_event_type_gift,
  custom_msg_event_type_join,
} from './im.const';
import { GiftServiceImpl } from './im.gift';
import { UserServiceImpl } from './im.user';
import {
  ChatroomMemberOperateType,
  DisconnectReasonType,
  GiftServiceData,
  IMService,
  IMServiceListener,
  UserServiceData,
} from './types';

export function CreateChatroomService(params: {}) {
  const {} = params;
  return new ChatroomServiceImpl();
}

export function CreateClientService(params: {
  appKey: string;
  debugMode?: boolean;
  autoLogin?: boolean;
}) {
  return new ClientServiceImpl(params);
}

export function CreateGiftService(params: {}) {
  const {} = params;
  return new GiftServiceImpl();
}

export function CreateUserService(params: {}) {
  return new UserServiceImpl(params);
}

export abstract class IMServiceImpl implements IMService {
  _listeners: Set<IMServiceListener>;
  _userMap: Map<string, UserServiceData>;
  _muterMap: Map<string, boolean>;
  _currentRoomId?: string;
  _currentOwnerId?: string;

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
  }

  init(params: {
    appKey: string;
    debugMode?: boolean;
    autoLogin?: boolean;
  }): Promise<void> {
    const { appKey, debugMode, autoLogin } = params;
    const options = new ChatOptions({
      appKey,
      debugModel: debugMode,
      autoLogin,
    });
    return this.client.init(options);
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

  abstract _updateMember(user: UserServiceData): void;
  abstract _removeMember(userId: string): void;
  abstract _clearMember(): void;

  abstract _updateMuter(userId: string, isMuted: boolean): void;
  abstract _removeMuter(userId: string): void;
  abstract _clearMuter(): void;

  abstract _setRoomId(roomId: string | undefined): void;
  abstract _setOwner(ownerId: string): void;
  abstract _join(roomId: string, ownerId?: string): void;
  abstract _leave(roomId: string): void;

  get client(): ChatClient {
    return ChatClient.getInstance();
  }

  async login(params: {
    userId: string;
    userToken: string;
    userNickname?: string | undefined;
    userAvatarURL?: string | undefined;
    result: (params: { isOk: boolean }) => void;
  }): Promise<void> {
    const { userId, userToken, userNickname, userAvatarURL, result } = params;
    if (userToken.startsWith('00')) {
      return this.client
        .loginWithAgoraToken(userId, userToken)
        .then(() => {
          this._updateMember({
            nickName: userNickname,
            avatarURL: userAvatarURL,
            userId: userId,
          });
          const self = this._userMap.get(userId);
          if (self) {
            this.updateSelfInfo(self);
          }

          result?.({ isOk: true });
        })
        .catch(() => {
          result?.({ isOk: true });
        });
    } else {
      return this.client
        .login(userId, userToken, false)
        .then(() => {
          this._updateMember({
            nickName: userNickname,
            avatarURL: userAvatarURL,
            userId: userId,
          });
          const self = this._userMap.get(userId);
          if (self) {
            this.updateSelfInfo(self);
          }

          result?.({ isOk: true });
        })
        .catch(() => {
          result?.({ isOk: true });
        });
    }
  }
  logout(): Promise<void> {
    return this.client.logout();
  }
  currentUserId(): string | undefined {
    return this.client.currentUserName as string | undefined;
  }
  getUserInfo(id: string): UserServiceData | undefined {
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
  updateUserInfo(user: UserServiceData): void {
    this._updateMember(user);
  }
  async fetchUserInfos(ids: string[]): Promise<UserServiceData[]> {
    const list = await this.client.userManager.fetchUserInfoById(ids);
    if (list) {
      const ret: UserServiceData[] = [];
      for (const item of list) {
        ret.push({
          userId: item[1].userId,
          nickName: item[1].nickName ?? '',
          avatarURL: item[1].avatarUrl ?? '',
          gender: item[1].gender ?? 0,
          identify: JSON.parse(item[1].ext ?? '')?.identify ?? '',
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
      ext: { identify: self.identify }.toString(),
    };
    return this.client.userManager.updateOwnUserInfo(p);
  }
  join(roomId: string, info?: ChatRoom): Promise<void> {
    this._join(roomId, info?.owner);
    return this.client.roomManager.joinChatRoom(roomId);
  }
  leave(roomId: string): Promise<void> {
    this._leave(roomId);
    return this.client.roomManager.leaveChatRoom(roomId);
  }
  kickMember(roomId: string, userId: string): void {
    this.client.roomManager.removeChatRoomMembers(roomId, [userId]);
  }
  async fetchMembers(
    roomId: string,
    pageSize: number,
    cursor?: string
  ): Promise<string[]> {
    const result = await this.client.roomManager.fetchChatRoomMembers(
      roomId,
      cursor,
      pageSize
    );
    return result.list ?? [];
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
    op: ChatroomMemberOperateType
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
      reason?: string;
    }) => void;
  }): Promise<void> {
    return this._sendTextMessage(params);
  }
  sendGift(params: {
    roomId: string;
    gift: GiftServiceData;
    mentionIds?: string[];
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      reason?: string;
    }) => void;
  }): Promise<void> {
    return this._sendCustomMessage({
      roomId: params.roomId,
      eventType: custom_msg_event_type_gift,
      eventParams: { gift: JSON.stringify(params.gift) },
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
      reason?: string;
    }) => void;
  }): Promise<void> {
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
      reason?: string;
    }) => void;
  }): Promise<void> {
    const { roomId, content, mentionIds, result } = params;
    const curUserId = this.currentUserId();
    if (curUserId === undefined) {
      result({ isOk: false, reason: 'not login' });
      return new Promise(() => {});
    }
    const user = this._userMap.get(curUserId);
    if (user === undefined) {
      throw new UIKitError({ code: ErrorCode.existed });
    }
    const msg = ChatMessage.createTextMessage(
      roomId,
      content,
      ChatMessageChatType.ChatRoom
    );
    msg.receiverList = mentionIds;
    msg.attributes = user;
    return this.client.chatManager.sendMessage(msg, {
      onError: (_localMsgId: string) => {
        result({ isOk: false });
      },
      onSuccess: (message: ChatMessage) => {
        result({ isOk: true, message });
      },
    } as ChatMessageStatusCallback);
  }
  _sendCustomMessage(params: {
    roomId: string;
    eventType: string;
    eventParams: Record<string, string>;
    mentionIds?: string[] | undefined;
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      reason?: string;
    }) => void;
  }): Promise<void> {
    const { roomId, eventType, eventParams, result } = params;
    const curUserId = this.currentUserId();
    if (curUserId === undefined) {
      result({ isOk: false, reason: 'not login' });
      return new Promise(() => {});
    }
    const user = this._userMap.get(curUserId);
    if (user === undefined) {
      throw new UIKitError({ code: ErrorCode.existed });
    }
    const msg = ChatMessage.createCustomMessage(
      roomId,
      eventType,
      ChatMessageChatType.ChatRoom,
      { params: eventParams }
    );
    return this.client.chatManager.sendMessage(msg, {
      onError: (_localMsgId: string) => {
        result({ isOk: false });
      },
      onSuccess: (message: ChatMessage) => {
        result({ isOk: true, message });
      },
    } as ChatMessageStatusCallback);
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

  _updateMember(user: UserServiceData): void {
    if (this._userMap.has(user.userId)) {
      const old = this._userMap.get(user.userId);
      const n = { ...old, ...user };
      this._userMap.set(user.userId, n);
    } else {
      this._userMap.set(user.userId, user);
    }
  }
  _removeMember(userId: string): void {
    this._userMap.delete(userId);
  }
  _clearMember(): void {
    this._userMap.clear();
  }

  _updateMuter(userId: string, isMuted: boolean): void {
    this._muterMap.set(userId, isMuted);
  }
  _removeMuter(userId: string): void {
    this._muterMap.delete(userId);
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

  _join(roomId: string, ownerId?: string): void {
    this._setRoomId(roomId);
    if (ownerId) {
      this._setOwner(ownerId);
    }
  }
  _leave(_roomId: string): void {
    this._setRoomId(undefined);
    this._setOwner(undefined);
    this._clearMember();
    this._clearMuter();
  }
}

let gIMService: IMService;

export function getIMService(): IMService {
  if (gIMService === undefined) {
    gIMService = new IMServicePrivateImpl();
  }
  return gIMService;
}
