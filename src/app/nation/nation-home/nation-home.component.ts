import { Component, OnInit, OnChanges } from '@angular/core';
import { RouterModule, Route, Router, ActivatedRoute } from '@angular/router';
import { StatusService } from 'src/app/services/status.service';

@Component({
  selector: 'app-nation-home',
  templateUrl: './nation-home.component.html',
  styleUrls: ['./nation-home.component.css']
})
export class NationHomeComponent implements OnInit, OnChanges {

  stateCode : string = 'KL';
  constructor(private router : Router, private route : ActivatedRoute, private statusService : StatusService) { 
  }

  ngOnInit(): void {
    this.statusService.stateSelected$
      ?.subscribe((state: { stateCode: string; }) =>{
        // console.log(state.stateCode)
        this.stateCode = state.stateCode;
    });
    
    this.statusService.OnStateSelected('KL');
    this.route.params.subscribe(routeParams =>{
      // console.log(routeParams);
    })
    // this.router.navigate(['/india/all']);
  }

  ngOnChanges(){
  }
}
