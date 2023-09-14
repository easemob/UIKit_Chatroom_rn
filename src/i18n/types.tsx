export type StringSetValueType = string | ((...args: any[]) => string);

export interface StringSet {
  [key: string]: StringSetValueType;
}

export type StringSetType = 'en' | 'cn';

export interface I18nInit {
  stringSetType: StringSetType;
  stringSet?: StringSet;
}

export interface I18nTr {
  tr(key: string, ...args: any[]): string;
}
