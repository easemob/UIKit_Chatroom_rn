import React from 'react';

import { once2 } from '../utils';
import { getIMService as _getIMService } from './im.impl';
import type { IMService, IMServiceInit } from './types';

/**
 * Context of the IM.
 */
export const IMContext = React.createContext<IMService | undefined>(undefined);
IMContext.displayName = 'UIKitIMContext';

/**
 * Properties of the IM context.
 */
type IMContextProps = React.PropsWithChildren<{
  value: IMServiceInit & { im?: IMService };
}>;

/**
 * The IM context's provider.
 *
 * **Note** IM will be initialized here. If other UIKit is integrated at the same time, the parameters initialized first shall prevail.
 *
 * For example: if `chat uikit sdk` and `chat room uikit sdk` are integrated at the same time, then the parameter initialized first will prevail.
 *
 * It can only be initialized once. Even if it is initialized multiple times, parameters modified in time will not take effect again. The reason is that `CHAT SDK` uses the native platform.
 */
export function IMContextProvider({ value, children }: IMContextProps) {
  const { appKey, debugMode, im, onInitialized } = value;
  const _im = im ?? _getIMService();
  initIM(_im, appKey, debugMode, onInitialized);
  // _im.init({
  //   appKey: appKey,
  //   debugMode: debugMode,
  //   autoLogin: false,
  //   result: ({ isOk, error }) => {
  //     if (isOk === false) {
  //       if (error) _im.sendError({ error: error });
  //     } else {
  //       onInitialized?.();
  //       _im.sendFinished({ event: 'init' });
  //     }
  //   },
  // });
  return <IMContext.Provider value={_im}>{children}</IMContext.Provider>;
}

/**
 * Get the IM context's value.
 * @returns The IM context's value.
 */
export function useIMContext(): IMService {
  const im = React.useContext(IMContext);
  if (!im) throw Error(`${IMContext.displayName} is not provided`);
  return im;
}

/**
 * Get the built-in single instance IM object.
 * @returns The IM service.
 */
export function getIMService(): IMService {
  return _getIMService();
}

const initIM = once2(
  (
    im: IMService,
    appKey: string,
    debugMode: boolean,
    onInitialized?: () => void
  ) => {
    im.init({
      appKey: appKey,
      debugMode: debugMode,
      autoLogin: false,
      result: ({ isOk, error }) => {
        if (isOk === false) {
          if (error) im.sendError({ error: error });
        } else {
          onInitialized?.();
          im.sendFinished({ event: 'init' });
        }
      },
    });
  }
);
