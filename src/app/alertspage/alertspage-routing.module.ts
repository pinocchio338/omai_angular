import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertpageComponent } from './alertpage/alertpage.component';

const routes: Routes = [{
  path:'',
  component:AlertpageComponent
},
{
  path:':clientId/:siteId/:userId',
  component:AlertpageComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertspageRoutingModule { }
