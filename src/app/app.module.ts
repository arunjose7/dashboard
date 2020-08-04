import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

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
import { NationHomeComponent } from './nation/nation-home/nation-home.component';
import { LinkRendereComponent } from './nation/link-renderer.component';
import { LinkQueryParamsRenderComponent } from './nation/link-queryparams-renderer.component/link-queryparams-renderer.component.component';

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
    HomeComponent,
    NationHomeComponent,
    LinkRendereComponent,
    LinkQueryParamsRenderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([
      {
        path : '',
        component : HomeComponent
      },{
        path : 'india',
        component : NationHomeComponent,
        children : [
          {
            path : 'all',
            component : NationComponent
          },
          {
            path : 'states/:stateCode',
            component : StateComponent
          }
        ]
      }
    ]),
    NgHttpLoaderModule.forRoot(),
    AgGridModule.withComponents(null)
  ],
  providers: [],
  entryComponents : [LinkRendereComponent, LinkQueryParamsRenderComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
