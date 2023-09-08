/// https://css-tricks.com/converting-color-spaces-in-javascript/
/// https://codepen.io/jacobq_/pen/WPRNRQ
/// https://www.rapidtables.com/convert/color/index.html
/// https://www.myfixguide.com/color-converter/

export function RGBAToHexACore(rgba: string[]) {
  const rgbaString = rgba;
  const length = rgba.length;
  const rgbaNumber = length === 3 ? [0, 0, 0] : [0, 0, 0, 0];

  for (let index = 0; index < rgbaString.length; index++) {
    const r = rgbaString[index]!;
    if (r.indexOf('%') > -1) {
      const p = Number.parseInt(r.substring(0, r.length - 1), 10) / 100;
      if (index < 3) {
        rgbaNumber[index] = Math.round(p * 255);
      } else {
        rgbaNumber[index] = p;
      }
    } else {
      rgbaNumber[index] = +r;
    }
  }

  let r = rgbaNumber[0]!.toString(16);
  let g = rgbaNumber[1]!.toString(16);
  let b = rgbaNumber[2]!.toString(16);

  if (r.length === 1) r = '0' + r;
  if (g.length === 1) g = '0' + g;
  if (b.length === 1) b = '0' + b;

  if (length === 3) {
    return {
      r: r,
      g: g,
      b: b,
    };
  } else {
    let a = Math.round(rgbaNumber[3]! * 255).toString(16);
    if (a.length === 1) a = '0' + a;
    return {
      r: r,
      g: g,
      b: b,
      a: a,
    };
  }
}

export function RGBToHex(rgb: string, isUpper?: boolean) {
  let ex =
    /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;

  if (ex.test(rgb) === false) {
    throw new Error('Invalid input color');
  }

  // choose correct separator
  let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  // turn "rgb(r,g,b)" into [r,g,b]
  const rgbString = rgb.substring(4).split(')')[0]!.split(sep);

  const ret = RGBAToHexACore(rgbString);
  const hex = `#${ret.r}${ret.g}${ret.b}`;
  return isUpper === true ? hex.toUpperCase() : hex;
}

