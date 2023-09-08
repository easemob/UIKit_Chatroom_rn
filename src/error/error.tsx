import { ErrorCode } from './code';
import { ErrorDescription } from './desc';

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
    this.desc = this._desc(this.code);
  }

  private _desc(code: ErrorCode): ErrorDescription {
    let ret = ErrorDescription.none;
    switch (code) {
      case ErrorCode.none:
        ret = ErrorDescription.none;
        break;
      case ErrorCode.common:
        ret = ErrorDescription.common;
        break;
    }
    return ret;
  }
}
