import { ErrorCode } from './code';
import { ErrorDescription } from './desc';

export function getDescription(code: ErrorCode): ErrorDescription {
  let ret = ErrorDescription.none;
  switch (code) {
    case ErrorCode.none:
      ret = ErrorDescription.none;
      break;
    case ErrorCode.common:
      ret = ErrorDescription.common;
      break;
    case ErrorCode.enum:
      ret = ErrorDescription.enum;
      break;
    case ErrorCode.existed:
      ret = ErrorDescription.existed;
      break;
    case ErrorCode.params:
      ret = ErrorDescription.params;
      break;
    case ErrorCode.max_count:
      ret = ErrorDescription.max_count;
      break;
    case ErrorCode.init_error:
      ret = ErrorDescription.init_error;
      break;
    case ErrorCode.login_error:
      ret = ErrorDescription.login_error;
      break;
    case ErrorCode.network_error:
      ret = ErrorDescription.network_error;
      break;
    case ErrorCode.ui_error:
      ret = ErrorDescription.ui_error;
      break;
    default:
      break;
  }
  return ret;
}
