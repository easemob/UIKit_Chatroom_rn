import React from 'react';

import { ChatroomServiceImpl } from './im.chatroom';
import { ClientServiceImpl } from './im.client';
import { GiftServiceImpl } from './im.gift';
import { UserServiceImpl } from './im.user';
import type { IMService, IMServiceInit } from './types';

export const IMContext = React.createContext<IMService | undefined>(undefined);
IMContext.displayName = 'UIKitIMContext';

type IMContextProps = React.PropsWithChildren<{ value: IMServiceInit }>;

export function IMContextProvider({ value, children }: IMContextProps) {
  const {} = value;
  // const s = ChatClient.getInstance();
  // s.init(new ChatOptions({ appKey: appKey, debugModel: debugMode }))
  //   .then()
  //   .catch((e) => {
  //     throw e;
  //   });
  return (
    <IMContext.Provider
      value={{
        client: CreateClientService({}),
        gift: CreateGiftService({}),
        chatroom: CreateChatroomService({}),
        user: CreateUserService({}),
      }}
    >
      {children}
    </IMContext.Provider>
  );
}

export function useIIMContext(): IMService {
  const im = React.useContext(IMContext);
  if (!im) throw Error(`${IMContext.displayName} is not provided`);
  return im;
}

export function CreateChatroomService(params: {}) {
  const {} = params;
  return new ChatroomServiceImpl();
}

export function CreateClientService(params: {}) {
  const {} = params;
  return new ClientServiceImpl();
}

export function CreateGiftService(params: {}) {
  const {} = params;
  return new GiftServiceImpl();
}

export function CreateUserService(params: {}) {
  const {} = params;
  return new UserServiceImpl();
}
