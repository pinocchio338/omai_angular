import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WellsRoutingModule } from './wells-routing.module';
import { WellsComponent } from './wells/wells.component';
import { WellsService } from './wells.service';
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module'

@NgModule({
  declarations: [WellsComponent],
  imports: [
    MaterialmoduleModule,
    CommonModule,
    WellsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers:[WellsService]
})
export class WellsModule { }
