import * as Ap from 'fp-ts/lib/Apply';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import * as TT from 'fp-ts/lib/TaskThese';
import { flow, pipe } from 'fp-ts/function';
import { wrapError } from '../common';
import { taskEither } from 'fp-ts';
import { Apply, Apply1, Apply2 } from 'fp-ts/lib/Apply';
import { HKT, Kind2, URIS2 } from 'fp-ts/HKT';

const tupleConstructors: Record<number, (a: unknown) => any> = {
  1: (a) => [a],
  2: (a) => (b: any) => [a, b],
  3: (a) => (b: any) => (c: any) => [a, b, c],
  4: (a) => (b: any) => (c: any) => (d: any) => [a, b, c, d],
  5: (a) => (b: any) => (c: any) => (d: any) => (e: any) => [a, b, c, d, e]
}

export function tuple<T extends ReadonlyArray<any>>(...t: T): T {
  return t
}

function curried(f: Function, n: number, acc: ReadonlyArray<unknown>) {
  return function (x: unknown) {
    const combined = Array(acc.length + 1)
    for (let i = 0; i < acc.length; i++) {
      combined[i] = acc[i]
    }
    combined[acc.length] = x
    return n === 0 ? f.apply(null, combined) : curried(f, n - 1, combined)
  }
}

function getTupleConstructor(len: number): (a: unknown) => any {
  if (!tupleConstructors.hasOwnProperty(len)) {
    tupleConstructors[len] = curried(tuple, len - 1, [])
  }
  return tupleConstructors[len]
}

export function sequenceTW<F extends URIS2>(
  F: Apply2<F>
): <E, T extends Array<Kind2<F, E, any>>>(
  ...t: T & { readonly 0: Kind2<F, E, any> }
) => Kind2<F, E, { [K in keyof T]: [T[K]] extends [Kind2<F, E, infer A>] ? A : never }>
export function sequenceTW<F>(F: Apply<F>): any {
  return <A>(...args: Array<HKT<F, A>>) => {
    const len = args.length
    const f = getTupleConstructor(len)
    let fas = F.map(args[0], f)
    for (let i = 1; i < len; i++) {
      fas = F.ap(fas, args[i])
    }
    return fas
  }
}
