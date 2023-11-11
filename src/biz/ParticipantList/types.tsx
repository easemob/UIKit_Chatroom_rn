import type { UserServiceData } from '../../room';

export type ParticipantListIteModel = UserServiceData & {
  role?: 'owner' | 'member';
};
export type ParticipantListType = 'member' | 'muted';
