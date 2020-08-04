import { Component, OnInit, OnChanges } from '@angular/core';
import { Nation } from '../model/nation';
import { StatusService } from '../services/status.service';
import { AppError } from '../Exception/app.error';
import { NotFoundError } from '../Exception/not-found-exception';
import { Summary } from '../model/summary';
import { Observable } from 'rxjs';
import { ColDef } from 'ag-grid-community';
import { LinkRendereComponent } from './link-renderer.component';
import { LinkQueryParamsRenderComponent } from './link-queryparams-renderer.component/link-queryparams-renderer.component.component';

@Component({
  selector: 'app-nation',
  templateUrl: './nation.component.html',
  styleUrls: ['./nation.component.css']
})
export class NationComponent implements OnInit, OnChanges {

  nationStatus : Nation;
  consolidatedViewMode = 'total';
  countrySummary : Observable<Summary>;

  columnDefs : ColDef[];  
  columnTodayDefs : ColDef[];

  

  rowData : any[] = [];
  rowData1 : any[] = [];
  
  constructor(private statusService : StatusService) { }

  ngOnInit(): void {
    this.setGridColumnDefinitions();
    this.setGridTodayColumnDefinitions();
  }

  ngOnChanges(): void{
  }

  changeMainDayMode(mode : string){
    this.consolidatedViewMode = mode;
    this.setSummaryObservable();
  };

  setSummaryObservable(){
    this.countrySummary = new Observable<Summary>(observer =>{
      observer.next({
        currentStatus : {
          active : this.nationStatus.newCase.confirmed,
          deceased : this.nationStatus.newCase.deceased,
          recovered : this.nationStatus.newCase.recovered,
          recoveryRate : 0,
          total : this.nationStatus.newCase.confirmed
        },
        status : this.nationStatus.status,
        viewMode : this.consolidatedViewMode
      })
    });
  }

  setGridColumnDefinitions(){
    const columns = ['State', 'Total', 'Active', 'Deceased', 'Recovered', 'Recovery Rate'];

    this.columnDefs = [];

    columns.forEach((column: string) =>{
      let definition: ColDef = { headerName: column, field: column.toLowerCase(), width: 250 };

      if(column === 'State'){
        definition.cellRendererFramework = LinkRendereComponent;
        definition.cellRendererParams = {
          inRouterLink: '../states',
        };
      }
      else if(column === 'Deceased'){
        definition.cellStyle = function(params){
          if(params.value > 0){
            return {color : 'red'};
          }
        }
      }
      else if(column === 'Recovered'){
        definition.cellStyle = function(params){
          if(params.value > 0){
            return {color : 'green'};
          }
        }
      }
      else if(column === 'Recovery Rate'){
        definition.cellStyle = function(params){
          if(params.value > 0){
            return {color : 'green'};
          }
        }
      }
      this.columnDefs.push(definition);
    })
  }

  setGridTodayColumnDefinitions(){
    const columns = ['State', 'Active', 'Deceased', 'Recovered'];

    this.columnTodayDefs = [];

    columns.forEach((column : string) =>{
      let definition: ColDef = { headerName: column, field: column.toLowerCase(), width :250 };

      if(column === 'State'){
        definition.width = 500;
        definition.cellRendererFramework = LinkQueryParamsRenderComponent;
        definition.cellRendererParams = {
          inRouterLink: '../states',
        };
      }
      else if(column === 'Deceased'){
        definition.cellStyle = function(params){
          if(params.value > 0){
            return {color : 'red'};
          }
        };
      }
      else if(column === 'Recovered'){
        definition.cellStyle = function(params){
          if(params.value > 0){
            return {color : 'green'};
          }
        };
      }      
      this.columnTodayDefs.push(definition);
    });
  }

  onGridReady(params){
    this.rowData = [];   

    this.statusService.getConsolidateData()
    .subscribe(response =>{
      this.nationStatus = response;
      this.setSummaryObservable();
      this.nationStatus.states.forEach(state => {
        this.rowData.push({
          state : state.stateName,
          total : state.status.total,
          active : state.status.active,
          deceased : state.status.deceased,
          recovered : state.status.recovered,
          recoveryRate : state.status.recoveryRate
        })
      });
      params.api.setRowData(this.rowData);
    },
    (error : AppError) => {
      if(error instanceof NotFoundError)
        console.log(error);
      else
        throw error;
    });
  }

  onTodayGridReady(params){
    this.rowData1 = [];
    this.nationStatus.states.forEach(state => {
      this.rowData1.push({
        state : state.stateName,
        total : state.newStatus.total,
        active : state.newStatus.total,
        deceased : state.newStatus.deceased,
        recovered : state.newStatus.recovered,
        recoveryRate : 0
      })
    });
    params.api.setRowData(this.rowData1);
  }
}
