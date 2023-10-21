import type {
  ChatClient,
  ChatCursorResult,
  ChatMessage,
  ChatRoom,
} from 'react-native-chat-sdk';

import type { UIKitError } from '../error';

export type RoomMemberOperate =
  | 'mute'
  | 'unmute'
  | 'block'
  | 'unblock'
  | 'admin'
  | 'unadmin';

export type RoomState = 'joining' | 'joined' | 'leaving' | 'leaved';

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

export type UserServiceData = {
  userId: string;
  nickName?: string;
  avatarURL?: string;
  gender?: number;
  identify?: string;
};

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

export interface ChatroomServiceListener {
  onUserJoined?(roomId: string, user: UserServiceData): void;
  onUserLeave?(roomId: string, userId: string): void;
  onAnnouncementUpdate?(roomId: string, announcement: string): void;
  onUserBeKicked?(roomId: string, reason: number): void;
  onUserMuted?(roomId: string, userId: string[], operatorId: string): void;
  onUserUnmuted?(roomId: string, userId: string[], operatorId: string): void;
  onUserAdmin?(roomId: string, userId: string, operatorId: string): void;
  onUserUnAmin?(roomId: string, userId: string, operatorId: string): void;
}

export interface ClientServiceListener {
  onConnected?(): void;
  onDisconnected?(reason: DisconnectReasonType): void;
}

export interface MessageServiceListener {
  onMessageReceived?(roomId: string, message: ChatMessage): void;
  onMessageRecalled?(roomId: string, message: ChatMessage): void;
  onGlobalNotifyReceived?(roomId: string, notifyMessage: ChatMessage): void;
}

export type IMServiceListener = ClientServiceListener &
  ChatroomServiceListener &
  MessageServiceListener;

export interface IMService {
  addListener(listener: IMServiceListener): void;
  removeListener(listener: IMServiceListener): void;
  clearListener(): void;

  /**
   * If the built-in method is not enough, you can get the original IM object through this method.
   */
  get client(): ChatClient;

  login(params: {
    userId: string;
    userToken: string;
    userNickname?: string;
    userAvatarURL?: string;
    result: (params: { isOk: boolean; error?: UIKitError }) => void;
  }): Promise<void>;
  logout(): Promise<void>;
  loginState(): Promise<'logged' | 'noLogged'>;

  get userId(): string | undefined;

  getMuter(id: string): number | undefined;
  updateMuter(ids: string[]): void;

  getUserInfo(id: string): UserServiceData | undefined;
  getUserInfos(ids: string[]): UserServiceData[];
  updateUserInfos(users: UserServiceData[]): void;
  fetchUserInfos(ids: string[]): Promise<UserServiceData[]>;
  updateSelfInfo(self: UserServiceData): Promise<void>;
  getNoExisted(ids: string[]): string[];
  getIncludes(key: string): UserServiceData[];

  get roomId(): string | undefined;
  get ownerId(): string | undefined;
  get roomState(): RoomState;

  fetchChatroomList(pageNum: number): Promise<ChatRoom[]>;
  joinRoom(roomId: string, room: { ownerId: string }): Promise<void>;
  leaveRoom(roomId: string): Promise<void>;
  /**
   * When kicked out of the chat room, you can call this method to reset the chat room resources.
   */
  resetRoom(roomId: string): void;
  kickMember(roomId: string, userId: string): Promise<void>;
  fetchMembers(
    roomId: string,
    pageSize: number,
    cursor?: string
  ): Promise<ChatCursorResult<string>>;
  fetchMutedMembers(roomId: string, pageSize: number): Promise<string[]>;
  fetchAnnouncement(roomId: string): Promise<string | undefined>;
  updateAnnouncement(roomId: string, announcement: string): Promise<void>;
  updateMemberState(
    roomId: string,
    userId: string,
    op: RoomMemberOperate
  ): Promise<void>;

  sendText(params: {
    roomId: string;
    content: string;
    mentionIds?: string[];
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): Promise<void>;
  sendGift(params: {
    roomId: string;
    gift: GiftServiceData;
    mentionIds?: string[];
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): Promise<void>;
  sendJoinCmd(params: {
    roomId: string;
    mentionIds?: string[];
    result: (params: {
      isOk: boolean;
      message?: ChatMessage;
      error?: UIKitError;
    }) => void;
  }): Promise<void>;
  recallMessage(messageId: string): Promise<void>;
  reportMessage(params: {
    messageId: string;
    tag: string;
    reason: string;
  }): Promise<void>;
  /**
   * ref: https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support
   * @param message the message object.
   * @param languagesCode the language code.
   * @returns the translated message.
   */
  translateMessage(
    message: ChatMessage,
    languagesCode: string
  ): Promise<ChatMessage>;
}

export type IMServiceInit = {
  appKey: string;
  debugMode?: boolean;
};