export function RGBAToHexA(rgba: string, isUpper?: boolean) {
  let ex =
    /^rgba\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){3}))|(((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){3}))\/\s)((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;

  if (ex.test(rgba) === false) {
    throw new Error('Invalid input color');
  }

  let sep = rgba.indexOf(',') > -1 ? ',' : ' ';
  const rgbaString = rgba.substring(5).split(')')[0]!.split(sep);

  // strip the slash if using space-separated syntax
  if (rgba.indexOf('/') > -1) rgbaString.splice(3, 1);

  const ret = RGBAToHexACore(rgbaString);
  const hex = `#${ret.r}${ret.g}${ret.b}${ret.a}`;
  return isUpper === true ? hex.toUpperCase() : hex;
}

export function hexAToRGBACore(hex: string, isPct?: boolean) {
  let r = 0,
    g = 0,
    b = 0,
    a = 1;
  const length = hex.length;

  if (hex.length === 4) {
    r = Number.parseInt('0x' + hex[1] + hex[1], 16);
    g = Number.parseInt('0x' + hex[2] + hex[2], 16);
    b = Number.parseInt('0x' + hex[3] + hex[3], 16);
  } else if (hex.length === 5) {
    r = Number.parseInt('0x' + hex[1] + hex[1], 16);
    g = Number.parseInt('0x' + hex[2] + hex[2], 16);
    b = Number.parseInt('0x' + hex[3] + hex[3], 16);
    a = Number.parseInt('0x' + hex[4] + hex[4], 16);
  } else if (hex.length === 7) {
    r = Number.parseInt('0x' + hex[1] + hex[2], 16);
    g = Number.parseInt('0x' + hex[3] + hex[4], 16);
    b = Number.parseInt('0x' + hex[5] + hex[6], 16);
  } else if (hex.length === 9) {
    r = Number.parseInt('0x' + hex[1] + hex[2], 16);
    g = Number.parseInt('0x' + hex[3] + hex[4], 16);
    b = Number.parseInt('0x' + hex[5] + hex[6], 16);
    a = Number.parseInt('0x' + hex[7] + hex[8], 16);
  }

  if (isPct === true) {
    r = +((r / 255) * 100).toFixed(1);
    g = +((g / 255) * 100).toFixed(1);
    b = +((b / 255) * 100).toFixed(1);
  }
  if (length === 4 || length === 7) {
    return {
      r: r,
      g: g,
      b: b,
    };
  } else {
    // var num = 3.14159;
    // var decimalPlaces = num.toString().split('.')[1].length;
    // console.log(decimalPlaces); // 输出：5
    a = +(a / 255).toFixed(3);
    return {
      r: r,
      g: g,
      b: b,
      a: a,
    };
  }
}

export function hexToRGB(h: string, isPct?: boolean) {
  let ex = /^#([\da-f]{3}){1,2}$/i;
  if (ex.test(h) === false) {
    throw new Error('Invalid input color');
  }

  const ret = hexAToRGBACore(h, isPct);
  return isPct === true
    ? `rgb(${ret.r}%, ${ret.g}%, ${ret.b}%)`
    : `rgb(${ret.r}, ${ret.g}, ${ret.b})`;
}

export function hexAToRGBA(h: string, isPct?: boolean) {
  let ex = /^#([\da-f]{4}){1,2}$/i;
  if (ex.test(h) === false) {
    throw new Error('Invalid input color');
  }

  const ret = hexAToRGBACore(h, isPct);
  return isPct === true
    ? `rgba(${ret.r}%, ${ret.g}%, ${ret.b}%, ${ret.a})`
    : `rgba(${ret.r}, ${ret.g}, ${ret.b}, ${ret.a})`;
}

export function RGBAToHSLACore(rgba: string[]) {
  const rgbaString = rgba;
  const length = rgba.length;
  const rgbaNumber = length === 3 ? [0, 0, 0] : [0, 0, 0, 0];

  for (let index = 0; index < rgbaString.length; index++) {
    const r = rgbaString[index]!;
    if (r.indexOf('%') > -1) {
      const p = Number.parseInt(r.substring(0, r.length - 1), 10) / 100;
      if (index < 3) {
        rgbaNumber[index] = Math.round(p * 255);
      }
    } else {
      rgbaNumber[index] = +r;
    }
  }

  // make r, g, and b fractions of 1
  const r = rgbaNumber[0]! / 255;
  const g = rgbaNumber[1]! / 255;
  const b = rgbaNumber[2]! / 255;

  // find greatest and smallest channel values
  const mn = Math.min(r, g, b);
  const mx = Math.max(r, g, b);
  const delta = mx - mn;
  let h = 0;
  let s = 0;
  let l = 0;

  // calculate hue
  // no difference
  if (delta === 0) h = 0;
  // red is max
  else if (mx === r) h = ((g - b) / delta) % 6;
  // green is max
  else if (mx === g) h = (b - r) / delta + 2;
  // blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // make negative hues positive behind 360°
  if (h < 0) h += 360;

  // calculate lightness
  l = (mx + mn) / 2;

  // calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  if (length === 3) {
    return {
      h: h,
      s: s,
      l: l,
    };
  } else {
    const a = rgbaNumber[3]!;
    return {
      h: h,
      s: s,
      l: l,
      a: a,
    };
  }
}

export function RGBToHSL(rgb: string) {
  let ex =
    /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;
  if (ex.test(rgb) === false) {
    throw new Error('Invalid input color');
  }

  // choose correct separator
  let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
  // turn "rgb(r,g,b)" into [r,g,b]
  const rgbString = rgb.substring(4).split(')')[0]!.split(sep);

  const ret = RGBAToHSLACore(rgbString);
  return `hsl(${ret.h}, ${ret.s}%, ${ret.l}%)`;
}

