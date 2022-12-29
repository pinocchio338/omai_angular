import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';
import { ClientsComponent } from './clients/clients.component';
import { SelectedClientComponent } from './selected-client/selected-client.component';
import { AddClientComponent } from './add-client/add-client.component';
import { ClientDetailsComponent } from './client-details/client-details.component'



const routes: Routes = [
 //:clientId/:siteId
  { path: 'add', component: AddClientComponent, pathMatch: 'full' },
  { path: 'details/:id', component: ClientDetailsComponent, pathMatch: 'full' },
  { path: '', component: ClientsComponent, pathMatch: 'full' },
  { path: 'view/:id', component: ClientsComponent, pathMatch: 'full' },
  { path: ':id', component: SelectedClientComponent },
  { path: ':id/:siteId', component: SelectedClientComponent },  
];

@NgModule({
  
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
