import type { ShadowDesc } from './types';

export function generateShadow(desc: ShadowDesc): ShadowDesc {
  return desc;
}

export function generateSmallShadow(
  color1: string,
  color2: string
): ShadowDesc[] {
  return [
    generateShadow({ x: 0, y: 1, blur: 3, spread: 0, color: color1 }),
    generateShadow({ x: 0, y: 1, blur: 2, spread: 0, color: color2 }),
  ];
}

export function generateMiddleShadow(
  color1: string,
  color2: string
): ShadowDesc[] {
  return [
    generateShadow({ x: 0, y: 1, blur: 3, spread: 0, color: color1 }),
    generateShadow({ x: 0, y: 4, blur: 8, spread: 0, color: color2 }),
  ];
}

export function generateLargeShadow(
  color1: string,
  color2: string
): ShadowDesc[] {
  return [
    generateShadow({ x: 0, y: 24, blur: 36, spread: 0, color: color1 }),
    generateShadow({ x: 8, y: 0, blur: 24, spread: 0, color: color2 }),
  ];
}
