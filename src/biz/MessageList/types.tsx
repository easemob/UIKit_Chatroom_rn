import type { IconNameType } from '../../assets';

export type TextContent = {
  text: string;
};
export type GiftContent = {
  gift: string;
  text: string;
};
export type VoiceContent = {
  icon: IconNameType;
  length: number;
};

export type MessageListItemContent = TextContent | GiftContent | VoiceContent;

export type MessageListItemBasic = {
  timestamp: number;
  avatar?: string;
  tag?: IconNameType | string;
  nickName: string;
};

export type MessageListItemProps = {
  id: string;
  type: 'voice' | 'text' | 'gift';
  basic: MessageListItemBasic;
  content: MessageListItemContent;
};
