import { Component, OnInit } from '@angular/core';
import { Nation } from '../model/nation';
import { State } from '../model/state';
import { Status } from '../model/status';
import { Summary } from '../model/summary';
import { StatusService } from '../services/status.service';
import { AppError } from '../Exception/app.error';
import { NotFoundError } from '../Exception/not-found-exception';
import { District } from '../model/district';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

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
  
  constructor(private statusService : StatusService, private route : ActivatedRoute) { }

  ngOnInit(): void {
    combineLatest(this.route.params, this.route.queryParams)
    .pipe(map(results =>({
      params : results[0],
      query : results[1]
    })))
    .subscribe(results =>{
      this.statusService.getConsolidateData()
      .subscribe(response => {
        this.nationStatus = response;
        this.getStateStatus(results.params['stateCode']);
        if(results.query['today'] == 'true'){
          this.changeViewMode('today');
        }
      },
      (error : AppError) => {
        if(error instanceof NotFoundError)
          console.log(error);
        else
          console.log(error);
      });  
    })
    
    // this.route.queryParams.subscribe(queryParam =>{
    //   if(queryParam['today'] == 'true'){
    //     console.log(queryParam['today']);
    //     this.changeViewMode('today');
    //     console.log(this.viewMode);
    //   }
    // });

    // this.statusService.stateSelected
    // .subscribe((state: { stateCode: string; }) =>{
    //   console.log(state);
    //   this.getStateStatus(state.stateCode);
    // });
  }

  getStateStatus(stateCode : string){
    this.stateSelected = this.nationStatus?.states.find(x => x.stateName === stateCode);
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

  getSorted(a: District, b: District){
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
    // console.log(total);
    return total;
  }

  getTotalRecoveredCases(): number{
    var total = 0;
    if(this.stateSelected.districts != null && this.stateSelected.districts.length > 0){
      this.stateSelected.districts.forEach(x => total += x.status.recovered);
    }
    // console.log(total);
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

  // onStateChange(code : string){
  //   this.getStateStatus(code);
  // }

  // onStateSelected(eventArgs: { stateCode: string; }){
  //   console.log(eventArgs);
  //   this.getStateStatus(eventArgs.stateCode);
  // }

}
