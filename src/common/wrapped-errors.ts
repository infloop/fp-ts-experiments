import { ApiOneError, ApiTwoError, DatabaseError } from '../tasks/apis';

export type WrappedError = { err: Error };

export type WrappedErrorTagged =
  { _tag: 'ApiOneError'; err: ApiOneError } |
  { _tag: 'ApiTwoError'; err: ApiTwoError } |
  { _tag: 'DatabaseError'; err: DatabaseError };

export const wrapError = (err: Error): WrappedError => ({ err });

export const wrapErrorTagged = (err: Error): WrappedErrorTagged => ({ _tag: <any> err.constructor.name, err });
