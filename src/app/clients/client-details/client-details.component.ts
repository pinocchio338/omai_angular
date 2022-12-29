import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../clients.service';
import { AuthService } from '../../auth.service'

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss']
})
export class ClientDetailsComponent implements OnInit {
  selectedClientId: string = "";
  clientInfo: any;
  dataLoaded: boolean = true;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    private authService: AuthService ) { }

  ngOnInit(): void {
    // console.error('this.route.snapshot.params.id',this.route.snapshot.params.id)
    this.selectedClientId = decodeURIComponent(this.route.snapshot.params.id);
    // //console.log(this.selectedClientId)
    this.dataLoaded = false;
    this.clientsService.getClientsById(this.selectedClientId.split('#')[1]).subscribe((client) => {
      // data['clients'].forEach((client) => {
        // if (client.sortKey == this.selectedClientId) {
          // console.error(client);
          this.clientInfo = client;
          this.dataLoaded = true;
    },
    (error: HttpErrorResponse)=>{
      this.dataLoaded = true;
      this.authService.updateErrorMessage(error['error']['message'])
    });
  }

}
