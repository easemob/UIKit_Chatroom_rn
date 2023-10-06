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

export type MessageListItemProps = {
  id: string;
  type: 'voice' | 'text' | 'gift';
  content: MessageListItemContent;
};
