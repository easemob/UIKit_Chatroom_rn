import type { PartialDeep } from 'src/types';

export function mergeObjects<T extends Object>(
  part: PartialDeep<T>,
  full: T
): any {
  const mergedObj = { ...full };

  for (const key in part) {
    if (part?.hasOwnProperty?.(key)) {
      const k = key as Extract<keyof T, string>;
      if (
        typeof part[key] === 'object' &&
        full.hasOwnProperty(key) &&
        typeof full[k] === 'object'
      ) {
        // 如果属性值是对象，则递归合并
        mergedObj[k] = mergeObjects(part[key] as any, full[k]);
      } else {
        // 否则直接使用 A 中的属性
        mergedObj[k] = part[key] as any;
      }
    }
  }

  return mergedObj;
}
