export type StringSetValueType = string | ((...args: any[]) => string);

export interface StringSet {
  [key: string]: StringSetValueType;
}

/**
 * https://learn.microsoft.com/en-us/azure/ai-services/translator/language-support
 */
export type StringSetType =
  | 'en'
  | 'zh-Hans'
  | 'zh-Hant'
  | 'ru'
  | 'de'
  | 'fr'
  | 'ja'
  | 'ko';

export type CreateStringSet = (type: StringSetType) => StringSet;

export interface I18nInit {
  stringSetType: StringSetType;
  stringSet?: StringSet;
  factory?: CreateStringSet;
}

export interface I18nTr {
  tr(key: string, ...args: any[]): string;
  currentLanguage: () => StringSetType;
}
