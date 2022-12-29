import { Component, EventEmitter, Input, OnInit, Output , ElementRef} from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ClientsService } from '../../clients.service';
import { MatDialog } from '@angular/material/dialog';
import { DraftModalBoxComponent } from '../draft-modal-box/draft-modal-box.component';
import * as xml2js from 'xml2js';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { ImagecropperComponent } from 'src/app/shared/imagecropper/imagecropper.component';


 let self = null;

@Component({
  selector: 'app-sites-card',
  templateUrl: './sites-card.component.html',
  styleUrls: ['./sites-card.component.scss']
})


export class SitesCardComponent implements OnInit {
  @Input() stepperData: any;
  @Output() loadSiteformEvent = new EventEmitter<any>();
  errorString="";

  

  siteList = [];
  isShowAddsection = false;
  isFormSubmitted = false;
  isupdateFormSubmitted = false;
  isShowAddbtn = true;
  formObject : any;
  sitesForm: UntypedFormGroup;
  updatesitesForm: UntypedFormGroup;
  clientId = localStorage.getItem('client_Id');
  image: string | ArrayBuffer;
  fileToUpload: string;
  isShowUpdateAddsection: boolean =  false;
  editformObject: any;
  dataLoaded : boolean = false;
  site_id: any;
  currentlatitude : number;
  currentlongitude : number;  
  isemailId: boolean = false;
  isupdateemailId: boolean = false;
  addressJsonRes: any;
  latitude: number;
  longitude: number;
  reg: RegExp;

  constructor(private el: ElementRef ,private fb: UntypedFormBuilder , private clientsService : ClientsService , public dialog: MatDialog ,private authService:AuthService) { }

  ngOnChanges() {

    this.newObjct();

  }

  ngOnInit(): void {
    
    //console.log('get siteCount',this.clientsService.getSiteCount());  
    //console.log('clientId', this.clientId);
     this.getSitesByClient();
  }


  get f() { return this.sitesForm.controls; }
  get f1() { return this.updatesitesForm.controls; }


  newObjct(){

    this.formObject = {
     
      'siteName': ['', Validators.required],
      'siteId': ['', Validators.required],
      'siteemail': ['',[Validators.required,Validators.email]],
      'address': ['', Validators.required],
      'addressline': [''],
      'zipCode': ['', Validators.required],
      'city': ['', Validators.required],
      'state': ['', Validators.required],
      'location':[""],
      'dropboxLink': [''],
      'country': ['United States Of America', Validators.required]
    };

    this.sitesForm = this.fb.group(this.formObject);
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
  var file:File = inputValue[0];
  const dialogRef = this.dialog.open(ImagecropperComponent,{data:{
    file:event,
    ratio:2/1
   
  }
,width:'592px',maxHeight:'max-content', panelClass:'modal-user',disableClose: true,hasBackdrop:false});

  dialogRef.afterClosed().subscribe(result => {
    if(result){
      this.image = result;
    }else{
      event.target.value='';
      this.fileToUpload = '';

    }
  });




  // var myReader:FileReader = new FileReader();

  // myReader.onloadend = (e) => {
  //   this.image = myReader.result;
  //   //console.log(myReader.result);
  // }
  // myReader.readAsDataURL(file);
}


showVal() {
  //console.log(this.sitesForm.controls);
}

getMessage(formControlName: string, displayName: string) {
  let val = this.sitesForm.get(formControlName).value.trim();
  if (this.sitesForm.get(formControlName).status == "VALID") return;
 // this.isFormSubmitted = true;

  if (this.sitesForm.get(formControlName).touched && val.length == 0) {
    return displayName + " cannot be empty";
  }
  if (
    !this.sitesForm.get(formControlName).pristine &&
    this.sitesForm.get(formControlName).invalid
  )
    return "Entered " + displayName + " is invalid";
  //  this.isFormSubmitted = false;
}



getMessageUpdate(formControlName: string, displayName: string) {
  let val = this.updatesitesForm.get(formControlName).value.trim();
  if (this.updatesitesForm.get(formControlName).status == "VALID") return;
 // this.isFormSubmitted = true;

  if (this.updatesitesForm.get(formControlName).touched && val.length == 0) {
    return displayName + " cannot be empty";
  }
  if (
    !this.updatesitesForm.get(formControlName).pristine &&
    this.updatesitesForm.get(formControlName).invalid
  )
    return "Entered " + displayName + " is invalid";
  //  this.isFormSubmitted = false;
}



upadteSite(data){

  this.isShowAddsection = false;
  this.site_id = data['sortKey'].split('#')[1];
  this.editformObject = {
     
    'editSiteName': ['', Validators.required],
    'editSiteId': ['', Validators.required],
    'editSiteemail': ['', [Validators.required,Validators.email]],
    'editaddressline': ['', ],
    'editaddress': ['', Validators.required],
    'editzipCode': ['', Validators.required],
    'editcity': ['', Validators.required],
    'editstate': ['', Validators.required],
    'editlocation':[''],
    'editdropboxLink': [''],
    'editcountry': ['United States Of America', Validators.required]
  };

  this.updatesitesForm = this.fb.group(this.editformObject);

  //console.log('update data', data);
   this.isShowUpdateAddsection = true;
   this.isShowAddbtn = false;

   const fetchdataShow = {
    'editSiteName': data.name,
    'editSiteId': data.customSiteId,
    'editSiteemail': data.email,
    'editaddress': data.address.line1,
    'editaddressline':data.address.line2,
    'editzipCode': data.address.zipCode,
    'editcity': data.address.city,
    'editstate': data.address.state,
    'editlocation': data.location && data.location.latitude && data.location.longitude ?data.location.latitude+', '+data.location.longitude : '',
    'editdropboxLink': data.dropboxLink,
    'editcountry':  data.address.country
  };

  //console.log('fetchdataShow',fetchdataShow);
  this.updatesitesForm.patchValue(fetchdataShow);


  this.fileToUpload = '';

}

closeUpateForm(){
  this.isShowUpdateAddsection = false;
  this.isShowAddbtn = true;
  this.isShowAddsection = false;
}

