import * as React from 'react';

export function useCompare(object: any, callerName?: string) {
  const ref = React.useRef(object);
  const getObjectName = React.useCallback((object: any) => {
    const objectType = typeof object;
    if (
      objectType === 'bigint' ||
      objectType === 'boolean' ||
      objectType === 'number' ||
      objectType === 'string'
    ) {
      return object;
    } else if (objectType === 'function') {
      return object?.name;
    } else if (objectType === 'object') {
      try {
        const r = JSON.stringify(object);
        return r;
      } catch (error) {
        return object;
      }
    } else if (objectType === 'symbol') {
      const s = object as Symbol;
      return s.toString();
    } else {
      return object;
    }
  }, []);

  const log = `{
    toolName: '${useCompare.name}',
    objectName: '${getObjectName(object)}',
    callerName: '${callerName ?? useCompare?.caller?.name}',
    equalResult: '${ref.current === object}',
  }`;
  if (ref.current !== object) {
    console.warn(log);
  } else {
    console.log(log);
  }
}
