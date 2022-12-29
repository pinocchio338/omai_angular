import { Component, OnInit, OnChanges, AfterViewInit, Input, Output, EventEmitter, SimpleChanges , ElementRef } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { VERSION, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ClientsService } from '../../clients.service';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import { DraftModalBoxComponent } from '../draft-modal-box/draft-modal-box.component';
import * as xml2js from 'xml2js';
import { fromEvent } from "rxjs";
import { debounceTime, take } from "rxjs/operators";
import { AuthService } from 'src/app/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ImagecropperComponent } from 'src/app/shared/imagecropper/imagecropper.component';






@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']

})
export class SubscriptionComponent implements OnChanges, OnInit {

  private ngVersion: string = VERSION.full;
  errorString="";
  
  @Input() stepperData: any;
  @Input() editSubscription: any;
  @Output() loadSubscriptionformEvent = new EventEmitter<any>();


  //@ViewChild('stepper') private myStepper: MatStepper;

  isShowForSave: boolean = true;
  isShowForUpate: boolean = false;
  totalStepsCount: number;
  sitesCount: number = 1;
  usersCount: number = 1;
  dashboardCount: number = 1;
  alertCount: number = 1;
  subscriptionForm: UntypedFormGroup;
  formObject: any;
  duration: number = 1;
  country = 'United State';
  fileToUpload: any;
  dataLoaded: boolean = false;
  isFormSubmitted = false;
  private base64textString: String = "";
  image: string | ArrayBuffer;
  //lastSubscriptionDate:: Date = new Date
  lastSubscriptionDate: Date = new Date();
  lastduration: number;
  dateyear: number;
  finalsubscriptionDate: Date;
  startDate: any;
  draftClientId: any;
  isemailId: boolean = false;
  mode: string = '';
  getClientName: '';
  clientName: any;
  addressJsonRes: any;
  paymentTermsList:any=[30,45,60];
  constructor(private el: ElementRef , private router: Router, private route: ActivatedRoute,private fb: UntypedFormBuilder, private clientsService: ClientsService,
    public dialog: MatDialog,private authService:AuthService) { }


  ngOnChanges(changes: SimpleChanges): void {

    //console.log(this.editSubscription);
    if (this.editSubscription) {

      this.isShowForSave = false;
      this.isShowForUpate = true;
      this.draftClientId = this.editSubscription;
      this.getClientDataById();

    }
  }



  // private scrollToFirstInvalidControl() {
  //   const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
  //     "form .ng-invalid"
  //   );

  //   window.scroll({
  //     top: this.getTopOffset(firstInvalidControl),
  //     left: 0,
  //     behavior: "smooth"
  //   });

  //   fromEvent(window, "scroll")
  //     .pipe(
  //       debounceTime(100),
  //       take(1)
  //     )
  //     .subscribe(() => firstInvalidControl.focus());
  // }



// private getTopOffset(controlEl: HTMLElement): number {
//   const labelOffset = 50;
//   return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
// }
  
  


  getClientDataById() {

    this.dataLoaded = true;

    //console.log('inside getClientDataById fun');
    
    this.clientsService.getSubcritionDataByClientId(this.draftClientId).subscribe((response) => {
     this.dataLoaded = false;
      this.getClientName =  response['name'];
      //console.log('Client Name Data', this.getClientName);
    //  //console.log('get Client/Subsciption Data', response);
    this.startDate = new Date(this.subscriptionForm.controls.subscriptionDate.value);
    let d = new Date(this.subscriptionForm.controls.subscriptionDate.value);
    this.lastduration = d.getFullYear();
    this.dateyear = this.lastduration + this.duration;
    this.lastSubscriptionDate = this.startDate.setFullYear(this.dateyear);
    this.finalsubscriptionDate = new Date(this.lastSubscriptionDate);
    this.mode = 'edit';
    
   //console.log('start Date:', response['subscriptionStartDate']);
   //console.log('End Date:', response['subscriptionEndDate']);

   let d1= new Date(response['subscriptionStartDate']);
   let d2= new Date(response['subscriptionEndDate']);
   //console.log('End Date:', d2.getFullYear())  

   //console.log('End Date:', d2.getFullYear() - d1.getFullYear());
   this.duration = d2.getFullYear() - d1.getFullYear()
   ////console.log('start Date:', new Date(response['subscriptionStartDate'].getFullYear()));
  // //console.log('End Date:', response['subscriptionEndDate'].getFullYear())  

  //  response['subscriptionEndDate']

    


    
    
      const fetchData = {

        'licenseamt': response['licenseValue'],
        'paymentterms':response['paymentterms'],
        'sitesCount': response['sites'],
        'usersCount': response['users'],
        'dashboardCount': response['dasboards'],
        'alertCount': response['alerts'],
        'subscriptionDate': response['subscriptionStartDate'],
        'duration': this.duration,
        'clientName': response['name'],
        'clientemail': response['email'],
        'clientPhone': response['phoneNo'],
        'address': response['address'].line1,
        'addressline': response['address'].line2,
        'zipCode': response['address'].zipCode,
        'city': response['address'].city,
        'state': response['address'].state,
        'country': response['address'].country

      };

      this.sitesCount =  response['sites'];
      this.usersCount =  response['users'];
      this.dashboardCount = response['dasboards'];
      this.alertCount  =  response['alerts'];
      this.fileToUpload = '';

      this.clientName = response['name'],

      this.subscriptionForm.patchValue(fetchData);

    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = false;
     // this.errorString = err.error.message;
     this.authService.updateErrorMessage(httpError['error']['message']);
    })

    
  }

