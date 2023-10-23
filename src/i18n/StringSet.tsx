import { createStringSetCn } from './StringSet.cn';
import { createStringSetEn } from './StringSet.en';
import type { StringSet, StringSetType } from './types';

export function createStringSet(type: StringSetType): StringSet {
  switch (type) {
    case 'en':
      return createStringSetEn();
    case 'zh-Hans':
      return createStringSetCn();
    default:
      break;
  }
  return {};
}
