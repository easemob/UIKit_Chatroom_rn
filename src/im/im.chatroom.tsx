/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ChatMessage } from 'react-native-chat-sdk';

import type {
  ChatroomMemberOperateType,
  ChatroomService,
  ChatroomServiceListener,
} from './types';

export class ChatroomServiceImpl implements ChatroomService {
  join(roomId: String, userId: String): Promise<void> {
    throw new Error('Method not implemented.');
  }
  leave(roomId: String, userId: String): Promise<void> {
    throw new Error('Method not implemented.');
  }
  addMember(roomId: String, userId: String): void {
    throw new Error('Method not implemented.');
  }
  removeMember(roomId: String, userId: String): void {
    throw new Error('Method not implemented.');
  }
  fetchMembers(roomId: String, pageSize: number): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  fetchMutedMembers(roomId: String, pageSize: number): Promise<string[]> {
    throw new Error('Method not implemented.');
  }
  fetchAnnouncement(roomId: String): Promise<string | undefined> {
    throw new Error('Method not implemented.');
  }
  updateAnnouncement(roomId: String, announcement: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  updateMemberInfo(
    roomId: String,
    userId: String,
    op: ChatroomMemberOperateType
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  sendMessage(params: {
    roomId: String;
    content: string;
    mentionIds?: string[] | undefined;
  }): Promise<void> {
    throw new Error('Method not implemented.');
  }
  recallMessage(messageId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  reportMessage(params: { tag: string; reason: string }): Promise<void> {
    throw new Error('Method not implemented.');
  }
  translateMessage(message: ChatMessage): Promise<ChatMessage> {
    throw new Error('Method not implemented.');
  }
  addListener(listener: ChatroomServiceListener): void {
    throw new Error('Method not implemented.');
  }
  removeListener(listener: ChatroomServiceListener): void {
    throw new Error('Method not implemented.');
  }
  clearListener(): void {
    throw new Error('Method not implemented.');
  }
}