  checkAmount(data){

    if (data == 'sites') {

      if(this.subscriptionForm.controls.sitesCount.value){
        this.sitesCount = parseInt(this.subscriptionForm.controls.sitesCount.value);
      }else{
        this.sitesCount = 1;
      }

      //console.log('site', data);
      //console.log('sitecount', this.subscriptionForm.controls.sitesCount.value);
      //console.log('sitecount wparseInt', this.sitesCount);;

  } else if (data == 'users') {

    if(this.subscriptionForm.controls.usersCount.value){
      this.usersCount = parseInt(this.subscriptionForm.controls.usersCount.value);
    }else{
      this.usersCount = 1;
    }

  //  this.usersCount = parseInt(this.subscriptionForm.controls.usersCount.value);


  } else if (data == 'dashboards') {

  //  this.dashboardCount = parseInt(this.subscriptionForm.controls.dashboardCount.value);
    if(this.subscriptionForm.controls.dashboardCount.value){
      this.dashboardCount = parseInt(this.subscriptionForm.controls.dashboardCount.value);
    }else{
      this.dashboardCount = 1;
    }

  } else if (data == 'alert') {
   // this.alertCount = parseInt(this.subscriptionForm.controls.alertCount.value);
    if(this.subscriptionForm.controls.alertCount.value){
      this.alertCount = parseInt(this.subscriptionForm.controls.alertCount.value);
    }else{
      this.alertCount = 1;
    }

  } else {
   // this.duration = parseInt(this.subscriptionForm.controls.duration.value);

    if(this.subscriptionForm.controls.duration.value){
      this.duration = parseInt(this.subscriptionForm.controls.duration.value);
    }else{
      this.duration = 1;
    }

  }

  }




  ngOnInit(): void {



    setTimeout(() => {
   
      this.formObject = {

        'licenseamt': ['', Validators.required],
        'paymentterms': ['', Validators.required],
        'sitesCount': [1, Validators.required],
        'usersCount': [1, Validators.required],
        'dashboardCount': [1, Validators.required],
        'alertCount': [1, Validators.required],
        'subscriptionDate': ['', Validators.required],
        'duration': [1, Validators.required],
        'clientName': ['', Validators.required],
        'clientemail': ['', [Validators.required, Validators.email]],
        'clientPhone' : ['', [Validators.required, Validators.minLength(14) ,Validators.maxLength(17)]],
        'address': ['', Validators.required],
        'addressline': [''],
        'zipCode': ['', Validators.required],
        'city': ['', Validators.required],
        'state': ['', Validators.required],
        'country': ['United States Of America', Validators.required]
   
      };
  
      this.subscriptionForm = this.fb.group(this.formObject);
    
  
      this.isShowForSave = true;
      this.isShowForUpate = false;
  
     // //console.log('from draft', localStorage.getItem("draft_clientId"));
     // //console.log('from new', localStorage.getItem("draft_clientId"));
  
      if (localStorage.getItem("draft_clientId")) {
        this.isShowForSave = false;
        this.isShowForUpate = true;
        this.dataLoaded = true;
        //console.log('draft call getClientDataById ');
        this.draftClientId = localStorage.getItem("draft_clientId");
        this.getClientDataById();
      }
      //console.log(this.editSubscription);

    }, 100);

  }

  get f() { return this.subscriptionForm.controls; }


