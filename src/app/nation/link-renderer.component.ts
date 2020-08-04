import { AgRendererComponent } from 'ag-grid-angular';
import { Component } from '@angular/core';

@Component({
    template: `<a target="_blank" [routerLink] = "[params.inRouterLink,params.value]">{{params.value}}</a>`
})
export class LinkRendereComponent implements AgRendererComponent{
    params : any;
    refresh(params: any): boolean {
        return false;
    }
    agInit(params: any): void {
        this.params = params;
    }
    
}