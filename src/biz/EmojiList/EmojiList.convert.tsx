import _emoji from 'twemoji';

import { FACE_ASSETS } from '../../assets';
import { FACE_ASSETS_UTF16 } from './EmojiList.const';

/**
 * Convert text into emoji text.
 *
 * @param text Text with original symbols.
 * @returns Text with emoji symbols.
 *
 * @example
 *
 * input: U+1F644U+1F910U+1F644U+1F62DU+1F610U+1F610U+1F62DU+1F610U+1F62DU+1F610U+1F62DU+1F641U+1F641U+1F62DU+1F641U+1F62DU+1F62DU+1F610iknbbvvjbff
 *
 * output: 🙄🤐🙄😭😐😐😭😐😭😐😭🙁🙁😭🙁😭😭😐iknbbvvjbff
 */
function toCodePointText(text: string): string {
  let tmp = text;
  for (const key of FACE_ASSETS) {
    // tmp.replaceAll(key, _emoji.convert.fromCodePoint(key.substring(2)));
    const keyTmp = key.replace('+', '\\+');
    tmp = tmp.replace(
      new RegExp(keyTmp, 'g'),
      _emoji.convert.fromCodePoint(key.substring(2))
    );
  }
  return tmp;
}

function fromCodePointText(text: string): string {
  let tmp = text;
  for (const key of FACE_ASSETS_UTF16) {
    tmp = tmp.replace(
      new RegExp(key, 'g'),
      'U+' + _emoji.convert.toCodePoint(key).toUpperCase()
    );
  }
  return tmp;
}

export const emoji = {
  toCodePointText,
  fromCodePointText,
};