  events: string[] = [];

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
    // //console.log('Date:', this.subscriptionForm.controls.subscriptionDate.value);
  }

  handleFileInput(event) {
    const files = (event.target as HTMLInputElement).files;
    this.fileToUpload = files[0].name;
    if(files[0].size / 1000000 >4){
      this.authService.updateErrorMessage('File size cannot exceed 4MB');
      return;
    }
    this.readThis(event,files);
  }


  readThis(event,inputValue: any): void {
    var file: File = inputValue[0];

    const dialogRef = this.dialog.open(ImagecropperComponent,{data:{
      file:event,
      ratio:1/1
     
    }
  ,width:'592px',maxHeight:'max-content', panelClass:'modal-user',disableClose: true,hasBackdrop: false});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.image = result;
      }else{
        event.target.value='';
        this.fileToUpload = '';

      }
    });





    // var myReader: FileReader = new FileReader();

    // myReader.onloadend = (e) => {
    //   this.image = myReader.result;
    //   //console.log(myReader.result);
    // }
    // myReader.readAsDataURL(file);
  }

  emailValidator(control) {
    if (control.value) {
      const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      return matches ? null : { 'invalidEmail': true };
    } else {
      return null;
    }
  }


  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  showVal() {
    //console.log(this.subscriptionForm.controls);
  }

  getMessage(formControlName: string, displayName: string) {
    let val = this.subscriptionForm.get(formControlName).value.trim();
    if (this.subscriptionForm.get(formControlName).status == "VALID") return;
   // this.isFormSubmitted = true;

    if (this.subscriptionForm.get(formControlName).touched && val.length == 0) {
      return displayName + " cannot be empty";
    }
    if (
      !this.subscriptionForm.get(formControlName).pristine &&
      this.subscriptionForm.get(formControlName).invalid
    )

      return 'Enter valid '+displayName;
      return "Entered " + displayName + " is invalid";
    //  this.isFormSubmitted = false;

  }



  onSubmitSubscription(event) {

  }

  get email(){

    return this.subscriptionForm.controls.clientemail;
  }
  get phone(){
    return this.subscriptionForm.controls.clientPhone;
  }


  saveSubscriptionForm() {


    this.dataLoaded = true;
    this.startDate = new Date(this.subscriptionForm.controls.subscriptionDate.value);
    this.lastduration = this.subscriptionForm.controls.subscriptionDate.value.getFullYear();
    this.dateyear = this.lastduration + this.duration;
    this.lastSubscriptionDate = this.startDate.setFullYear(this.dateyear);
    this.finalsubscriptionDate = new Date(this.lastSubscriptionDate);

    if (this.subscriptionForm.valid) {

      if( this.image == undefined){
        this.image = '';
      }

      const clientData = {

        "name": this.subscriptionForm.controls.clientName.value,
        "email": this.subscriptionForm.controls.clientemail.value,
        "phoneNo": this.subscriptionForm.controls.clientPhone.value,
        "licenseValue":  parseInt(this.subscriptionForm.controls.licenseamt.value),
        "paymentterms":  this.subscriptionForm.controls.paymentterms.value,
        "sites": this.sitesCount,
        "users": this.usersCount,
        "dasboards": this.dashboardCount,
        "alerts": this.alertCount,
        "subscriptionStartDate": this.subscriptionForm.controls.subscriptionDate.value,
        "subscriptionEndDate": this.finalsubscriptionDate,
        "address": {
          "line1": this.subscriptionForm.controls.address.value,
          "line2": this.subscriptionForm.controls.addressline.value,
          "zipCode": this.subscriptionForm.controls.zipCode.value,
          "city": this.subscriptionForm.controls.city.value,
          "state": this.subscriptionForm.controls.state.value,
          "country": this.subscriptionForm.controls.country.value
        },
        "logo": this.image
      };

        //console.log('this.image', this.image);

         //console.log('clientData', clientData);
        this.clientsService.saveSubscription(clientData).subscribe((response) => {
        //console.log('subscription Form Response:', response);
        this.clientName =  response['name'];

        //console.log('clientId:', response['primaryKey'].split('#')[1]);
        localStorage.setItem("client_Id", response['primaryKey'].split('#')[1]);

      //console.log('site Count Selected',response['sites']);
      this.clientsService.setSiteCount(response['sites']);


      //console.log('user Count Selected',response['users']);
      this.clientsService.setUserCount(response['users']);
      

        this.stepperData.next();
        this.dataLoaded = false;
      },(httpError:HttpErrorResponse)=>{
        this.dataLoaded = false;
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      });

    }
  }


  updateSubscriptionClient() {


    this.startDate = new Date(this.subscriptionForm.controls.subscriptionDate.value);
    let d = new Date(this.subscriptionForm.controls.subscriptionDate.value);
    this.lastduration = d.getFullYear();
    this.dateyear = this.lastduration + this.duration;
    this.lastSubscriptionDate = this.startDate.setFullYear(this.dateyear);
    this.finalsubscriptionDate = new Date(this.lastSubscriptionDate);
   

    const updateSubcriptionData = {

      "name": this.subscriptionForm.controls.clientName.value,
      "email": this.subscriptionForm.controls.clientemail.value,
      "phoneNo": this.subscriptionForm.controls.clientPhone.value,
      "licenseValue":  parseInt(this.subscriptionForm.controls.licenseamt.value),
      "paymentterms":  this.subscriptionForm.controls.paymentterms.value,
      
      "sites": this.sitesCount,
      "users": this.usersCount,
      "dasboards": this.dashboardCount,
      "alerts": this.alertCount,
      "subscriptionStartDate": this.subscriptionForm.controls.subscriptionDate.value,
      "subscriptionEndDate": this.finalsubscriptionDate,
      "address": {
        "line1": this.subscriptionForm.controls.address.value,
        "line2": this.subscriptionForm.controls.addressline.value,
        "zipCode": this.subscriptionForm.controls.zipCode.value,
        "city": this.subscriptionForm.controls.city.value,
        "state": this.subscriptionForm.controls.state.value,
        "country": this.subscriptionForm.controls.country.value
      },
        "logo": this.image
    };

    //console.log('this.image', this.image);
    this.dataLoaded = true;

    //console.log('updated clientData', updateSubcriptionData);
    this.clientsService.updateSubscription(updateSubcriptionData, this.draftClientId).subscribe((response) => {

      //console.log('updated subscription Form Response:', response);
      //console.log('clientId:', response['primaryKey'].split('#')[1]);
      this.clientName = response['name'],
      

      localStorage.setItem("client_Id", response['primaryKey'].split('#')[1]);

      //console.log('update site Count Selected',response['sites']);
      this.clientsService.setSiteCount(response['sites']);


      //console.log('user Count Selected',response['users']);
      this.clientsService.setUserCount(response['users']);

      this.loadSubscriptionformEvent.emit(response);
      this.stepperData.next();
      //this.dataLoaded = false;

    },(httpError:HttpErrorResponse)=>{
    
      this.dataLoaded = false;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    });




  }



  anyEvent(event){

    //console.log(event);
    let newVal = event.target.value.replace(/\D/g, '');
    this.subscriptionForm.controls['clientPhone'].setValue(event.target.value);

}



  goBack() {

   // //console.log('inside open dialog box');
   // this.dialog.open(DraftModalBoxComponent);
   this.router.navigateByUrl('/clients');

  }

  goForwardUpdate() {

    if(this.subscriptionForm.controls.clientPhone.status === "INVALID"){
      this.isFormSubmitted = true;
    }

    
    if (this.subscriptionForm.valid) { 

      this.dataLoaded = true;

     this.isAddressValid('update');


    }else{


      for (const key of Object.keys(this.subscriptionForm.controls)) {
        if (this.subscriptionForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
       }
      }

      if(this.subscriptionForm.controls.clientemail.value.trim() != ''){
        if(this.subscriptionForm.controls.clientemail.status == "INVALID"){
          this.isemailId = true;
        }else{
          this.isemailId = false;
        }
      }

      this.isFormSubmitted = true;
    }

  }

  isAddressValid(state){

   
    let addressDetails = '<AddressValidateRequest USERID="325HUSHT1273">'+
    '<Revision>1</Revision>'+
    '<Address ID="0">'+
    '<Address1>'+ this.subscriptionForm.controls.address.value + '</Address1>'+
    '<Address2>'+ this.subscriptionForm.controls.addressline.value + '</Address2>'+
    '<City/>'+
    '<State>'+ this.subscriptionForm.controls.state.value  + '</State>'+
    '<Zip5>'+  this.subscriptionForm.controls.zipCode.value + '</Zip5>'+
    '<Zip4/>'+
    '</Address>'+
    '</AddressValidateRequest>';

    //console.log('addressDetails', addressDetails);
   
  //  //Added by samadhan vidhate to skip address validation
  //  if(state == 'update'){

  //   this.updateSubscriptionClient();

  //  }else{

  //   this.saveSubscriptionForm();

  //  }
  //  return;
  //  //addition end
   
    this.clientsService.verifyAddress(addressDetails).subscribe((response) => {
      //console.log('address validation  Response:', response);

      this.dataLoaded = false;

    },(err:any)=>{

  this.dataLoaded = false;
  if(err.error.text.includes('Error')){

    //console.log('if',err.error.text.includes('Error'));
    ////console.log(err.error.text.getElementsByTagName('Description')[0]);
   // var x = xmlDoc.getElementsByTagName("title")[0];
    //this.errorString = 'Address Not Found.';
    this.authService.updateErrorMessage('Address Not Found.');
    for (const key of Object.keys(this.subscriptionForm.controls)) {
      if (this.subscriptionForm.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
     }
    }

  }else{

    const parser = new xml2js.Parser({ strict: false, trim: true });
    parser.parseString(err.error.text, (err, result) => {
      this.addressJsonRes = result;

      //console.log('verified address Response', this.addressJsonRes);
      if(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1){
        this.subscriptionForm.controls['addressline'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1[0]);
      }

      this.subscriptionForm.controls['address'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS2[0]);
      this.subscriptionForm.controls['zipCode'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ZIP5[0]);
      this.subscriptionForm.controls['city'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].CITY[0]);
      this.subscriptionForm.controls['state'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].STATE[0]);

    });

   if(state == 'update'){

    this.updateSubscriptionClient();

   }else{

    this.saveSubscriptionForm();

   }

    //console.log('else',err.error.text.includes('Error'));

  }
});

  }


  goForward() {


    if(this.subscriptionForm.controls.clientPhone.status === "INVALID"){
      this.isFormSubmitted = true;
    }

    if (this.subscriptionForm.valid) {
      this.dataLoaded = true;
      this.isAddressValid('New');
      this.isFormSubmitted = false;
     // ;
    } else{


    for (const key of Object.keys(this.subscriptionForm.controls)) {
      if (this.subscriptionForm.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
     }
    }

      // this.subscriptionForm.markAllAsTouched();
      // this.scrollToFirstInvalidControl();

      if(this.subscriptionForm.controls.clientemail.value.trim() != ''){
        if(this.subscriptionForm.controls.clientemail.status == "INVALID"){
          this.isemailId = true;
        }else{
          this.isemailId = false;
        }
      }
      this.isFormSubmitted = true;


    }
  }


  plus(data) {

    if (data == 'sites') {
      if ( this.sitesCount < 999)  {
        this.sitesCount ++;
        this.subscriptionForm.controls['sitesCount'].setValue(this.sitesCount);

      }
      //console.log(this.sitesCount);
    } else if (data == 'users') {

      if ( this.usersCount < 999) {
      this.usersCount++;
      this.subscriptionForm.controls['usersCount'].setValue(this.usersCount);

      }
    } else if (data == 'dashboards') {
      if (this.dashboardCount < 999) {

      this.dashboardCount++;
      this.subscriptionForm.controls['dashboardCount'].setValue(this.dashboardCount);

      }
    } else if (data == 'alert') {
      if (this.alertCount < 999) {
          this.alertCount++;
          this.subscriptionForm.controls['alertCount'].setValue(this.alertCount);

      }
    } else {
      if (this.duration < 100) {

      this.duration++;
      //console.log(this.duration);
      this.subscriptionForm.controls['duration'].setValue(this.duration);

      }
    }
  }





  minus(data) {

    if (data == 'sites') {

      if (this.sitesCount > 1 && this.sitesCount < 1000)  {
        this.sitesCount--;
        this.subscriptionForm.controls['sitesCount'].setValue(this.sitesCount);


        //console.log(this.sitesCount);
      }
    } else if (data == 'users') {
      if (this.usersCount > 1  && this.usersCount < 1000) {
        this.usersCount--;
        //console.log(this.usersCount);
        this.subscriptionForm.controls['usersCount'].setValue(this.usersCount);

      }
    } else if (data == 'dashboards' ) {
      if (this.dashboardCount > 1 && this.dashboardCount < 1000) {
        this.dashboardCount--;
        //console.log(this.dashboardCount);
        this.subscriptionForm.controls['dashboardCount'].setValue(this.dashboardCount);

      }
    } else if (data == 'alert') {
      if (this.alertCount > 1 && this.alertCount < 1000) {
        this.alertCount--;
        //console.log(this.alertCount);
        this.subscriptionForm.controls['alertCount'].setValue(this.alertCount);

      }
    } else {
      if (this.duration > 1 && this.duration < 100) {
        this.duration--;
        //console.log(this.duration);
        this.subscriptionForm.controls['duration'].setValue(this.duration);

      }
    }
  }

}
