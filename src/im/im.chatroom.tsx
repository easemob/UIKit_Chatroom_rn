import type { ChatMessage } from 'react-native-chat-sdk';

import type {
  ChatroomMemberOperateType,
  ChatroomService,
  ChatroomServiceListener,
} from './types';

export class ChatroomServiceImpl implements ChatroomService {
  join(_roomId: String, _userId: String): Promise<void> {
    throw new Error('Method not implemented.');
  }
  leave(_roomId: String, _userId: String): Promise<void> {
    throw new Error('Method not implemented.');
  }
  kickMember(_roomId: String, _userId: String): void {
    throw new Error('Method not implemented.');
  }
  fetchMembers(_roomId: String, _pageSize: number): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  fetchMutedMembers(_roomId: String, _pageSize: number): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  fetchAnnouncement(_roomId: String): Promise<string | undefined> {
    throw new Error('Method not implemented.');
  }
  updateAnnouncement(_roomId: String, _announcement: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateMemberState(
    _roomId: String,
    _userId: String,
    _op: ChatroomMemberOperateType
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  sendTextMessage(_params: {
    roomId: String;
    content: string;
    mentionIds?: string[] | undefined;
  }): Promise<void> {
    throw new Error('Method not implemented.');
  }
  sendCustomMessage(_params: {
    roomId: String;
    eventType: string;
    eventParams: Record<string, string>;
    mentionIds?: string[];
  }): Promise<void> {
    throw new Error('Method not implemented.');
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
  addListener(_listener: ChatroomServiceListener): void {
    throw new Error('Method not implemented.');
  }
  removeListener(_listener: ChatroomServiceListener): void {
    throw new Error('Method not implemented.');
  }
  clearListener(): void {
    throw new Error('Method not implemented.');
  }
}
