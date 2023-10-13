import { ChatClient } from 'react-native-chat-sdk';

import type { UserService, UserServiceData } from './types';

export class UserServiceImpl implements UserService {
  constructor(params: {}) {
    const {} = params;
  }
  async fetchUserInfosFromServer(
    userIds: string[]
  ): Promise<UserServiceData[]> {
    const list = await ChatClient.getInstance().userManager.fetchUserInfoById(
      userIds
    );
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
  uploadMyselfUserInfoToServer(user: UserServiceData): Promise<void> {
    const p = {
      userId: user.userId,
      nickName: user.nickName,
      avatarUrl: user.avatarURL,
      gender: user.gender,
      ext: { identify: user.identify }.toString(),
    };
    return ChatClient.getInstance().userManager.updateOwnUserInfo(p);
  }
}
