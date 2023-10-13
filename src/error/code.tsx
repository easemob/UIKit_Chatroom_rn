export enum ErrorCode {
  none = 0,
  common = 1,
  enum = 10,
  existed = 11,
  params = 12,
  max_count = 13,
  // protocol error 1000 start
  init_error = 1000,
  login_error,

  // network error 2000 start
  network_error = 2000,

  // ui error 3000 start
  ui_error = 3000,

  // dev error 10000 start
  not_impl = 10000,
}
