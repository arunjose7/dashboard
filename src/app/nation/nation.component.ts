import { Component, OnInit } from '@angular/core';
import { Nation } from '../model/nation';
import { StatusService } from '../services/status.service';
import { AppError } from '../Exception/app.error';
import { NotFoundError } from '../Exception/not-found-exception';

@Component({
  selector: 'app-nation',
  templateUrl: './nation.component.html',
  styleUrls: ['./nation.component.css']
})
export class NationComponent implements OnInit {

  nationStatus : Nation;
  consolidatedViewMode = 'india-total';
  
  constructor(private statusService : StatusService) { }

  ngOnInit(): void {
    this.statusService.getConsolidateData()
      .subscribe(response => {
        console.log(response);
        this.nationStatus = response;
      },
      (error : AppError) => {
        if(error instanceof NotFoundError)
          console.log(error);
        else
          throw error;
    })
  }

  changeMainDayMode(mode : string){
    this.consolidatedViewMode = mode;
  }

}
