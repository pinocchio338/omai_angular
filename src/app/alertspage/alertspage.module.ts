import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AlertspageRoutingModule } from './alertspage-routing.module';
import { AlertpageComponent } from './alertpage/alertpage.component';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
@NgModule({
  declarations: [AlertpageComponent],
  imports: [
    CommonModule,
    AlertspageRoutingModule,
    SharedModule,
    MatTableExporterModule,
    MaterialmoduleModule
  ]
})
export class AlertspageModule { }
