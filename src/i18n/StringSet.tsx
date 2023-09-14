import { createStringSetEn } from './StringSet.en';
import type { StringSet, StringSetType } from './types';

export function createStringSet(type: StringSetType): StringSet {
  switch (type) {
    case 'en':
      return createStringSetEn();
    default:
      break;
  }
  return {};
}
