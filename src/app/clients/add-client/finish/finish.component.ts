import { Component, OnInit , Input, Output, EventEmitter ,OnChanges, SimpleChanges  } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ClientsService } from '../../clients.service';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

 import { DraftModalBoxComponent } from '../draft-modal-box/draft-modal-box.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';



@Component({
  selector: 'app-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss']
})
export class FinishComponent implements OnInit {
  errorString="";
  @Output() messageEvent = new EventEmitter<string>();
  @Input() updatedata: any;
  @Input() groupupdatedata: any;
  @Input() editSubscription: any;
  @Input() siteupdatedata: any;
  @Input() subsciptionupdatedata: any;

  


  userList = [];
  usergroupList = [];
  siteList = [];
  formObject : any;
  finishForm : UntypedFormGroup;
  clientId = localStorage.getItem('client_Id');
  subscriptionData : any;
  subscription_name: any;
  subscription_email: any;
  subscription_paymentterms:any;
  subscription_licenseValue: any;
  subscriptionEndDate: any;
  subscription_sites: any;
  subscription_dasboards: any;
  subscription_alerts: any;
  subscription_users : any;
  dataLoaded: boolean = false;

  
  @Input() stepperData: any;
  subscription_address: any;
  addressCity: any;
  addressState: any;
  addressCountry: any;
  addressZipCode: any;
  clientLogo: any;
  subscription_address1: any;

  constructor(private fb: UntypedFormBuilder , private clientsService : ClientsService , public dialog: MatDialog , private router: Router, private route: ActivatedRoute,private authService:AuthService) { }


  ngOnChanges(changes: SimpleChanges): void {

    //console.log('ng changes updatedata', this.updatedata);

    this.dataLoaded = true;
    this.getSubcriptionInfo();
    this.getSitesByClient();
    this.getAllUserGroupByClient();
    this.getAllUsesByClient();
    this.dataLoaded = false;
  
  }




  ngOnInit(): void {

    this.formObject = {

    };
    this.finishForm = this.fb.group(this.formObject);
        
 
      this.getSubcriptionInfo();
      this.getSitesByClient();
      this.getAllUserGroupByClient();
      this.getAllUsesByClient();
     

  }


  move(index: number) {
    this.stepperData.selectedIndex = index;
    if(index == 0){

      //console.log('index move to ', index);
      this.messageEvent.emit(this.clientId)

    }

  }


  getPhoto(url: string){
    return typeof(url) !== 'undefined' && url ? url : 'assets/sample-site-image.png';
  }

  getSubcriptionInfo(){

    this.dataLoaded = true;
  

    this.clientsService.getSubcritionDataByClientId(this.clientId).subscribe((response) => {
      //console.log('finish page getSubcritionDataByClientId', response);
      //console.log('sub',response);
      //console.log('type of sub', typeof(response));
      this.subscriptionData = response;
      this.subscription_name  = response['name'];
      this.subscription_email  = response['email'];
      this.subscription_paymentterms  = response['paymentterms'];
      this.subscription_licenseValue  = response['licenseValue'];
      this.subscriptionEndDate = response['subscriptionEndDate'];
      this.subscription_sites  = response['sites'];
      this.subscription_dasboards  = response['dasboards'];
      this.subscription_alerts  = response['alerts'];
      this.subscription_users  = response['users'];
     // this.subscription_address  = response['address'];
      this.subscription_address  = response['address'].line1;
      this.subscription_address1  = response['address'].line2;


      
      this.addressCity  = response['address'].city;
      this.addressState  = response['address'].state;
      this.addressCountry  = response['address'].country;
      this.addressZipCode  = response['address'].zipCode;
      this.clientLogo  ='';
      this.clientLogo  = response['logo'];

      this.dataLoaded = false;
      //console.log('finish page getSubcritionDataByClientId', this.clientLogo);


    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = false;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    });

  }


  


  getAllUsesByClient() {

    this.dataLoaded = true;

    this.clientsService.getAllUserandUserGroupByClient(this.clientId).subscribe((response) => {
      //console.log('getAllUserGroupByClient', response);
      this.userList = response['userInfo']['users'];
      //  //console.log('this.siteList', this.siteList);
      this.dataLoaded = false;

    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = false;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    });

  }

  getSitesByClient() {

    this.dataLoaded = true;
    // this.searchedClients[this.selectedClientIndex].primaryKey.split('#')[1];
    this.clientsService.getSiteListByClient(this.clientId).subscribe((response)=> {
    //console.log(response);
    this.siteList = response['sites'];

    //console.log('this.siteList', this.siteList);
    this.dataLoaded = false;


},(httpError:HttpErrorResponse)=>{
  this.dataLoaded = false;
  //this.errorString = err.error.message;
  this.authService.updateErrorMessage(httpError['error']['message']);
});

}

goBack() {

  //console.log('inside open dialog box');
  const dialogRef = this.dialog.open(DraftModalBoxComponent,{ 
     
    disableClose: true,
    position:{top:'2%'}
  ,width:'592px'});
  dialogRef.afterClosed().subscribe(result => {
    
    if(result){
     // this.getAlerts();
    }
  });
}

activateClient(){

  this.dataLoaded = true;
  this.clientsService.activateUser(this.clientId).subscribe((clientData)=> {
    this.dataLoaded = false;
    //console.log('clientData', clientData);
    this.router.navigate(['clients']);
  
  
  },(httpError:HttpErrorResponse)=>{
    this.dataLoaded = false;
    //this.errorString = err.error.message;
    this.authService.updateErrorMessage(httpError['error']['message']);
  });

}



getAllUserGroupByClient(){

  this.clientsService.getAllUserandUserGroupByClient(this.clientId).subscribe((userGroupData)=> {
    //console.log('getAllUserGroupByClient',userGroupData);
    this.usergroupList = userGroupData['userInfo']['userGroups'];
        //   this.selectedClientUsers = userData['userInfo'];
      // this.userGroupList = userData['userGroups'];
      //  //console.log('this.siteList', this.siteList);
  },(httpError:HttpErrorResponse)=>{
    //this.errorString = err.error.message;
    this.authService.updateErrorMessage(httpError['error']['message']);
  });


}



  onSubmitFinishForm(event){

  }

}
