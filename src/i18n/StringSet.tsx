import { createStringSetCn } from './StringSet.cn';
import { createStringSetEn } from './StringSet.en';
import type { StringSet, StringSetType } from './types';

export function createStringSet(type: StringSetType): StringSet {
  switch (type) {
    case 'en':
      return createStringSetEn();
    case 'cn':
      return createStringSetCn();
    default:
      break;
  }
  return {};
}