  getSitesByClient() {
    this.dataLoaded  = true;
    
        // this.searchedClients[this.selectedClientIndex].primaryKey.split('#')[1];
        this.clientsService.getSiteListByClient(this.clientId).subscribe((response)=> {
        //console.log(response);
        this.siteList = response['sites'];
        //console.log('this.siteList', this.siteList);
        //console.log('siteList', this.siteList);
        this.dataLoaded  = false;
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded  = false;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    });
  }

  onSubmitSitesForm(event) {

  }

  closeForm(){
    this.isShowAddsection = false;
    this.isShowAddbtn = true;
  }

  goForword(){

    this.loadSiteformEvent.emit(this.siteList);
    this.stepperData.next();


  }


  

 addSite(){

  this.newObjct();

  //console.log(' get siteCount',this.clientsService.getSiteCount());
  if(this.siteList.length == this.clientsService.getSiteCount()){
    if(this.siteList.length == this.clientsService.getSiteCount()){
    this.authService.updateErrorMessage('You cant Add sites More than ' + this.clientsService.getSiteCount());
  }
  }else{
  this.isShowAddsection = true;
  this.isShowAddbtn = false;
  this.fileToUpload = '';
  this.image = '';
  this.isFormSubmitted = false;
  }
 }

  saveSiteDetails(){


    if(this.sitesForm.valid){

      this.isFormSubmitted = false;
      //console.log(this.sitesForm.value)
      const siteData = {
        "name": this.sitesForm.controls.siteName.value,
        "customSiteId": this.sitesForm.controls.siteId.value,
        "dropboxLink":  this.sitesForm.controls.dropboxLink.value ,
        "email": this.sitesForm.controls.siteemail.value,
        "location": {
          "latitude": this.latitude,
          "longitude":this.longitude
        },
        "address": {
          "line1": this.sitesForm.controls.address.value,
          "line2": this.sitesForm.controls.addressline.value,
          "zipCode": this.sitesForm.controls.zipCode.value,
          "city": this.sitesForm.controls.city.value,
          "state": this.sitesForm.controls.state.value,
          "country": this.sitesForm.controls.country.value,
        },
        "siteImage": this.image
        }
    
      //console.log('site details', siteData);
      this.dataLoaded  = true;
    
      
      this.clientsService.addSiteByClient(siteData , this.clientId).subscribe((response)=> {
    
        //console.log(response);
        this.getSitesByClient();
        this.isShowAddsection = false;
        this.isShowAddbtn = true;
        this.dataLoaded  = false;
    
    
      },(httpError:HttpErrorResponse)=>{
        this.dataLoaded  = false;
        this.authService.updateErrorMessage(httpError['error']['message']);
      });


    }else{



      for (const key of Object.keys(this.sitesForm.controls)) {
        if (this.sitesForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
       }
      }

      if(this.sitesForm.controls.siteemail.value.trim() != ''){
        if(this.sitesForm.controls.siteemail.status == "INVALID"){
          this.isemailId = true;
        }else{
          this.isemailId = false;
        }
      }
      this.isFormSubmitted = true;
    }
  }

