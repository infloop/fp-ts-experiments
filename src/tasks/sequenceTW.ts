import * as Ap from 'fp-ts/lib/Apply';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { tuple } from '../common';
import { taskEither } from 'fp-ts';

declare const a: TE.TaskEither<string, number>
declare const b: TE.TaskEither<number, { }>

const manualSequenceTW = pipe(
  TE.Do,
  TE.apSW('0', a),
  TE.apSW('1', b),
  TE.map((r) => tuple([r[0], r[1]]))
);

const sequenceTW = <T extends TE.TaskEither<any, any>, U extends [T, ...T[]]>(taskEithers: U) => {
  // TODO
  const apSWs = taskEithers.map((te, index) => TE.apSW(index.toString(), te));

  return pipe(
    TE.Do,
    ...apSWs,
    TE.map((r) => tuple([r[0], r[1]]))
  )
}
