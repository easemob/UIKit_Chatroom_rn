import type { ChatClient, ChatMessage } from 'react-native-chat-sdk';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { UIKitError } from '../error';

export interface ChatroomServiceListener {
  onMessageReceived?(roomId: string, message: ChatMessage): void;
  onMessageRecalled?(
    roomId: String,
    message: ChatMessage,
    recalledUserId: String
  ): void;
  onGlobalNotifyReceived?(roomId: String, notifyMessage: ChatMessage): void;
  onUserJoined?(roomId: String, user: UserServiceData): void;
  onUserLeave?(roomId: String, userId: String): void;
  onAnnouncementUpdate?(roomId: String, announcement: String): void;
  onUserBeKicked?(roomId: String, reason: number): void;
  onUserMuted?(roomId: String, userId: String, operatorId: String): void;
  onUserUnmuted?(roomId: String, userId: String, operatorId: String): void;
}

export type ChatroomMemberOperateType =
  | 'mute'
  | 'unmute'
  | 'block'
  | 'unblock'
  | 'admin'
  | 'unadmin';

export interface ChatroomService {
  addListener(listener: ChatroomServiceListener): void;
  removeListener(listener: ChatroomServiceListener): void;
  clearListener(): void;
  join(roomId: String, userId: String): Promise<void>;
  leave(roomId: String, userId: String): Promise<void>;
  kickMember(roomId: String, userId: String): void;
  fetchMembers(roomId: String, pageSize: number): Promise<string[]>;
  fetchMutedMembers(roomId: String, pageSize: number): Promise<string[]>;
  fetchAnnouncement(roomId: String): Promise<string | undefined>;
  updateAnnouncement(roomId: String, announcement: string): Promise<void>;
  updateMemberState(
    roomId: String,
    userId: String,
    op: ChatroomMemberOperateType
  ): Promise<void>;
  sendTextMessage(params: {
    roomId: String;
    content: string;
    mentionIds?: string[];
  }): Promise<void>;
  sendCustomMessage(params: {
    roomId: String;
    eventType: string;
    eventParams: Record<string, string>;
    mentionIds?: string[];
  }): Promise<void>;
  recallMessage(messageId: string): Promise<void>;
  reportMessage(params: { tag: string; reason: string }): Promise<void>;
  translateMessage(message: ChatMessage): Promise<ChatMessage>;
}

export type GiftServiceData = {
  id: string;
  name: string;
  price: string;
  count: number;
  icon: string;
  effect: string;
  selected: boolean;
  sendedThenClose: boolean;
  sender?: UserServiceData;
};

export interface GiftServiceListener {
  receiveGift?(gift: GiftServiceData): void;
}

export interface GiftService {
  addListener(listener: GiftServiceListener): void;
  removeListener(listener: GiftServiceListener): void;
  clearListener(): void;
  sendGift(gift: GiftServiceData): Promise<void>;
}

export type UserServiceData = {
  userId: string;
  nickName: string;
  avatarURL: string;
  gender: boolean;
  identify: string;
};

export interface UserServiceListener {
  onUserLoginOtherDevice?(deviceName: string): void;
}

export interface UserService {
  addListener(listener: UserServiceListener): void;
  removeListener(listener: UserServiceListener): void;
  clearListener(): void;
  addUserInfo(users: UserServiceData[]): void;
  getUserInfo(userId: string): UserServiceData | undefined;
  getUserInfos(userIds: string[]): UserServiceData[];
  /**
   * Get user information. Throws exception object {@link UIKitError} on failure. If you use synchronous return, you can use `await getUserInfo('John')`, if you use asynchronous return, you can use `getUserInfo('John').then().catch()`.
   */
  fetchUserInfosFromServer(userIds: string[]): Promise<UserServiceData[]>;
  removeUserInfo(userId: string): void;
  updateUserInfo(user: UserServiceData): void;
  uploadMyselfUserInfoToServer(user: UserServiceData): Promise<void>;
}

export enum DisconnectReasonType {
  token_will_expire = 'token_will_expire',
  token_did_expire = 'token_did_expire',
  app_active_number_reach_limit = 'app_active_number_reach_limit',
  user_did_login_from_other_device = 'user_did_login_from_other_device',
  user_did_remove_from_server = 'user_did_remove_from_server',
  user_did_forbid_by_server = 'user_did_forbid_by_server',
  user_did_change_password = 'user_did_change_password',
  user_did_login_too_many_device = 'user_did_login_too_many_device',
  user_kicked_by_other_device = 'user_kicked_by_other_device',
  user_authentication_failed = 'user_authentication_failed',
  others = 'others',
}

export interface ClientServiceListener {
  onConnected(): void;
  onDisconnected(reason: DisconnectReasonType): void;
}

export interface ClientService {
  addListener(listener: ClientServiceListener): void;
  removeListener(listener: ClientServiceListener): void;
  clearListener(): void;
  login(params: {
    userId: string;
    userToken: string;
    userNickname?: string;
    userAvatarURL?: string;
  }): Promise<void>;
  logout(): Promise<void>;
  currentUser(): string | undefined;
  getClientInstance(): ChatClient;
}

export interface IMService {
  chatroom: ChatroomService;
  client: ClientService;
  gift: GiftService;
  user: UserService;
}

export type IMServiceInit = {
  appKey: string;
  debugMode?: boolean;
};
