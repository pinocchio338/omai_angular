import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { from } from 'rxjs';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { environment } from 'src/environments/environment';
import { UserService } from '../user.service';
import { ClientsService } from './../../clients/clients.service';
import * as xml2js from 'xml2js';
import { AuthService } from 'src/app/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ImagecropperComponent } from 'src/app/shared/imagecropper/imagecropper.component';

@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.scss']
})
export class NewuserComponent implements OnInit {
  frmUser: UntypedFormGroup;
  file: File;
  imageUrl: string | ArrayBuffer = '';
  bgImageUrl = environment.imgUrl+'sample-site-image.png';
  fileName: string = "No file selected";
  inProcess:boolean = false;
  @ViewChild("userImage") userImage:ElementRef;
  siteList: Array<any> = [];
  errorString="";
  addressJsonRes: any;
  isemailId: boolean;
  isemailtotextId: boolean;
  constructor(private el: ElementRef , private clientsService: ClientsService ,private fb: UntypedFormBuilder,@Inject(MAT_DIALOG_DATA) public data:any, private _userService:UserService, public dialogRef: MatDialogRef<NewuserComponent> ,public alertDialog: MatDialog,private authService:AuthService) {
    
    this.frmUser = this.fb.group({
      name: [data.name, Validators.compose([Validators.required,Validators.maxLength(100)])],
      email: ['', Validators.compose([Validators.required,this.emailValidator,Validators.maxLength(100)])],
      emailtotext: ['', Validators.compose([this.emailValidator,Validators.maxLength(100)])],
      phone: ['', [Validators.required, Validators.minLength(14), Validators.maxLength(17)]],
      photo: [null],
      siteAssociated:[],
      dutUser:['No'],
      alertLevel:['Medium'],
      selected:[true],
      address: ['', Validators.compose([Validators.maxLength(100)])],
      addressline: [''],
      zipCode: ['', Validators.compose([Validators.maxLength(5)])],
      city: ['', Validators.compose([Validators.maxLength(25)])],
      state: ['', Validators.compose([Validators.maxLength(25)])],
      country: ['United States Of America']
    })
   }


   getMessage(formControlName: string, displayName: string) {
    let val = this.frmUser.get(formControlName).value.trim();
    if (this.frmUser.get(formControlName).status == "VALID") return;
   // this.isFormSubmitted = true;
  
    if (this.frmUser.get(formControlName).touched && val.length == 0) {
      return displayName + " cannot be empty";
    }
    if (
      !this.frmUser.get(formControlName).pristine &&
      this.frmUser.get(formControlName).invalid
    )
      return "Entered " + displayName + " is invalid";
    //  this.isFormSubmitted = false;
  }


  anyEvent(event){

      //console.log(event);
      let newVal = event.target.value.replace(/\D/g, '');
      this.frmUser.controls['phone'].setValue(event.target.value);

  }


   emailValidator(control) {
    if (control.value) {
      const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      return matches ? null : { 'invalidEmail': true };
    } else {
      return null;
    }
  }
  get address(){
    return this.frmUser.controls.address;
  }
  set address(val){
    this.frmUser['controls'].address.setValue(val);
  }
  get addressline(){
    return this.frmUser.controls.addressline;
  }
  set addressline(val){
    this.frmUser['controls'].addressline.setValue(val);
  }
  get zipCode(){
    return this.frmUser.controls.zipCode;
  }
  set zipCode(val){
    this.frmUser['controls'].zipCode.setValue(val);
  }
  get city(){
    return this.frmUser.controls.city;
  }
  set city(val){
    this.frmUser['controls'].city.setValue(val);
  }
  get state(){
    return this.frmUser.controls.state;
  }
  set state(val){
    this.frmUser['controls'].state.setValue(val);
  }
  get country(){
    return this.frmUser.controls.country;
  }
  set country(val){
    this.frmUser['controls'].country.setValue(val);
  }
   get photo(){
    return this.frmUser.controls.photo;
  }
  get name(){
    return this.frmUser.controls.name;
  }
  set name(val){
    this.frmUser['controls'].name.setValue(val);
  }
  
  get email(){
    return this.frmUser.controls.email;
  }
  
  set email(val){
    this.frmUser['controls'].email.setValue(val);
  }
  get emailtotext(){
    return this.frmUser.controls.emailtotext;
  }
  
  set emailtotext(val){
    this.frmUser['controls'].emailtotext.setValue(val);
  }
  
  get phone(){
    return this.frmUser.controls.phone;
  }
  set phone(val){
    this.frmUser['controls'].phone.setValue(val);
  }
  get siteAssociated(){
    return this.frmUser.controls.siteAssociated;
  }
  set siteAssociated(val){
    this.frmUser['controls'].siteAssociated.setValue(val);
  }
  
