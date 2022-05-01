import * as Ap from 'fp-ts/lib/Apply';
import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/Array';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/function';
import { tuple } from './common';



class ApiOneError extends Error {
  public constructor(...args: any) {
    super(...args);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

interface ApiOneResult {
  apiOneResult: string;
}

class ApiTwoError extends Error {
  public constructor(...args: any) {
    super(...args);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

interface ApiTwoResult {
  apiTwoResult: number;
}


class ApiThreeError extends Error {
  public constructor(...args: any) {
    super(...args);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

interface ApiThreeResult {
  apiThreeResult: boolean;
}

class UndoError<T extends Error, R>  extends Error {
  public constructor(public originalError: T, public data?: R) {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const apiOperationOne = (): TE.TaskEither<ApiOneError, ApiOneResult> => {
  return <TE.TaskEither<ApiOneError, ApiOneResult>> <any> 1;
}

const apiOperationOneUndo = (param: string): TE.TaskEither<ApiOneError, void> => {
  return <TE.TaskEither<ApiOneError, void>> <any> 1;
}

const apiOperationTwo = (param: string): TE.TaskEither<ApiTwoError, ApiTwoResult> => {
  return <TE.TaskEither<ApiTwoError, ApiTwoResult>> <any> 1;
}

const apiOperationTwoUndo = (param: number): TE.TaskEither<ApiTwoError, void> => {
  return <TE.TaskEither<ApiTwoError, void>> <any> 1;
}

const apiOperationThree = (param: number): TE.TaskEither<ApiThreeError, ApiThreeResult> => {
  return <TE.TaskEither<ApiThreeError, ApiThreeResult>> <any> 1;
}

const apiOperationThreeUndo = (): TE.TaskEither<ApiThreeError, void> => {
  return <TE.TaskEither<ApiThreeError, void>> <any> 1;
}

// TE.TaskEither<ApiOneError | ApiTwoError | ApiThreeError, {
//   readonly api1: ApiOneResult;
//   readonly api2: ApiTwoResult;
//   readonly api3: ApiThreeResult;
//  }>
const transaction1 = pipe(
  TE.Do,
  TE.bindW('0', () => apiOperationOne()),
  TE.bindW('1', (res) => apiOperationTwo(res[0].apiOneResult)),
  TE.bindW('2', (res) => apiOperationThree(res[1].apiTwoResult)),
  TE.chain((results) => TE.right(results)),
);

const transaction11 = pipe(
  TE.Do,
  TE.bindW('api1', () => pipe(
      apiOperationOne(),
    )
  ),
  TE.bindW('api2', (res) => pipe(
    apiOperationTwo(res.api1.apiOneResult),
    TE.orElse((err2) => pipe(
      TE.rightTask(apiOperationOneUndo(res.api1.apiOneResult)),
      TE.swap,
      TE.mapLeft(
        (err) => err2,
        ),
    ))
  )),
  TE.bindW('api3', (res) => pipe(apiOperationThree(res.api2.apiTwoResult), TE.mapLeft((err) => (new UndoError(err, res))))),
  TE.chain((results) => TE.right(results)),
);


// TE.TaskEither<ApiThreeError, ApiThreeResult>
const transaction2 = pipe(
  apiOperationOne(),
  TE.chain((res) => apiOperationTwo(res.apiOneResult)),
  TE.chain((res) => apiOperationThree(res.apiTwoResult))
);

const transaction3 = pipe(
  [
    () => apiOperationOne(),
    (res) => apiOperationTwo(res[0].apiOneResult),
    (res) => apiOperationThree(res[1].apiTwoResult),
  ],
  (a) => Ap.sequenceT(TE.ApplicativeSeq)(a[0]),

);
const id = x => x;

type Callback<L, R> = (cb: (e: L | null | undefined, r?: R) => void) => void;


const getTwoCb: Callback<number, Error> = (cb) => cb(2);
const getStringCb: Callback<string, Error> = (cb) => cb('hello');
const task1 = TE.taskify(getTwoCb);
const task2 = TE.taskify(getStringCb);
const tasks = tuple([task1(), task2()]);
const results = Ap.sequenceT(T.ApplicativeSeq)(...tasks);

const options = [O.of(123), O.of('asdf')];
const t = Ap.sequenceT(O.Apply)(options[0], options[1]);
