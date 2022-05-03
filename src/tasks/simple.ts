import * as TE from 'fp-ts/TaskEither';
import { tuple } from '../common';
import * as Ap from 'fp-ts/Apply';
import * as T from 'fp-ts/Task';
import * as O from 'fp-ts/Option';

type Callback<L, R> = (cb: (e: L | null | undefined, r?: R) => void) => void;

const getStringCb: Callback<string, Error> = (cb) => cb('hello');

const task1 = TE.taskify((cb: (d: number) => any) => setTimeout(cb(2), 1000));
const task2 = TE.taskify(getStringCb);
const tasks = tuple([task1(), task2()]);
const results = Ap.sequenceT(T.ApplicativeSeq)(...tasks);


