import type { UserServiceData } from '../../im';

export type MemberListIteModel = UserServiceData & {
  role?: 'owner' | 'member';
};
export type MemberListType = 'member' | 'muted';
