import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as A from 'fp-ts/Array';
import { flow, pipe } from 'fp-ts/function';
import { tuple, wrapError } from '../common';
import { ApiOneError, ApiTwoError, Profile, User } from './apis';


type TE1 = TE.TaskEither<ApiOneError, User>;
type TE2 = TE.TaskEither<ApiTwoError, Profile>;

const actions: [TE1, TE2] = <any> [];

