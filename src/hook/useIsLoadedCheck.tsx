import * as React from 'react';

export function useIsLoadedCheck(
  name?: string,
  onChanged?: (isLoaded: boolean) => void
) {
  React.useEffect(() => {
    console.log(`${name ?? useIsLoadedCheck.name}:load:`);
    onChanged?.(true);
    return () => {
      console.log(`${name ?? useIsLoadedCheck.name}:unload:`);
      onChanged?.(false);
    };
  }, [name, onChanged]);
}
