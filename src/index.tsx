import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-chat-room' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const ChatRoom = NativeModules.ChatRoom
  ? NativeModules.ChatRoom
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return ChatRoom.multiply(a, b);
}

export * from './assets';
export * from './biz/Avatar';
export * from './biz/BottomSheetMenu';
export * from './biz/Chatroom';
export * from './biz/EmojiList';
export * from './biz/GiftFloating';
export * from './biz/GiftList';
export * from './biz/Marquee';
export * from './biz/MemberList';
export * from './biz/Report';
export * from './biz/types';
export * from './config';
export * from './container';
export * from './dispatch';
export * from './error';
export * from './hook';
export * from './i18n';
export * from './im';
export * from './theme';
export * from './ui/Button';
export * from './ui/Image';
export * from './ui/Keyboard';
export * from './ui/Modal';
export * from './ui/TabPage';
export * from './ui/Text';
export * from './ui/TextInput';
export * from './utils';
