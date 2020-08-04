import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';

@Component({
  selector: 'app-link-queryparams-renderer.component',
  templateUrl: './link-queryparams-renderer.component.component.html',
  styleUrls: ['./link-queryparams-renderer.component.component.css']
})
export class LinkQueryParamsRenderComponent implements AgRendererComponent {

  params : any;
  constructor() { }
  refresh(params: any): boolean {
    return false;
  }
  agInit(params: any): void {
    this.params = params;
  }
}
