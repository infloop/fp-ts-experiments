import { ApiOneError, ApiTwoError, DatabaseError } from '../tasks/apis';

export type WrappedError = { _tag: 'WrappedError', err: Error };

export type WrappedErrorTagged =
  { _tag: 'ApiOneError'; err: ApiOneError } |
  { _tag: 'ApiTwoError'; err: ApiTwoError } |
  { _tag: 'DatabaseError'; err: DatabaseError };

export const isWrappedError = (err: unknown): err is WrappedError => (err && (err['tag'] === 'WrappedError'));

export const wrapError = (err: Error | WrappedError): WrappedError => (isWrappedError(err) ? err : { _tag: 'WrappedError', err });

export const wrapErrorTagged = (err: Error): WrappedErrorTagged => ({ _tag: <any> err.constructor.name, err });
