import { Status } from './status';
import { NewCase } from './newcase';

export interface District {
    districtName : string,
    status : Status,
    newStatus : NewCase
}