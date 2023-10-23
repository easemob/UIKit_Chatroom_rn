import type { createStringSet } from './StringSet';
import type { StringSet, StringSetType, StringSetValueType } from './types';

type CreateStringSet = typeof createStringSet;

export interface Translate {
  tr(key: string, ...args: any[]): string;
}

export class TranslateImpl implements Translate {
  map: Map<string, StringSetValueType>;
  language: StringSetType;
  tr(key: string, ...args: any[]): string {
    const r = this.map.get(key);
    if (r) {
      if (typeof r === 'string') {
        return r;
      } else {
        return r(...args);
      }
    }
    return key;
  }
  currentLanguage(): StringSetType {
    return this.language;
  }
  constructor(params: { func: CreateStringSet; type: StringSetType }) {
    this.map = new Map();
    this.language = params.type;
    const stringSet = params.func(params.type);
    const keys = Object.keys(stringSet);
    for (const key of keys) {
      this.map.set(key, stringSet[key]!);
    }
  }
  addCustom(params: { stringSet: StringSet; type: StringSetType }) {
    const { stringSet } = params;
    const keys = Object.keys(stringSet);
    for (const key of keys) {
      this.map.set(key, stringSet[key]!);
    }
  }
}
