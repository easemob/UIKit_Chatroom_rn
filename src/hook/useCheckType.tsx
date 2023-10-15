import * as React from 'react';

import { useGetObjectName } from './useGetObjectName';

const ExpectedType = typeof {};

export function useCheckType() {
  const { getObjectName } = useGetObjectName();
  const ret = React.useMemo(() => {
    return {
      checkType: (
        object: any,
        expectedType: typeof ExpectedType,
        others?: { callerName?: string; objectName?: string }
      ) => {
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
  }, [getObjectName]);
  return ret;
}
