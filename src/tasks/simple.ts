import * as TE from 'fp-ts/TaskEither';
import * as TT from 'fp-ts/TaskThese';
import { tuple } from '../common';
import * as Ap from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { matchEW } from 'fp-ts/TaskThese';

type Callback<L, R> = (cb: (e: L | null | undefined, r?: R) => void) => void;

const getStringCb: Callback<string, Error> = (cb) => cb('hello');

const task1 = TE.taskify((cb: (d: number) => any) => setTimeout(cb(2), 1000));
const task2 = TE.taskify(getStringCb);
const tasks = tuple([task1(), task2()]);
const results = Ap.sequenceT(T.ApplicativeSeq)(...tasks);

// multiple tasks

type A = { a: string };
type B = { b: number };
declare const a: TE.TaskEither<string, A>;
declare const b: TE.TaskEither<number, B>;

const manual = pipe(
  TE.Do,
  TE.apSW('0', a),
  TE.apSW('1', b),
  TE.map((r) => tuple([r[0], r[1]]))
);

const manual2 = pipe(
  TE.Do,
  TE.bindW('0', () => a),
  TE.bindW('1', () => b),
  TT.fromTask,
  TT.map( (r) => )
);
