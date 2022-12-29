import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module'
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { JointablesRoutingModule } from './jointables-routing.module';
import { JointableComponent } from './jointable/jointable.component';


@NgModule({
  declarations: [JointableComponent],
  imports: [
    CommonModule,
    JointablesRoutingModule,
    SharedModule,
    MaterialmoduleModule
  ]
})
export class JointablesModule { }
