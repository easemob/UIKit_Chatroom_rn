import type { Callback, CallbackParams } from '../utils';

export type ListenerParams = CallbackParams;
export type Listener = Callback;

export interface DispatchInit {}
export interface DispatchApi {
  addListener(key: string, listener: Listener): void;
  removeListener(key: string, listener: Listener): void;
  emit(key: string, ...args: any[]): void;
  emitSync(key: string, ...args: any[]): void;
}
