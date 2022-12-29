import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardsComponent } from './dashboards/dashboards.component'
import { DashboardsRoutingModule } from './dashboards-routing.module'
import { SharedModule } from '../shared/shared.module';
import { CompareDashboardsComponent } from './compare-dashboards/compare-dashboards.component'
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { AddDashboardComponent } from './add-dashboard/add-dashboard.component';
import { ComponentsListComponent } from './components-list/components-list.component';
import { ComponentNamePopupComponent } from './component-name-popup/component-name-popup.component';
import { NewComponentComponent } from './new-component/new-component.component';
import { D3ComponentComponent } from './d3-component/d3-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DashboardsComponent, CompareDashboardsComponent, AddDashboardComponent, D3ComponentComponent, ComponentsListComponent, ComponentNamePopupComponent, NewComponentComponent],
  imports: [
    CommonModule,
    DashboardsRoutingModule,
    SharedModule,
    MaterialmoduleModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class DashboardsModule { }
