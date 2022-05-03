import * as O from 'fp-ts/Option';
import * as Ap from 'fp-ts/Apply';

const options = [O.of(123), O.of('foo')];

const res: O.Option<[string | number, string | number]> = Ap.sequenceT(O.Apply)(options[0], options[1]);