export function RGBAToHSLA(rgba: string) {
  let ex =
    /^rgba\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){3}))|(((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){3}))\/\s)((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;

  if (ex.test(rgba) === false) {
    throw new Error('Invalid input color');
  }

  let sep = rgba.indexOf(',') > -1 ? ',' : ' ';
  const rgbaString = rgba.substring(5).split(')')[0]!.split(sep);

  // strip the slash if using space-separated syntax
  if (rgba.indexOf('/') > -1) rgbaString.splice(3, 1);

  const ret = RGBAToHSLACore(rgbaString);
  return `hsla(${ret.h}, ${ret.s}%, ${ret.l}%, ${ret.a})`;
}

export function HSLAToRGBACore(hsla: string[], isPct?: boolean) {
  // must be fractions of 1
  const hString = hsla[0]!;
  const s = +hsla[1]!.substring(0, hsla[1]!.length - 1) / 100;
  const l = +hsla[2]!.substring(0, hsla[2]!.length - 1) / 100;

  let h = 0;

  // strip label and convert to degrees (if necessary)
  if (hString.indexOf('deg') > -1) {
    h = +hString.substring(0, hString.length - 3);
  } else if (hString.indexOf('rad') > -1) {
    h = Math.round(
      (+hString.substring(0, hString.length - 3) / (2 * Math.PI)) * 360
    );
  } else if (hString.indexOf('turn') > -1) {
    h = Math.round(+hString.substring(0, hString.length - 4) * 360);
  }

  if (h >= 360) {
    h = +hString % 360;
  } else {
    h = +hString;
  }

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  if (isPct === true) {
    r = +((r / 255) * 100).toFixed(1);
    g = +((g / 255) * 100).toFixed(1);
    b = +((b / 255) * 100).toFixed(1);
  }

  if (hsla.length === 3) {
    return {
      r: r,
      g: g,
      b: b,
    };
  } else {
    const a = +hsla[3]!;
    return {
      r: r,
      g: g,
      b: b,
      a: a,
    };
  }
}

export function HSLToRGB(hsl: string, isPct?: boolean) {
  let ex =
    /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
  if (ex.test(hsl) === false) {
    throw new Error('Invalid input color');
  }

  let sep = hsl.indexOf(',') > -1 ? ',' : ' ';
  const hslString = hsl.substring(4).split(')')[0]!.split(sep);
  const ret = HSLAToRGBACore(hslString, isPct);
  return isPct === true
    ? `rgb(${ret.r}%, ${ret.g}%, ${ret.b}%)`
    : `rgb(${ret.r}, ${ret.g}, ${ret.b})`;
}

export function HSLAToRGBA(hsla: string, isPct?: boolean) {
  let ex =
    /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;

  if (ex.test(hsla) === false) {
    throw new Error('Invalid input color');
  }

  let sep = hsla.indexOf(',') > -1 ? ',' : ' ';
  const hslaString = hsla.substring(5).split(')')[0]!.split(sep);

  // strip the slash if using space-separated syntax
  if (hsla.indexOf('/') > -1) hslaString.splice(3, 1);

  const ret = HSLAToRGBACore(hslaString, isPct);
  return isPct === true
    ? `rgba(${ret.r}%, ${ret.g}%, ${ret.b}%, ${ret.a})`
    : `rgba(${ret.r}, ${ret.g}, ${ret.b}, ${ret.a})`;
}

export function hexAToHSLACore(hex: string) {
  const rgba = hexAToRGBACore(hex, false);
  if (rgba.a) {
    return RGBAToHSLACore([
      rgba.r.toString(),
      rgba.g.toString(),
      rgba.b.toString(),
      rgba.a.toString(),
    ]);
  } else {
    return RGBAToHSLACore([
      rgba.r.toString(),
      rgba.g.toString(),
      rgba.b.toString(),
    ]);
  }
}

export function hexToHSL(hex: string) {
  let ex = /^#([\da-f]{3}){1,2}$/i;
  if (ex.test(hex) === false) {
    throw new Error('Invalid input color');
  }
  const ret = hexAToHSLACore(hex);
  return `hsl(${ret.h}, ${ret.s}%, ${ret.l}%)`;
}

export function hexAToHSLA(hex: string) {
  let ex = /^#([\da-f]{4}){1,2}$/i;
  if (ex.test(hex) === false) {
    throw new Error('Invalid input color');
  }
  const ret = hexAToHSLACore(hex);
  return `hsla(${ret.h}, ${ret.s}%, ${ret.l}%, ${ret.a})`;
}

export function HSLAToHexACore(hsla: string[]) {
  const rgba = HSLAToRGBACore(hsla, false);
  if (rgba.a) {
    return RGBAToHexACore([
      rgba.r.toString(),
      rgba.g.toString(),
      rgba.b.toString(),
      rgba.a.toString(),
    ]);
  }
  return RGBAToHexACore([
    rgba.r.toString(),
    rgba.g.toString(),
    rgba.b.toString(),
  ]);
}

export function HSLToHex(hsl: string, isUpper?: boolean) {
  let ex =
    /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
  if (ex.test(hsl) === false) {
    throw new Error('Invalid input color');
  }
  let sep = hsl.indexOf(',') > -1 ? ',' : ' ';
  const hslString = hsl.substring(4).split(')')[0]!.split(sep);
  const ret = HSLAToHexACore(hslString);
  const hex = `#${ret.r}${ret.g}${ret.b}`;
  return isUpper === true ? hex.toUpperCase() : hex;
}

export function HSLAToHexA(hsla: string, isUpper?: boolean) {
  let ex =
    /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
  if (ex.test(hsla) === false) {
    throw new Error('Invalid input color');
  }
  let sep = hsla.indexOf(',') > -1 ? ',' : ' ';
  const hslaString = hsla.substring(5).split(')')[0]!.split(sep);

  // strip the slash if using space-separated syntax
  if (hsla.indexOf('/') > -1) hslaString.splice(3, 1);

  const ret = HSLAToHexACore(hslaString);
  const hex = `#${ret.r}${ret.g}${ret.b}${ret.a}`;
  return isUpper === true ? hex.toUpperCase() : hex;
}
