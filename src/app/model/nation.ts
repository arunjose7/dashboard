import { Status } from './status';
import { NewCase } from './newcase';
import { State } from './state';

export interface Nation {
    status : Status,
    newCase : NewCase,
    states : State[]
}