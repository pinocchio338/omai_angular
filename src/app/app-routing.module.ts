import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'clients',
    canActivateChild:[AuthGuard],
    loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule)
  },
  {
    path: 'shifts',
    loadChildren: () => import('./shifts/shifts.module').then(m => m.ShiftsModule)
  },
  {
    path: 'wells',
    loadChildren: () => import('./wells/wells.module').then(m => m.WellsModule)
  }, 
  {
    path: 'applications',
    loadChildren: () => import('./applications/applications.module').then(m => m.ApplicationsModule)
  },
  {
    path: 'groups',
    loadChildren: () => import('./groups/groups.module').then(m => m.GroupsModule)
  },
  {
    path: 'userandgroups',
    loadChildren: () => import('./userandgroups/userandgroups.module').then(m => m.UserandgroupsModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'dashboards',
    loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule)
  },
  {
    path: 'resetpassword',
    loadChildren: () => import('./resetpassword/resetpassword.module').then(m => m.ResetpasswordModule)
  },
  {
    path: 'jointables',
    loadChildren: () => import('./jointables/jointables.module').then(m => m.JointablesModule)
  },
  {
    path: 'alertspage',
    loadChildren: () => import('./alertspage/alertspage.module').then(m => m.AlertspageModule)
  }

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
