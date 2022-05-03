import { wrapError, wrapErrorTagged } from './wrapped-errors';

export const makeRollback = <E extends Error, T, U extends [T, ...T[]]>(cause: E, actions: U) => ({ cause: cause, actions});

export const makeRollbackWrapped = <E extends Error, T, U extends [T, ...T[]]>(cause: E, actions: U) => ({ cause: wrapError(cause), actions});

export const makeRollbackTagged = <E extends Error, T, U extends [T, ...T[]]>(cause: E, actions: U) => ({ cause: wrapErrorTagged(cause), actions});
