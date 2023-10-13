import type { ErrorCode } from './code';
import type { ErrorDescription } from './desc';
import { getDescription } from './error.impl';

export class UIKitError extends Error {
  code: ErrorCode;
  desc: ErrorDescription;
  constructor(params: {
    code: ErrorCode;
    extra?: string;
    options?: ErrorOptions;
  }) {
    super(params.extra, params.options);
    this.code = params.code;
    this.desc = getDescription(this.code);

    // if (Error.captureStackTrace) {
    //   Error.captureStackTrace(this, UIKitError);
    // } else {
    //   this.stack = new Error(this.toString()).stack;
    // }
    // console.log(this.stack);
  }

  public toString(): string {
    return `code: ${this.code}\n
    desc: ${this.desc}\n
    extra: ${this.message}`;
  }
}
