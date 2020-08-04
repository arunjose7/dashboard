import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Summary } from '../model/summary';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit, OnChanges {

  @Input() summary? : Summary;
  @Input() summaryObservable : Observable<Summary>;
  
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.summaryObservable?.subscribe(summary =>{
      this.summary = summary;
    })
  }

}
