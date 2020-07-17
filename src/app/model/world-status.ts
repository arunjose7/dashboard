import { GlobalStatus } from './global-status';
import { Country } from './country';

export interface WorldStatus{
    consolidated : GlobalStatus,
    countries : Country[]
}