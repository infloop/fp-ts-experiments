import * as Ap from 'fp-ts/lib/Apply';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { makeRollback, wrapError } from '../common';
import { apiOne, apiTwo, database } from './apis';



const flowWithRollbackAndCondition = (doCreateProfile: boolean) => pipe(
  TE.Do,
  TE.bindW('user', () => pipe(
    apiOne.createUser('email@test.com'),
    TE.mapLeft(err => makeRollback(err, [
      TE.Do
    ])),
  )),
  TE.bindW('profile', (res) => pipe(
    doCreateProfile ? apiTwo.createProfile('John', 'Brown', res.user.userId) : TE.of<never, null>(null),
    TE.mapLeft(err => makeRollback(err, [
      pipe(apiOne.removeUser(res.user.userId), TE.mapLeft(wrapError)),
    ])),
  )),
  TE.bindW('db', (res) => pipe(
    database.persist(res.user.userId, res.profile ? res.profile?.profileId : null),
    TE.mapLeft(err => makeRollback(err, [
      pipe(apiOne.removeUser(res.user.userId), TE.mapLeft(wrapError)),
      pipe(res.profile ? apiTwo.removeProfile(res.profile.profileId) : TE.of<never, null>(null), TE.mapLeft(wrapError)),
    ])),
  )),
  TE.mapLeft(
    (rollback) => pipe(
      rollback.actions,
      (rollbackActions) => Ap.sequenceT(TE.ApplySeq)(...rollbackActions),
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

const performAction = async () => {
  const action = await flowWithRollbackAndCondition(true)();

  if (E.isLeft(action)) {
    const errorsEither = await action.left();
    const errors = E.isRight(errorsEither) ? errorsEither.right : E.isLeft(errorsEither) ? errorsEither.left : null;

  }
};




const flowWithRollbackAndCondition2 = (doCreateProfile: boolean) => pipe(
  TE.Do,
  TE.bindW('user', () => apiOne.createUser('email@test.com')),
  TE.mapLeft((r) => wrapError(r)),
  TE.bindW('profile', (res) => doCreateProfile ? apiTwo.createProfile('John', 'Brown', res.user.userId) : TE.of<never, null>(null)),
  TE.mapLeft((r) => wrapError(r)),
  TE.bindW('db', (res) => database.persist(res.user.userId, res.profile ? res.profile?.profileId : null)),
  TE.mapLeft((r) => wrapError(r)),
  // TE.mapLeft(
  //   (rollback) => pipe(
  //     rollback.actions,
  //     (rollbackActions) => Ap.sequenceT(TE.ApplySeq)(...rollbackActions),
  //     TE.swap,
  //     TE.map(
  //       (rollbackResults) => ({
  //         transactionsError: rollback.cause,
  //         rollbackError: rollbackResults,
  //       }),
  //     ),
  //     TE.mapLeft(r => ({
  //       transactionsError: rollback.cause,
  //     })),
  //   ),
  // ),
);
