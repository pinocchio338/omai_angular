import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from './groups/groups.component';
import { NewuseraddComponent } from './newuseradd/newuseradd.component';
const routes: Routes = [{
  path:'',
  component:GroupsComponent
},
{  path:':clientId',
component:GroupsComponent
},
{
  path:'newuser/:name',
  component:NewuseraddComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserandgroupsRoutingModule { }
