import * as React from 'react';

import type { Callback } from '../utils';

export function useDelayExecTask<F extends Callback>(delay: number, f: F) {
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>();
  const _delayExecF = React.useCallback(
    (...args: any) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => f(...args), delay);
    },
    [delay, f]
  ) as F;
  return {
    delayExecTask: _delayExecF,
  };
}
