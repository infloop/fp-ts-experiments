import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { TaskEither, taskify } from 'fp-ts/TaskEither';


export const doSomeAsyncWork = <L, R>(milliseconds: number, error: L | null, result: R) => new Promise<R>((resolve, reject) => {
  setTimeout(() => {

    // something is going on here

    if (error) {
      return reject(error);
    }
    return resolve(result);
  }, milliseconds);
});
