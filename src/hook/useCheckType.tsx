import * as React from 'react';

import { useGetObjectName } from './useGetObjectName';

const ExpectedType = typeof {};

export function useCheckType(params?: { enabled?: boolean }) {
  const { getObjectName } = useGetObjectName();
  const ret = React.useMemo(() => {
    return {
      checkType: (
        object: any,
        expectedType: typeof ExpectedType,
        others?: { callerName?: string; objectName?: string }
      ) => {
        if (params?.enabled === false) {
          return;
        }
        const log = `{
          toolName: '${useCheckType.name}',
          callerName: '${others?.callerName ?? useCheckType?.caller?.name}',
          objectName: '${others?.objectName ?? getObjectName(object)}',
          expectedType: '${expectedType}',
          equalResult: '${typeof object === expectedType}',
        }`;
        if (typeof object !== expectedType) {
          console.warn(log);
        } else {
          console.log(log);
        }
      },
    };
  }, [getObjectName, params?.enabled]);
  return ret;
}
