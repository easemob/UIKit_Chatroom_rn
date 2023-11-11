import type { UserServiceData } from '../../im';

export type ParticipantListIteModel = UserServiceData & {
  role?: 'owner' | 'member';
};
export type ParticipantListType = 'member' | 'muted';
