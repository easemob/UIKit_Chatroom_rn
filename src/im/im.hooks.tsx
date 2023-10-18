import { useLifecycle } from '../hook';
import { useIIMContext } from './im';
import type { IMServiceListener } from './types';

export function useIMListener(listener: IMServiceListener) {
  const im = useIIMContext();
  useLifecycle((state) => {
    if (state === 'load') {
      im.addListener(listener);
    } else if (state === 'unload') {
      im.removeListener(listener);
    }
  }, useIMListener.name);
}
