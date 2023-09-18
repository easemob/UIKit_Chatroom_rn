/* eslint-disable @typescript-eslint/no-unused-vars */
import type { UserInfo, UserService, UserServiceListener } from './types';

export class UserServiceImpl implements UserService {
  addListener(listener: UserServiceListener): void {
    throw new Error('Method not implemented.');
  }
  removeListener(listener: UserServiceListener): void {
    throw new Error('Method not implemented.');
  }
  clearListener(): void {
    throw new Error('Method not implemented.');
  }
  addUserInfo(users: UserInfo[]): void {
    throw new Error('Method not implemented.');
  }
  getUserInfo(userId: string): UserInfo | undefined {
    throw new Error('Method not implemented.');
  }
  getUserInfos(userIds: string[]): UserInfo[] {
    throw new Error('Method not implemented.');
  }
  fetchUserInfosFromServer(userIds: string[]): Promise<UserInfo[]> {
    throw new Error('Method not implemented.');
  }
  removeUserInfo(userId: string): void {
    throw new Error('Method not implemented.');
  }
  updateUserInfo(user: UserInfo): void {
    throw new Error('Method not implemented.');
  }
  uploadMyselfUserInfoToServer(user: UserInfo): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
