import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AddUserComponent } from './manage-users/add-user/add-user.component';
const routes: Routes = [
  { path: 'add-user/:id', component: AddUserComponent, pathMatch: 'full'},
  {
    path: ':id',
    component: ManageUsersComponent
  }
];

@NgModule({
  
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
