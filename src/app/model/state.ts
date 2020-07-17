import { Status } from './status';
import { District } from './district';

export interface State {
    stateCode : string,
    stateName : string,
    status : Status,
    newStatus : Status,
    districts : District[]
}