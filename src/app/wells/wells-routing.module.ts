import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WellsComponent } from './wells/wells.component'
const routes: Routes = [
  {
    path: ':clientId/:siteId',
    component: WellsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WellsRoutingModule { }
