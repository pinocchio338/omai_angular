import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsComponent } from './clients/clients.component';
import { ClientsRoutingModule } from './clients-routing.module'
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { SharedModule } from '../shared/shared.module';
import { SelectedClientComponent } from './selected-client/selected-client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddClientComponent } from './add-client/add-client.component';
 import { SubscriptionComponent } from './add-client/subscription/subscription.component';
 import { SitesCardComponent } from './add-client/sites-card/sites-card.component';
 import { UserGroupsComponent } from './add-client/user-groups/user-groups.component';
 import { UsersComponent } from './add-client/users/users.component';
 import { FinishComponent } from './add-client/finish/finish.component';
import { AddSiteComponent } from './add-site/add-site.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { ClientDetailsComponent } from './client-details/client-details.component';

// UsersComponent,UserGroupsComponent,SubscriptionComponent,SitesCardComponent,FinishComponent


@NgModule({
  declarations: [ClientsComponent, SelectedClientComponent,AddClientComponent,SubscriptionComponent,SitesCardComponent,UserGroupsComponent,UsersComponent,FinishComponent, AddSiteComponent, ConfirmDialogComponent, ClientDetailsComponent],
  imports: [
    CommonModule,
    ClientsRoutingModule,
    MaterialmoduleModule,    
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GoogleMapsModule
  ]
})
export class ClientsModule { }
