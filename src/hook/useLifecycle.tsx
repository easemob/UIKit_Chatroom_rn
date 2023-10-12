import * as React from 'react';

export function useLifecycle(
  onLifecycle?: (state: 'load' | 'unload') => void,
  callerName?: string
) {
  const cn = callerName ?? useLifecycle?.caller?.name;
  React.useEffect(() => {
    console.log(`{
      toolName: '${useLifecycle.name}',
      callerName: '${cn}',
      state: 'load',
    }`);
    onLifecycle?.('load');
    return () => {
      console.log(`{
        toolName: '${useLifecycle.name}',
        callerName: '${cn}',
        state: 'unload',
      }`);
      onLifecycle?.('unload');
    };
  }, [cn, onLifecycle]);
}
