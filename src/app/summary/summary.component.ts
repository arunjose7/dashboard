import { Component, OnInit, Input } from '@angular/core';
import { Summary } from '../model/summary';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  @Input() summary : Summary;
  
  constructor() { }

  ngOnInit(): void {
  }

}
