import type { UserServiceData } from '../../room';

export type ParticipantListIteModel = UserServiceData & {
  role?: 'owner' | 'member';
  hasMenu?: boolean;
};
export type ParticipantListType = 'member' | 'muted';
