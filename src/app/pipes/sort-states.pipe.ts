import { Pipe, PipeTransform } from '@angular/core';
import { State } from '../model/state';

@Pipe({
  name: 'orderBy'
})
export class SortStatesPipe implements PipeTransform {

  transform(states: State[], filter?: any): State[] {
    var _states : State[] = states;
    if(!states)
     return null;
    
     _states.sort((a, b) : number => {
       switch (filter) {
        case 'asc':
          if (a.stateName < b.stateName)
            return -1;
          if (a.stateName > b.stateName)
            return 1;
          return 0;
        case 'desc':
          if (a.stateName < b.stateName)
            return 1;
          if (a.stateName > b.stateName)
            return -1;
          return 0;
       
         default:
           break;
       }      
    });

    return _states;
  }

}
