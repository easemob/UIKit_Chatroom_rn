import {
  ChatClient,
  ChatMessage,
  ChatMessageChatType,
  ChatMessageStatusCallback,
  ChatRoom,
  ChatRoomEventListener,
} from 'react-native-chat-sdk';

import { ErrorCode, UIKitError } from '../error';
import type {
  ChatroomMemberOperateType,
  ChatroomService,
  ChatroomServiceListener,
  UserServiceData,
} from './types';

export class ChatroomServiceImpl implements ChatroomService {
  _listeners: Set<ChatroomServiceListener>;
  _chatroomListener: ChatRoomEventListener;
  _memberCursor: string;
  constructor() {
    this._listeners = new Set();
    this._chatroomListener = {
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
    } as ChatRoomEventListener;
    ChatClient.getInstance().roomManager.addRoomListener(
      this._chatroomListener
    );
    this._memberCursor = '';
  }
  destructor() {
    ChatClient.getInstance().roomManager.removeRoomListener(
      this._chatroomListener
    );
  }
  addListener(_listener: ChatroomServiceListener): void {
    this._listeners.add(_listener);
  }
  removeListener(_listener: ChatroomServiceListener): void {
    this._listeners.delete(_listener);
  }
  clearListener(): void {
    this._listeners.clear();
  }
  join(roomId: string, _userId: string): Promise<void> {
    return ChatClient.getInstance().roomManager.joinChatRoom(roomId);
  }
  leave(roomId: string, _userId: string): Promise<void> {
    return ChatClient.getInstance().roomManager.leaveChatRoom(roomId);
  }
  kickMember(roomId: string, userId: string): void {
    ChatClient.getInstance().roomManager.removeChatRoomMembers(roomId, [
      userId,
    ]);
  }
  async fetchMembers(roomId: string, pageSize: number): Promise<string[]> {
    const result =
      await ChatClient.getInstance().roomManager.fetchChatRoomMembers(
        roomId,
        this._memberCursor,
        pageSize
      );
    this._memberCursor = result.cursor;
    return result.list ?? [];
  }
  fetchMutedMembers(roomId: string, pageSize: number): Promise<string[]> {
    return ChatClient.getInstance().roomManager.fetchChatRoomMuteList(
      roomId,
      pageSize
    );
  }
  fetchAnnouncement(roomId: string): Promise<string | undefined> {
    return ChatClient.getInstance().roomManager.fetchChatRoomAnnouncement(
      roomId
    );
  }
  updateAnnouncement(roomId: string, announcement: string): Promise<void> {
    return ChatClient.getInstance().roomManager.updateChatRoomAnnouncement(
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
      return ChatClient.getInstance().roomManager.muteChatRoomMembers(roomId, [
        userId,
      ]);
    } else if (op === 'unmute') {
      return ChatClient.getInstance().roomManager.unMuteChatRoomMembers(
        roomId,
        [userId]
      );
    } else {
      throw new UIKitError({ code: ErrorCode.not_impl });
    }
  }
  sendTextMessage(params: {
    roomId: string;
    content: string;
    mentionIds?: string[] | undefined;
    result: (params: { isOk: boolean; message?: ChatMessage }) => void;
  }): Promise<void> {
    const { roomId, content, result } = params;
    const msg = ChatMessage.createTextMessage(
      roomId,
      content,
      ChatMessageChatType.ChatRoom
    );
    // msg.reactionList = mentionIds; // todo:
    return ChatClient.getInstance().chatManager.sendMessage(msg, {
      onError: (_localMsgId: string) => {
        result({ isOk: false });
      },
      onSuccess: (message: ChatMessage) => {
        result({ isOk: true, message });
      },
    } as ChatMessageStatusCallback);
  }
  sendCustomMessage(params: {
    roomId: string;
    eventType: string;
    eventParams: Record<string, string>;
    mentionIds?: string[];
    result: (params: { isOk: boolean; message?: ChatMessage }) => void;
  }): Promise<void> {
    const { roomId, eventType, eventParams, result } = params;
    const msg = ChatMessage.createCustomMessage(
      roomId,
      eventType,
      ChatMessageChatType.ChatRoom,
      { params: eventParams }
    );
    // msg.reactionList = mentionIds; // todo:
    return ChatClient.getInstance().chatManager.sendMessage(msg, {
      onError: (_localMsgId: string) => {
        result({ isOk: false });
      },
      onSuccess: (message: ChatMessage) => {
        result({ isOk: true, message });
      },
    } as ChatMessageStatusCallback);
  }
  recallMessage(_messageId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  reportMessage(_params: { tag: string; reason: string }): Promise<void> {
    throw new Error('Method not implemented.');
  }
  translateMessage(_message: ChatMessage): Promise<ChatMessage> {
    throw new Error('Method not implemented.');
  }
}
