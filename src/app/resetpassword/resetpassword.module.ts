import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ResetpasswordRoutingModule } from './resetpassword-routing.module';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { SharedModule } from '../shared/shared.module'
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
@NgModule({
  declarations: [ResetpasswordComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule, ReactiveFormsModule,
    ResetpasswordRoutingModule,
    MaterialmoduleModule
  ]
})
export class ResetpasswordModule { }
