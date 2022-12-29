import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShiftsRoutingModule } from './shifts-routing.module';
import { ShiftsComponent } from './shifts.component';
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorHandlerModule } from "../errorhandler/errorhandler.module";
import { UsersModule } from '../users/users.module';
import { NewshiftComponent } from './newshift/newshift.component';
import { SharedModule } from '../shared/shared.module'
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [ShiftsComponent, NewshiftComponent],
  imports: [
    CommonModule,
    ShiftsRoutingModule,
    MaterialmoduleModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorHandlerModule,
    UsersModule,
    SharedModule,
    DragDropModule
  ]
})
export class ShiftsModule { }
