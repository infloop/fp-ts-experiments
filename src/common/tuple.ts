import * as T from 'fp-ts/Task';

export const tuple = <T, U extends [T, ...T[]]>(arrayAsTuple: U): U => arrayAsTuple;

// examples
const foo: [number, string] = tuple([1, 'str']);
const bar: [{ a: number }, string] = tuple([{ a: 1 }, 'str']);

