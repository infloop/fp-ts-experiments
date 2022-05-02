import * as Ap from 'fp-ts/lib/Apply';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { tuple } from '../common';
import { apiOne, ApiOneError, apiTwo, database, Profile, User } from './apis';

const simpleFlowWithOnlyLastError = pipe(
  apiOne.createUser('email@test.com'),
  TE.chain((res) => apiTwo.createProfile('John', 'Brown', res.userId)),
  TE.chain((res) => database.persist(res.userId, res.profileId))
);

const simpleFlowWithIndexesAndAllErrors = pipe(
  TE.Do,
  TE.bindW('0', () => apiOne.createUser('email@test.com')),
  TE.bindW('1', (res) => apiTwo.createProfile('John', 'Brown', res[0].userId)),
  TE.bindW('2', (res) => database.persist(res[0].userId, res[1].profileId)),
  TE.chain((results) => TE.right(results)),
);

const simpleFlowWithKeysAndAllErrors = pipe(
  TE.Do,
  TE.bindW('user', () => apiOne.createUser('email@test.com')),
  TE.bindW('profile', (res) => apiTwo.createProfile('John', 'Brown', res.user.userId)),
  TE.bindW('db', (res) => database.persist(res.user.userId, res.profile.profileId)),
  TE.chain((results) => TE.right(results)),
);

const makeRollback = <E extends Error, T, U extends [T, ...T[]]>(cause: E, actions: U) => ({ cause, actions});

const flowWithRollback = pipe(
  TE.Do,
  TE.bindW('user', () => pipe(
    apiOne.createUser('email@test.com'),
    TE.mapLeft(err => makeRollback(err, [
      TE.Do
    ])),
  )),
  TE.bindW('profile', (res) => pipe(
    apiTwo.createProfile('John', 'Brown', res.user.userId),
    TE.mapLeft(err => makeRollback(err,[
      apiOne.removeUser(res.user.userId),
    ])),
  )),
  TE.bindW('db', (res) => pipe(
    database.persist(res.user.userId, res.profile.profileId),
    TE.mapLeft(err => makeRollback(err,[
      apiOne.removeUser(res.user.userId),
      apiTwo.removeProfile(res.profile.profileId),
    ])),
  )),
  TE.mapLeft(
    (rollback) => pipe(
      rollback.actions,
      (rollbackActions) => Ap.sequenceT(TE.ApplicativeSeq)(...rollbackActions),
      TE.swap,
      TE.map(
        (rollbackResults) => ({
          transactionsError: rollback.cause,
          rollbackError: rollbackResults,
        }),
      ),
      TE.mapLeft(r => ({
        transactionsError: rollback.cause,
      })),
    ),
  ),
);


type Callback<L, R> = (cb: (e: L | null | undefined, r?: R) => void) => void;



const getStringCb: Callback<string, Error> = (cb) => cb('hello');
const task1 = TE.taskify((cb: (d: number) => any) => setTimeout(cb(2), 1000));
const task2 = TE.taskify(getStringCb);
const tasks = tuple([task1(), task2()]);
const results = Ap.sequenceT(T.ApplicativeSeq)(...tasks);

const options = [O.of(123), O.of('asdf')];
const t = Ap.sequenceT(O.Apply)(options[0], options[1]);
