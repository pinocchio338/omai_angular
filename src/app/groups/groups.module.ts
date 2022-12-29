import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageGroupsComponent } from './manage-groups/manage-groups.component';
import { GroupsRoutingModule } from './groups-routing.module'
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ManageGroupsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialmoduleModule,
    GroupsRoutingModule,
    SharedModule
  ],
  // bootstrap: [LoginComponent]
})
export class GroupsModule { }
