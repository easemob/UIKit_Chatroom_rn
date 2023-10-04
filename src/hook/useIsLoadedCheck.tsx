import * as React from 'react';

export function useIsLoadedCheck(onChanged?: (isLoaded: boolean) => void) {
  React.useEffect(() => {
    console.log(`${useIsLoadedCheck.name}:load:`);
    onChanged?.(true);
    return () => {
      console.log(`${useIsLoadedCheck.name}:unload:`);
      onChanged?.(false);
    };
  }, [onChanged]);
}
