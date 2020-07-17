import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { State } from 'src/app/model/state';

@Component({
  selector: 'app-state-list',
  templateUrl: './state-list.component.html',
  styleUrls: ['./state-list.component.css']
})
export class StateListComponent implements OnInit {

  @Input() states : State[];
  @Output() stateSelected = new EventEmitter<{stateCode : string}>();

  constructor() { }

  ngOnInit(): void {
  }

  onStateSelected(code){
    this.stateSelected.emit({stateCode : code});
  }

}
