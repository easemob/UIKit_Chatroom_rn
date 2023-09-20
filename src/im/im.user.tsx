import type { UserInfo, UserService, UserServiceListener } from './types';

export class UserServiceImpl implements UserService {
  addListener(_listener: UserServiceListener): void {
    throw new Error('Method not implemented.');
  }
  removeListener(_listener: UserServiceListener): void {
    throw new Error('Method not implemented.');
  }
  clearListener(): void {
    throw new Error('Method not implemented.');
  }
  addUserInfo(_users: UserInfo[]): void {
    throw new Error('Method not implemented.');
  }
  getUserInfo(_userId: string): UserInfo | undefined {
    throw new Error('Method not implemented.');
  }
  getUserInfos(_userIds: string[]): UserInfo[] {
    throw new Error('Method not implemented.');
  }
  fetchUserInfosFromServer(_userIds: string[]): Promise<UserInfo[]> {
    throw new Error('Method not implemented.');
  }
  removeUserInfo(_userId: string): void {
    throw new Error('Method not implemented.');
  }
  updateUserInfo(_user: UserInfo): void {
    throw new Error('Method not implemented.');
  }
  uploadMyselfUserInfoToServer(_user: UserInfo): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