   getLocation(mode) {
    if (navigator.geolocation) {
    //  navigator.geolocation.watchPosition(this.showPosition);
      self = this;
      if(mode == 'create'){
        navigator.geolocation.getCurrentPosition(this.showPosition);

      }else{

        navigator.geolocation.getCurrentPosition(this.updateshowPosition);

      }
    } else { 
      
    }
  }

  updateshowPosition(position ) {
    
    //console.log('update lat', position.coords.latitude);
    //console.log('update long', position.coords.longitude); 
    self.updateCoordinates(position.coords.latitude, position.coords.longitude)
}


   showPosition(position ) {
    
    //console.log('lat', position.coords.latitude);
    //console.log('long', position.coords.longitude); 
    self.saveCoordinates(position.coords.latitude, position.coords.longitude)
}

saveCoordinates(lat,long){
  //console.log(lat,long);
  self.currentlatitude = lat;
  self.currentlongitude = long;
  this.sitesForm.controls.location.setValue(self.currentlatitude+", "+self.currentlongitude)
}


updateCoordinates(lat,long){
  //console.log(lat,long);
  self.currentlatitude = lat;
  self.currentlongitude = long;
  this.updatesitesForm.controls.editlocation.setValue(self.currentlatitude+", "+self.currentlongitude)
}

