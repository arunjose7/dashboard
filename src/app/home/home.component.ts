import { Component, OnInit } from '@angular/core';
import { StatusService } from '../services/status.service';
import { AppError } from '../Exception/app.error';
import { NotFoundError } from '../Exception/not-found-exception';
import { GlobalStatus } from '../model/global-status';
import { WorldStatus } from '../model/world-status';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  consolidatedViewMode = 'global-total';
  globalStatus : WorldStatus;

  private gridApi;
  private gridColumnApi;
  
  columnDefs = [
    {headerName: "Country", field: "country", width : 250},
    {headerName: "Total", field: "total", width : 250},
    {headerName: "Active", field: "active", width : 250},
    {headerName: "Deceased", field: "deceased", width : 250},
    {headerName: "Recovered", field: "recovered", width : 250}
  ];

  columnTodayDefs = [
    {headerName: "Country", field: "country", width : 500},
    {headerName: "Total", field: "total", width : 250},
    {headerName: "Deceased", field: "deceased", width : 250},
    {headerName: "Recovered", field: "recovered", width : 250}
  ];

  rowData : any[] = [];
  constructor(private statusService : StatusService) { }

  ngOnInit(): void {
  }

  changeMainDayMode(mode : string){
    this.consolidatedViewMode = mode;
  }

  onGridReady(params){
    this.rowData = [];

    this.statusService.getGloablData()
    .subscribe(response =>{
      this.globalStatus = response as WorldStatus;
      this.globalStatus.countries.forEach(country => {
        this.rowData.push({
          country : country.country,
          total : country.totalConfirmed,
          active : country.totalConfirmed - (country.totalRecovered + country.totalDeaths),
          deceased : country.totalDeaths,
          recovered : country.totalRecovered
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
    this.rowData = [];
    this.globalStatus.countries.forEach(country => {
      this.rowData.push({
        country : country.country,
        total : country.newConfirmed,
        deceased : country.newDeaths,
        recovered : country.newRecovered
      })
    });
    params.api.setRowData(this.rowData);
  }
}
