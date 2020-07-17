import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { NgHttpLoaderModule } from 'ng-http-loader';
import { AgGridModule } from 'ag-grid-angular';

import { AppComponent } from './app.component';
import { NationComponent } from './nation/nation.component';
import { StateComponent } from './state/state.component';
import { DashboardRoutingModule } from './routing-module';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SummaryPanelComponent } from './summary-panel/summary-panel.component';
import { SummaryComponent } from './summary/summary.component';
import { StateListComponent } from './state/state-list/state-list.component';
import { SortStatesPipe } from './pipes/sort-states.pipe';
import { DropdownDirective } from './directives/dropdown.directive';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    NationComponent,
    StateComponent,
    SummaryPanelComponent,
    SummaryComponent,
    StateListComponent,
    SortStatesPipe,
    DropdownDirective,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      {
        path : '',
        component : HomeComponent
      },{
        path : 'nation',
        component : NationComponent
      },
      {
        path : 'state',
        component : StateComponent
      }
    ]),
    NgHttpLoaderModule.forRoot(),
    AgGridModule.withComponents(null)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
