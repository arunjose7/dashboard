import { Component, OnInit } from '@angular/core';
import { Nation } from '../model/nation';
import { State } from '../model/state';
import { Status } from '../model/status';
import { Summary } from '../model/summary';
import { StatusService } from '../services/status.service';
import { AppError } from '../Exception/app.error';
import { NotFoundError } from '../Exception/not-found-exception';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {

  nationStatus : Nation;
  stateSelected : State;
  totalStatus : Status;
  viewMode = "total";
  currentState : string = 'KL';
  stateSummary : Summary
  
  constructor(private statusService : StatusService) { }

  ngOnInit(): void {
    this.statusService.getConsolidateData()
    .subscribe(response => {
      console.log(response);
      this.nationStatus = response;
      this.getStateStatus(this.currentState);
    },
    (error : AppError) => {
      if(error instanceof NotFoundError)
        console.log(error);
      else
        console.log(error);
    })
  }

  getStateStatus(stateCode : string){
    this.stateSelected = this.nationStatus?.states.find(x => x.stateCode === stateCode);
    // console.log(this.stateSelected);
    this.stateSelected.districts.sort((a, b): number => this.getSorted(a, b));
    this.totalStatus = {
      active : this.getTotalActiveCases(),
      deceased : this.getTotalDeceasedCases(),
      recovered : this.getTotalRecoveredCases(),
      total : this.getTotalCases(),
      recoveryRate : this.getTotalRecoveryRate()
    };
    this.stateSummary = {
      currentStatus : this.stateSelected.newStatus,
      status : this.stateSelected.status,
      viewMode : this.viewMode
    };
  }

  getSorted(a, b){
    if (a.status.total < b.status.total) return 1;
    if (a.status.total > b.status.total) return -1;
    return 0;
  }

  getTotalCases(): number{
    var total = 0;
    if(this.stateSelected.districts != null && this.stateSelected.districts.length > 0){
      this.stateSelected.districts.forEach(x => total += x.status.total);
    }
    return total;
  }

  getTotalRecoveryRate(): number{
    var totalRecoveryRate = 0;
    if(this.stateSelected.districts != null && this.stateSelected.districts.length > 0){
      this.stateSelected.districts.forEach(x => totalRecoveryRate += x.status.total);
    }
    return totalRecoveryRate;
  }

  getTotalActiveCases(): number{
    var total = 0;
    if(this.stateSelected.districts != null && this.stateSelected.districts.length > 0){
      this.stateSelected.districts.forEach(x => total += x.status.active);
    }
    console.log(total);
    return total;
  }

  getTotalRecoveredCases(): number{
    var total = 0;
    if(this.stateSelected.districts != null && this.stateSelected.districts.length > 0){
      this.stateSelected.districts.forEach(x => total += x.status.recovered);
    }
    console.log(total);
    return total;
  }

  getTotalDeceasedCases(): number{
    var total = 0;
    if(this.stateSelected.districts != null && this.stateSelected.districts.length > 0){
      this.stateSelected.districts.forEach(x => total += x.status.deceased);
    }
    return total;
  }

  changeViewMode(mode : string){
    this.viewMode = mode;
    this.stateSummary.viewMode = mode;
  }

  onStateChange(code : string){
    this.getStateStatus(code);
  }

  onStateSelected(eventArgs){
    console.log(eventArgs);
    this.getStateStatus(eventArgs.stateCode);
  }

}
