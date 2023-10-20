import React from 'react';

import { getIMService, IMServiceImpl } from './im.impl';
import type { IMService, IMServiceInit } from './types';

export const IMContext = React.createContext<IMService | undefined>(undefined);
IMContext.displayName = 'UIKitIMContext';

type IMContextProps = React.PropsWithChildren<{ value: IMServiceInit }>;

export function IMContextProvider({ value, children }: IMContextProps) {
  const {} = value;
  const im = getIMService() as IMServiceImpl;
  im.init({
    appKey: value.appKey,
    debugMode: value.debugMode,
    autoLogin: false,
  });
  return <IMContext.Provider value={im}>{children}</IMContext.Provider>;
}

/**
 * It cannot be unpacked and used, otherwise this object cannot be found.
 */
export function useIMContext(): IMService {
  const im = React.useContext(IMContext);
  if (!im) throw Error(`${IMContext.displayName} is not provided`);
  return im;
}
