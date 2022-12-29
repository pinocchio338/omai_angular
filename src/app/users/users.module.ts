import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlerModule } from "../errorhandler/errorhandler.module";
import { UsersComponent } from '../users/users.component';
import { NewuserComponent } from './newuser/newuser.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AddUserComponent  } from './manage-users/add-user/add-user.component';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [UsersComponent, NewuserComponent,ManageUsersComponent,AddUserComponent],
  imports: [
    CommonModule,
    MaterialmoduleModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorHandlerModule,
    UsersRoutingModule,
    SharedModule

  ]
})
export class UsersModule { }
