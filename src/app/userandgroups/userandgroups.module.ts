import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserandgroupsRoutingModule } from './userandgroups-routing.module';
import { GroupsComponent } from './groups/groups.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { LayoutModule } from '@angular/cdk/layout';
import { GroupsNewUserComponent } from './groups-new-user/groups-new-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewuseraddComponent } from './newuseradd/newuseradd.component';


@NgModule({
  declarations: [GroupsComponent, GroupsNewUserComponent, NewuseraddComponent],
  imports: [
    CommonModule,
    SharedModule,
    LayoutModule,
    MaterialmoduleModule,
    UserandgroupsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UserandgroupsModule { }
