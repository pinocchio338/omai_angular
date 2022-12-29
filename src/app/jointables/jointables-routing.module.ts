import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JointableComponent } from './jointable/jointable.component';

const routes: Routes = [
  {  path: ':clientId/:siteId', component: JointableComponent },
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JointablesRoutingModule { }
