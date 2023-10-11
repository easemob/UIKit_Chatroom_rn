import type {
  UserService,
  UserServiceData,
  UserServiceListener,
} from './types';

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
  addUserInfo(_users: UserServiceData[]): void {
    throw new Error('Method not implemented.');
  }
  getUserInfo(_userId: string): UserServiceData | undefined {
    throw new Error('Method not implemented.');
  }
  getUserInfos(_userIds: string[]): UserServiceData[] {
    throw new Error('Method not implemented.');
  }
  fetchUserInfosFromServer(_userIds: string[]): Promise<UserServiceData[]> {
    throw new Error('Method not implemented.');
  }
  removeUserInfo(_userId: string): void {
    throw new Error('Method not implemented.');
  }
  updateUserInfo(_user: UserServiceData): void {
    throw new Error('Method not implemented.');
  }
  uploadMyselfUserInfoToServer(_user: UserServiceData): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
