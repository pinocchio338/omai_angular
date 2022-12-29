import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { CompareDashboardsComponent } from './compare-dashboards/compare-dashboards.component'
import { AddDashboardComponent } from './add-dashboard/add-dashboard.component'
import { NewComponentComponent } from './new-component/new-component.component';
import { D3ComponentComponent } from './d3-component/d3-component.component';
// import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboards', pathMatch: 'full' },
  { path : 'dashboards', component:DashboardsComponent },
  { path : 'NewDashboard', component:NewComponentComponent} ,
  { path : 'd3-chart-dashboard', component:D3ComponentComponent} ,
  { path : 'edit/:clientId/:siteId/:dashboardId', component:AddDashboardComponent },
  { path : 'dashboards/:dashboardId', component:DashboardsComponent },  
  { path : 'compare/:clientId', component:CompareDashboardsComponent },
  { path : 'compare/:clientId/:token', component:CompareDashboardsComponent },
  { path : 'add/:clientId/:siteId', component:AddDashboardComponent },
  { path : 'add/:clientId/:siteId/:name/:token', component:AddDashboardComponent },
  { path : ':clientId/:siteId/:dashboardId', component:DashboardsComponent },
  { path : ':clientId/:siteId/:dashboardId/:token', component:DashboardsComponent },
  { path : 'edit/:clientId/:siteId/:dashboardId/:token', component:AddDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardsRoutingModule { }
