import * as React from 'react';

import { useLifecycle } from '../hook';
import { useIMContext } from './im';
import type { IMServiceListener } from './types';

/**
 * The life cycle of a listener should be as long as the component declaration and should not be added or deleted frequently. Therefore, it is recommended to use `useMemo` or `useRef` to wrap the listener and reduce dependencies.
 * @param listener The IM service object.
 */
export function useIMListener(listener: IMServiceListener) {
  const im = useIMContext();
  useLifecycle(
    React.useCallback(
      (state: 'load' | 'unload') => {
        if (state === 'load') {
          im.addListener(listener);
        } else if (state === 'unload') {
          im.removeListener(listener);
        }
      },
      [im, listener]
    ),
    useIMListener.name
  );
}
