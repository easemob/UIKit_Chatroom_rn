/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ChatClient } from 'react-native-chat-sdk';

import type { ClientService, ClientServiceListener } from './types';

export class ClientServiceImpl implements ClientService {
  currentUser(): string | undefined {
    throw new Error('Method not implemented.');
  }
  addListener(listener: ClientServiceListener): void {
    throw new Error('Method not implemented.');
  }
  removeListener(listener: ClientServiceListener): void {
    throw new Error('Method not implemented.');
  }
  clearListener(): void {
    throw new Error('Method not implemented.');
  }
  login(params: {
    userId: string;
    userToken: string;
    userNickname?: string | undefined;
    userAvatarURL?: string | undefined;
  }): Promise<void> {
    throw new Error('Method not implemented.');
  }
  logout(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getClientInstance(): ChatClient {
    throw new Error('Method not implemented.');
  }
}
