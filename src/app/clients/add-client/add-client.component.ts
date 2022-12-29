import {Component, OnInit , AfterViewInit ,  VERSION, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { Router, ActivatedRoute } from '@angular/router';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ClientsService } from './../clients.service';
import { SubscriptionComponent } from './../add-client/subscription/subscription.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})

export class AddClientComponent implements OnInit  {
  private ngVersion: string = VERSION.full;
  
  // Only required when not passing the id in methods
  @ViewChild('stepper') private myStepper: MatStepper;
  @ViewChild(SubscriptionComponent) clientData;

  errorString="";
  clientName :string;
  totalStepsCount: number;
  dataLoaded: boolean = false;
  subscriptionFormGroup: UntypedFormGroup;
  sitesFormGroup: UntypedFormGroup; 
  usergroupsFormGroup: UntypedFormGroup; 
  usersFormGroup: UntypedFormGroup; 
  isLinear = false;
  isEditable = true;
  selectedIndex: number = 0;
  isSiteShow: boolean = false;
  isShowUserGroup: boolean = false;
  isShowUser: boolean = false;
  isShowfinish: boolean = false;
  getData: any;
  loadfinalform: [];
  userGroupData: any;
  siteData: any;
  subscriptionData: any;
  draftClientId: string;

  constructor(private _formBuilder: UntypedFormBuilder,private router: Router , private clientsService: ClientsService,private authService:AuthService
    ) {}


  message:string;
  finishObj : any;

  openSubscriptionForm($event){

    //console.log('openFinishForm from user group');
   // this.finishObj.assign({}, $event);
    this.subscriptionData =  $event;
    //console.log($event);
   
  }

  ngAfterViewInit() {
    //console.log('ngAfterViewInit');
    this.clientName = this.clientData.clientName
  }



 



  openSiteForm($event){

    //console.log('openFinishForm from Site');
   // this.finishObj.assign({}, $event);
    this.siteData =  $event;
    //console.log($event);
   
  }


  openUserGroupForm($event){

    //console.log('openFinishForm from user group');
   // this.finishObj.assign({}, $event);
    this.userGroupData =  $event;
    //console.log($event);
   
  }



  openFinishForm($event){
    //console.log('openFinishForm');
   // this.finishObj.assign({}, $event);
    this.loadfinalform =  $event;
    //console.log($event);
  }

  receiveMessage($event) {

    this.getData = $event;
    this.message = $event
    //console.log(this.message);
  }

  goClose(){

    localStorage.removeItem("draft_clientId")
    localStorage.removeItem("client_Id")
    this.router.navigate(['clients']);
  }

  ngOnChange(){

  }

  isCompleted = false;
  ngOnInit() {

    // .mat-horizontal-content-container {
    //   overflow: hidden;
    //   padding: 0 24px 24px 24px;
    //   background: #F8F9FA;
    //  // height: calc(100vh - 220px);
    //   height: calc(100vh);
    //   min-height: calc(70vh);
    //   max-height: calc(100vh - 220px);
    //   overflow: auto!important;
    // }
    

    const ua = navigator.userAgent.toLowerCase(); 
    if (ua.indexOf('safari') != -1) { 
      if (ua.indexOf('chrome') > -1) {
       // alert("1 chrom") // Chrome
       //console.log('chrome');

        let shand = document.getElementsByClassName('mat-horizontal-content-container') as HTMLCollectionOf<HTMLElement>;

          if (shand.length != 0) {
           // shand[0].style.minHeight = "calc(90vh)";
            shand[0].style.height = "calc(100vh - 107px)";
          }


      } else {
        //alert("2 safari") // Safari
        //console.log('safari');
        let shand = document.getElementsByClassName('mat-horizontal-content-container') as HTMLCollectionOf<HTMLElement>;

        if (shand.length != 0) { 
       
          const availScreenWidth  = window.screen.availWidth;
          const availScreenHeight = window.screen.availHeight;

          //console.log('availScreenWidth',availScreenWidth);
          //console.log('availScreenHeight',availScreenHeight);

          //console.log('window.innerWidth',window.innerWidth);

          if(window.innerWidth <= 1197 ){
          shand[0].style.maxHeight = "calc(100vh - 285px)";
          }else{
            shand[0].style.height = "calc(100vh - 210px)";
          }

        }


      }
    }


    //console.log('inside add client component');
    this.subscriptionFormGroup = this._formBuilder.group({
      subscriptionCtrl: ['',]
    });
    this.sitesFormGroup = this._formBuilder.group({
      sitesCtrl: ['',]
    });
    this.usergroupsFormGroup = this._formBuilder.group({
      usergroupsCtrl: ['',]
    });
    this.usersFormGroup = this._formBuilder.group({
      usersCtrl: ['',]
    });

    this.draftClientId = localStorage.getItem("draft_clientId");
    if(this.draftClientId!= null){
      this.getClientDataById();
    }
  }

  getClientDataById() {
      this.dataLoaded = true;
      //console.log('inside getClientDataById fun');
      this.clientsService.getSubcritionDataByClientId(this.draftClientId).subscribe((response) => {
        this.clientName =  response['name'];
        //response['name'],
      },(httpError:HttpErrorResponse)=>{
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      });
  }


  getclientInfo(){

    this.clientName = this.clientData.getClientName;
    //console.log('On init add client ', this.clientName);
    
  }


  public selectionChange($event?: StepperSelectionEvent): void {

    //console.log('ngAfterViewInit');
    this.clientName = this.clientData.clientName

    //console.log('stepper.selectedIndex: ' + this.selectedIndex 
        // + '; $event.selectedIndex: ' + $event.selectedIndex);
        if(this.selectedIndex == 5 && $event.selectedIndex == 0){
        }

    if ($event.selectedIndex == 0){

      return; // First step is still selected
    }
    
      this.selectedIndex = $event.selectedIndex;

    if(this.selectedIndex == 1){
      this.isSiteShow = true;

    }else if(this.selectedIndex == 2){
      this.isShowUserGroup = true;
    } else if(this.selectedIndex == 3){
      this.isShowUser = true;

    }else{

      this.isShowfinish = true;

    }

  }



  
    goBack(stepper: MatStepper) {
      stepper.previous();
    }
    goForward(stepper: MatStepper) {
      stepper.next();
    }

}
