import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationsComponent } from './applications/applications.component';

const routes: Routes = [{
  path:'',
  component:ApplicationsComponent
},
{
  path:':clientId/:siteId/:applicationId',
  component:ApplicationsComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationsRoutingModule { }
