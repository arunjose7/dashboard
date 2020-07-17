import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NationComponent } from './nation/nation.component';
import { StateComponent } from './state/state.component';

const routes : Routes = [
    {
        path : 'nation',
        component : NationComponent
    },
    {
        path : 'state',
        component : StateComponent
    }
]

@NgModule({
    imports : [RouterModule.forRoot(routes)],
    exports : [RouterModule]
})

export class DashboardRoutingModule{

}