  get dutUser(){
    return this.frmUser.controls.dutUser;
  }
  set dutUser(val){
    this.frmUser['controls'].dutUser.setValue(val);
  }
  get alertLevel(){
    return this.frmUser.controls.alertLevel;
  }
  showAlert(alertMsg='',alertType='success',alertTitle='') {
    const dialogRef = this.alertDialog.open(AlertComponent,{data:{
      alertMsg:alertMsg,
      alertType:alertType,
      alertTitle:alertTitle
    },panelClass:'modal-alert'});

    dialogRef.afterClosed().subscribe(result => {
      this.inProcess = false;
    });
  }
  uploadPhoto(event) {
    const file = (event.target as HTMLInputElement).files[0];
    if(file.size / 1000000 >4){
      this.authService.updateErrorMessage('File size cannot exceed 4MB');
      return;
    }
    const dialogRef = this.alertDialog.open(ImagecropperComponent,{data:{
      file:event,
      ratio:1/1
     
    }
  ,width:'592px',maxHeight:'max-content', panelClass:'modal-user',disableClose: false});

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.imageUrl = result;
        this.frmUser.patchValue({
          photo: result
        });
        this.photo.updateValueAndValidity();
      }
    });
    // const file = (event.target as HTMLInputElement).files[0];
    // if (file) {
    //   this.fileName = file.name;
    //   this.file = file;
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = event => {
    //     this.imageUrl = reader.result;
    //     this.frmUser.patchValue({
    //       photo: reader.result
    //     });
    //   };
      
    //   this.photo.updateValueAndValidity()
    // }
  }
  changeImage(){
    this.userImage.nativeElement.click();
  }



  isAddressValid(){
    
    if(this.frmUser.controls.address.value!='' && this.frmUser.controls.zipCode.value!=''){


    let addressDetails = '<AddressValidateRequest USERID="325HUSHT1273">'+
    '<Revision>1</Revision>'+
    '<Address ID="0">'+
    '<Address1>'+ this.frmUser.controls.address.value + '</Address1>'+
    '<Address2>'+ this.frmUser.controls.addressline.value + '</Address2>'+
    '<City/>'+
    '<State>'+ this.frmUser.controls.state.value  + '</State>'+
    '<Zip5>'+  this.frmUser.controls.zipCode.value + '</Zip5>'+
    '<Zip4/>'+
    '</Address>'+
    '</AddressValidateRequest>';

    //console.log('addressDetails', addressDetails);
    this.clientsService.verifyAddress(addressDetails).subscribe((response) => {
      //console.log('address validation  Response:', response);

    },(err:any)=>{

  this.inProcess = false;
  if(err.error.text.includes('Error')){

    //console.log('if',err.error.text.includes('Error'));
    ////console.log(err.error.text.getElementsByTagName('Description')[0]);
   // var x = xmlDoc.getElementsByTagName("title")[0];
    // this.errorString = 'Address Not Found.';
    this.authService.updateErrorMessage(this.errorString);

    for (const key of Object.keys(this.frmUser.controls)) {
      if (this.frmUser.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
     }
    }

  } else{

    const parser = new xml2js.Parser({ strict: false, trim: true });
    parser.parseString(err.error.text, (err, result) => {
      this.addressJsonRes = result;

      //console.log('verified address Response', this.addressJsonRes);
      if(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1){
        this.frmUser.controls['addressline'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1[0]);
      }

      this.frmUser.controls['address'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS2[0]);
      this.frmUser.controls['zipCode'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ZIP5[0]);
      this.frmUser.controls['city'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].CITY[0]);
      this.frmUser.controls['state'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].STATE[0]);

    });

      this.saveUser();
      //console.log('else',err.error.text.includes('Error'));

    }
  });

    }else{

      this.saveUser();
    }


  }


validateUser(){

  if(this.frmUser.invalid){

    for (const key of Object.keys(this.frmUser.controls)) {
      if (this.frmUser.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
     }
    }


    if(this.frmUser.controls.email.value.trim() != ''){
      if(this.frmUser.controls.email.status == "INVALID"){
        this.isemailId = true;
       // this.isFormSubmitted = true;

      }else{
        this.isemailId = false;
      }
    }
    if(this.frmUser.controls.emailtotext.value.trim() != ''){
      if(this.frmUser.controls.emailtotext.status == "INVALID"){
        this.isemailtotextId = true;
      //  this.isFormSubmitted = true;

      }else{
        this.isemailtotextId = false;
      }
    }


    return false;

  }else{


    this.isAddressValid();

  }

}

  saveUser(){

   if(this.frmUser.invalid){
    return false;

   }else{

    this.inProcess = true;
    let userFormData = this.frmUser.value
    let userObject = {
      "address": {
        "city": userFormData['city'],
        "line1": userFormData['address'],
        "line2": userFormData['addressline'],
        "state": userFormData['state'],
        "country": userFormData['country'],
        "zipCode": userFormData['zipCode']
      },
      "alertLevel": userFormData['alertLevel'],
      "dutUser": userFormData['dutUser'],
      "email": userFormData['email'],
      "emailtotext": userFormData['emailtotext'],
      "name": userFormData['name'],
      "phone": userFormData['phone'],
      "photo": userFormData['photo'],
      "siteAssociated":userFormData['siteAssociated']
    }
    
    //console.log(userObject);
debugger;
    this._userService.addNewUser(userObject,this.data.clientId).subscribe((res:any)=>{
      this.inProcess =false;
      if(res){
        let newUser = res;
        newUser['selected']  = true;
        this.dialogRef.close(newUser);
      }
    },(httpError:HttpErrorResponse)=>{
      this.inProcess =false;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
      //this.showAlert(err.error.message,'error',"Failed to save");
    })
    
    // then((res)=>{
    //   this.dialogRef.close(res);
    // })

   }
   
  }
  ngOnInit(): void {
    this._userService.getAllSites(this.data.clientId).subscribe((res:any)=>{
     if(res && res.sites){
       this.siteList = res.sites;
     }
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }



}
