import moji from 'twemoji';

import { FACE_ASSETS } from '../../assets';

export const gAspectRatio = 300 / 390;

export const FACE_ASSETS_UTF16 = FACE_ASSETS.map((v) => {
  return moji.convert.fromCodePoint(v);
});
