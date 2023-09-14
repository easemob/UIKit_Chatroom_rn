import * as React from 'react';

import { createStringSet } from './StringSet';
import { TranslateImpl } from './Translate';
import type { I18nInit, I18nTr } from './types';

const I18nContext = React.createContext<I18nTr | undefined>(undefined);
I18nContext.displayName = 'UIKitI18nContext';

type I18nContextProps = React.PropsWithChildren<{ value: I18nInit }>;

export function I18nContextProvider({ value, children }: I18nContextProps) {
  const { stringSet, stringSetType } = value;
  const t = new TranslateImpl({ func: createStringSet, type: stringSetType });
  if (stringSet) {
    t.addCustom({ stringSet, type: stringSetType });
  }
  return (
    <I18nContext.Provider value={{ tr: t.tr.bind(t) }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18nContext(): I18nTr {
  const i18n = React.useContext(I18nContext);
  if (!i18n) throw Error(`${I18nContext.displayName} is not provided`);
  return i18n;
}
