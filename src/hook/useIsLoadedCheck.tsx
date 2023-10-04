import * as React from 'react';

export function useIsLoadedCheck(onChanged?: (isLoaded: boolean) => void) {
  React.useEffect(() => {
    console.log('test:load:');
    onChanged?.(true);
    return () => {
      console.log('test:unload:');
      onChanged?.(false);
    };
  }, [onChanged]);
}