  goBack() {

    //console.log('inside open dialog box');
   
 //  this.dialog.open(DraftModalBoxComponent);

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


  checkLatLongValidation(state) {
    
    
if( state == 'create'){

  //console.log(this.sitesForm.controls.location.value);


  var latlong =  this.sitesForm.controls.location.value.split(',');
  this.latitude = latlong[0];
  this.longitude = latlong[1];
  //  this.latitude = parseFloat(latlong[0]);
  //  this.longitude = parseFloat(latlong[1]);

  //console.log('', this.latitude + ' ' + this.longitude);

}else {

  var latlong =  this.updatesitesForm.controls.editlocation.value.split(',');
  this.latitude = latlong[0];
  this.longitude = latlong[1];
  //  this.latitude = parseFloat(latlong[0]);
  //  this.longitude = parseFloat(latlong[1]);

  //console.log('', this.latitude + ' ' + this.longitude);

}



  // var latitude = document.getElementById(lat).value;
  //  var longitude = document.getElementById(lng).value;

    //  let reg = new RegExp("^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}");

    // if( reg.exec(latlong[0]) ) {
    //       //do nothing

    //       //console.log('correct:', this.latitude);
    //       } else {

    //         //console.log('error:', this.latitude);

    //       //error
    // }

    // if( reg.exec(latlong[1]) ) {

    //   //console.log('correct:', this.longitude);

    //       //do nothing
    //       } else {

    //         //console.log('error:', this.longitude);

    //       //error
    // }

  }



  isAddressValid(state){




    if(state == 'update'){

    if(this.updatesitesForm.valid){

      this.checkLatLongValidation('update');

      this.dataLoaded = true;

      this.isupdateFormSubmitted = false;

      let addressDetails = '<AddressValidateRequest USERID="325HUSHT1273">'+
      '<Revision>1</Revision>'+
      '<Address ID="0">'+
      '<Address1>'+ this.updatesitesForm.controls.editaddress.value + '</Address1>'+
      '<Address2>'+ this.updatesitesForm.controls.editaddressline.value + '</Address2>'+
      '<City/>'+
      '<State>'+ this.updatesitesForm.controls.editstate.value  + '</State>'+
      '<Zip5>'+  this.updatesitesForm.controls.editzipCode.value + '</Zip5>'+
      '<Zip4/>'+
      '</Address>'+
      '</AddressValidateRequest>';
  
      //console.log('addressDetails', addressDetails);
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
      this.isupdateFormSubmitted = true;
      this.dataLoaded = false;


      for (const key of Object.keys(this.updatesitesForm.controls)) {
        if (this.updatesitesForm.controls[key].invalid) {
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
          this.updatesitesForm.controls['editaddressline'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1[0]);
        }
  
        this.updatesitesForm.controls['editaddress'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS2[0]);
        this.updatesitesForm.controls['editzipCode'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ZIP5[0]);
        this.updatesitesForm.controls['editcity'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].CITY[0]);
        this.updatesitesForm.controls['editstate'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].STATE[0]);
  
      });
  

        this.updateSiteDetails();
      //console.log('else',err.error.text.includes('Error'));
  
    }
  });

    } else{

      this.isupdateFormSubmitted = true;

      for (const key of Object.keys(this.updatesitesForm.controls)) {
        if (this.updatesitesForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
       }
      }
    }
    } else {


          this.checkLatLongValidation('create');

      if(this.sitesForm.valid){



        this.isFormSubmitted = false;
        this.dataLoaded = true;
      
        let addressDetails = '<AddressValidateRequest USERID="325HUSHT1273">'+
        '<Revision>1</Revision>'+
        '<Address ID="0">'+
        '<Address1>'+ this.sitesForm.controls.address.value + '</Address1>'+
        '<Address2>'+ this.sitesForm.controls.addressline.value + '</Address2>'+
        '<City/>'+
        '<State>'+ this.sitesForm.controls.state.value  + '</State>'+
        '<Zip5>'+  this.sitesForm.controls.zipCode.value + '</Zip5>'+
        '<Zip4/>'+
        '</Address>'+
        '</AddressValidateRequest>';
    
        //console.log('addressDetails', addressDetails);
        this.clientsService.verifyAddress(addressDetails).subscribe((response) => {
          //console.log('address validation  Response:', response);
    
        },(err:any)=>{
    
      this.dataLoaded = false;
      if(err.error.text.includes('Error')){
    
        //console.log('if',err.error.text.includes('Error'));
        ////console.log(err.error.text.getElementsByTagName('Description')[0]);
       // var x = xmlDoc.getElementsByTagName("title")[0];
        //this.errorString = 'Address Not Found.';  
        this.authService.updateErrorMessage('Address Not Found.');
            this.isFormSubmitted = true;
  
  
    
        for (const key of Object.keys(this.sitesForm.controls)) {
          if (this.sitesForm.controls[key].invalid) {
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
            this.sitesForm.controls['addressline'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1[0]);
          }
    
          this.sitesForm.controls['address'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS2[0]);
          this.sitesForm.controls['zipCode'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ZIP5[0]);
          this.sitesForm.controls['city'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].CITY[0]);
          this.sitesForm.controls['state'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].STATE[0]);
    
        });
    
    
        //console.log('else',err.error.text.includes('Error'));
        this.saveSiteDetails();
    
      }
    });

      } else {

        this.isFormSubmitted = true;


        for (const key of Object.keys(this.sitesForm.controls)) {
          if (this.sitesForm.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
         }
        }


      }


     
    
    }

   

  }  





  updateSiteDetails(){
    //console.log(this.updatesitesForm.controls);
    if(this.updatesitesForm.valid){
      // console.error('data',)
      this.isupdateFormSubmitted = false;
      const updatesiteData = {
        "name": this.updatesitesForm.controls.editSiteName.value,
        'customSiteId': this.updatesitesForm.controls.editSiteId.value,
        "dropboxLink":  this.updatesitesForm.controls.editdropboxLink.value ,
        "email": this.updatesitesForm.controls.editSiteemail.value,
        "location": {
            "latitude": this.latitude,
            "longitude": this.longitude
            // "latitude": this.currentlatitude,
            // "longitude":this.currentlongitude
        },
        "address": {
          "line1": this.updatesitesForm.controls.editaddress.value,
          "line2": this.updatesitesForm.controls.editaddressline.value,
          "zipCode": this.updatesitesForm.controls.editzipCode.value,
          "city": this.updatesitesForm.controls.editcity.value,
          "state": this.updatesitesForm.controls.editstate.value,
          "country": this.updatesitesForm.controls.editcountry.value,
        },
        "siteImage": this.image
        }
    // this.site_id
      //console.log('updated site details', updatesiteData)
      this.dataLoaded  = true;
    // this.site_id
     this.clientsService.updateSite(updatesiteData , this.clientId , this.site_id).subscribe((response)=> {
    
        //console.log(response);
        this.getSitesByClient();
        this.dataLoaded  = false;
        this.closeUpateForm();
         // response save site
      },(httpError:HttpErrorResponse)=>{
          this.dataLoaded  = false;
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      });

    }else{


      for (const key of Object.keys(this.updatesitesForm.controls)) {
        if (this.updatesitesForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
       }
      }

      if(this.updatesitesForm.controls.editSiteemail.value.trim() != ''){
        if(this.updatesitesForm.controls.editSiteemail.status == "INVALID"){
          this.isupdateemailId = true;
        }else{
          this.isupdateemailId = false;
        }
      }

      this.isupdateFormSubmitted = true;


    }

   
  }


}
