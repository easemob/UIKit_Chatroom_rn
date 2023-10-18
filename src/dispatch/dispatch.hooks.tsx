import { useLifecycle } from '../hook';
import type { Callback } from '../utils';
import { useDispatchContext } from './dispatch';

export function useDispatchListener(key: string, cb: Callback) {
  const { addListener, removeListener } = useDispatchContext();
  useLifecycle((state) => {
    if (state === 'load') {
      addListener(key, cb);
    } else if (state === 'unload') {
      removeListener(key, cb);
    }
  }, useDispatchListener.name);
}
