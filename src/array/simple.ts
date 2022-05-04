import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as A from 'fp-ts/Array';
import { flow, pipe } from 'fp-ts/function';
import { tuple } from '../common';

type WrappedTyped<T> = { data: T };
type Wrapped = { data: number | string | object };

const multiply2 = (d: number) => d * 2;
const wrap = (d: number | string | object): Wrapped => ({ data: d });
const wrapEx = <T>(d: T): WrappedTyped<T> => ({ data: d });

const numbers = [1, 2, 3, 4];
const numbersTuple = tuple([1, 2, 3, 4]);
const complexTuple = tuple([1, 'str', 3, { a: 1 }]);
const complexTuple2 = tuple([1, 'str', 3, { a: 1 }]);

// number[]
const simpleTransformPipe = pipe(
  numbers,
  A.map(multiply2),
);

// number[]
const simpleTransformTuplePipe = pipe(
  numbersTuple,
  A.map(multiply2),
);

// Wrapped[]
const simpleTransformTuplePipe2 = pipe(
  complexTuple,
  A.map(wrap),
);

// WrappedTyped<string | number | { a: number; }>[]
const simpleTransformTuplePipe3 = pipe(
  complexTuple,
  A.map(wrapEx),
);


// (fa: number[]) => number[]
const simpleTransformFlow = flow(
  A.map(multiply2),
);

const res1 = simpleTransformFlow(numbers);
const res2 = simpleTransformFlow(numbersTuple);

const foo = pipe(
  numbers,
  simpleTransformFlow,
);

