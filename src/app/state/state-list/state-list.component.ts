import { Component, OnInit, Input, Output, EventEmitter, AfterViewChecked, AfterViewInit, OnChanges } from '@angular/core';
import { State } from 'src/app/model/state';
import { StatusService } from 'src/app/services/status.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.css']
})
export class StateListComponent implements OnChanges  {

  @Input() states : State[];
  stateList : State[];
  // @Output() stateSelected = new EventEmitter<{stateCode : string}>();

  constructor(
    private router : Router, 
    private route : ActivatedRoute,
    private statusService : StatusService) { }

  ngOnChanges(): void {
    this.stateList = this.states;
  }

  onStateSelected(code: any){
    this.statusService.OnStateSelected(code);
    this.router.navigate(
      ['../', code as string], 
      {
        relativeTo : this.route
        // queryParams : 
        // {
        //   'stateCode' : code
        // }
      });
  }

  selectionChanged(evenArgs){

  }

  onSearch(dropdownSearch){
    this.stateList = this.states.filter((element) =>{
      return element.stateName.toLowerCase().indexOf(dropdownSearch.value.toLowerCase()) >= 0
    });
  }
}
