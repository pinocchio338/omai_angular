import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageGroupsComponent } from './manage-groups/manage-groups.component';
const routes: Routes = [
  {
    path: ':id',
    component: ManageGroupsComponent
  },
  {
    path: ':id/:groupId',
    component: ManageGroupsComponent
  }
];

@NgModule({
  
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
