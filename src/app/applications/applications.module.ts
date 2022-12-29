import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationsComponent } from './applications/applications.component';
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { SharedModule } from '../shared/shared.module';
import { CreateApplicationComponent } from './create-application/create-application.component';
import { FormsModule } from '@angular/forms';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatTableExporterModule } from 'mat-table-exporter';
@NgModule({
  declarations: [ApplicationsComponent, CreateApplicationComponent],
  imports: [
    CommonModule,
    SharedModule,
    ApplicationsRoutingModule,
    MaterialmoduleModule,
    FormsModule,
    MatTableExporterModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ]
})
export class ApplicationsModule { }
