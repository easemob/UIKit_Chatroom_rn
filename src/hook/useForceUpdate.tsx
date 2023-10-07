import * as React from 'react';

export const useForceUpdate = () => {
  const [, updater] = React.useState(0);
  return { updater: React.useCallback(() => updater((prev) => prev + 1), []) };
};
