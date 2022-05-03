import { TaskEither } from 'fp-ts/TaskEither';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import { doSomeAsyncWork } from './common';

// API 1

export class ApiOneError extends Error {
  public apiOneArg: string;

  public constructor(...args: any) {
    super(...args);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface User {
  userId: number;
  email: string;
}

export interface ApiOne {
  createUser(email: string): TaskEither<ApiOneError, User>;
  removeUser(userId: number): TaskEither<ApiOneError, void>
}

export const apiOne: ApiOne = {
  createUser: (email: string) =>
    TE.tryCatch(
      () => doSomeAsyncWork<ApiOneError, User>(1000, null, { userId: 1, email }),
      (err: ApiOneError) => err,
    ),
  removeUser: (userId: number) =>
    TE.tryCatch(
      () => doSomeAsyncWork<ApiOneError, void>(1000, null, void 0),
      (err: ApiOneError) => err,
    ),
}

// API 2

export class ApiTwoError extends Error {
  public apiTwoArg: number;

  public constructor(...args: any) {
    super(...args);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface Profile {
  profileId: string;
  userId: number;
  firstName: string;
  lastName: string;
}

export interface ApiTwo {
  createProfile(firstName: string, lastname: string, userId: number): TaskEither<ApiTwoError, Profile>;
  removeProfile(profileId: string): TaskEither<ApiTwoError, void>
}

export const apiTwo: ApiTwo = {
  createProfile: (firstName: string, lastName: string, userId: number) =>
    TE.tryCatch(
      () => doSomeAsyncWork<ApiTwoError, Profile>(1000, null, { profileId: 'wd40', userId: userId, firstName, lastName }),
      (err: ApiTwoError) => err,
    ),
  removeProfile: (profileId: string) =>
    TE.tryCatch(
      () => doSomeAsyncWork<ApiTwoError, void>(1000, null, void 0),
      (err: ApiTwoError) => err,
    ),
}

// Database

export class DatabaseError extends Error {
  public constructor(...args: any) {
    super(...args);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface Entity {
  entityId: number;
  profileId: string;
  userId: number;
}

export interface Database {
  persist(userId: number, profileId: string | void): TaskEither<DatabaseError, Entity>;
}

export const database: Database = {
  persist: (userId: number, profileId: string) =>
    TE.tryCatch(
      () => doSomeAsyncWork<DatabaseError, Entity>(1000, null, { entityId: 1, profileId, userId, }),
      (err: DatabaseError) => err,
    ),
}
