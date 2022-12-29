import { Component, EventEmitter, Input, OnInit, Output ,ElementRef} from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ClientsService } from '../../clients.service';
import { MatDialog } from '@angular/material/dialog';
 import { DraftModalBoxComponent } from '../draft-modal-box/draft-modal-box.component';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import * as xml2js from 'xml2js';
import { AuthService } from 'src/app/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ImagecropperComponent } from 'src/app/shared/imagecropper/imagecropper.component';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  
  @Input() stepperData: any;
  @Output() loadformEvent = new EventEmitter<any>();


  errorString="";
  userList = [];
  usergroupList = [];
  isShowAddsection = false;
  isShowAddbtn = true;
  formObject: any;
  userForm: UntypedFormGroup;
  updateuserForm: UntypedFormGroup;
  isFormSubmitted:boolean = false;
  isupdatedFormSubmitted:boolean = false;
  favoriteSeason: string;
  favoriteSeason1: string;
  clientId = localStorage.getItem('client_Id');
  dutUserList: any[] =  ['Yes','No'];

  alertype: string[] = ['High', 'Medium', 'Low'];
  userImage: string | ArrayBuffer;
  fileToUpload: string;
  userlength: number = 0;
  dataLoaded: boolean = false;
  isShowUpdateAddsection: boolean = false;
  user_id = null
  group_id: any;
  editformObject: any;
  updateUserId: any;
  userIdForUpdate: any;
  alertDialog: any;
  inProcess: boolean;
  isupdateemailId: boolean;
  isupdateemailtotextId:boolean;
  isemailId: boolean;
  isemailtotextId:boolean;
  dutUser : boolean;
  addressJsonRes: any;


  constructor(private authService: AuthService, private el: ElementRef , private fb: UntypedFormBuilder, private clientsService: ClientsService , public dialog: MatDialog ) { }

  ngOnChange(){

    //console.log('on change site');
    
  }

  ngOnInit(): void {

    this.newObject();
    this.getAllUsesByClient();
  }


  newObject(){


    this.formObject = {

      'usergroup': [[], Validators.required],
      'userName': ['', Validators.required],
      'email': ['', [Validators.required,Validators.email]],
      'emailtotext': ['', [Validators.email]],
      
      'phoneno': ['', [Validators.required, Validators.minLength(14) ,Validators.maxLength(17)]],
      'dutUser': ['false'],
      'alertLevel': ['Medium'],
      'address': [''],
      'addressline': [''],
      'zipCode': [''],
      'city': [''],
      'state': [''],
      'country': ['United States Of America']

    };
    this.userForm = this.fb.group(this.formObject);

  }


  
  get f() { return this.userForm.controls; }
  get f1() { return this.updateuserForm.controls; }



  anyEvent(event){

    //console.log(event);
    let newVal = event.target.value.replace(/\D/g, '');
    this.userForm.controls['phoneno'].setValue(event.target.value);
}

editanyEvent(event){

  //console.log(event);
  let newVal = event.target.value.replace(/\D/g, '');
  this.updateuserForm.controls['editphoneno'].setValue(event.target.value);
}


  getAllUsesByClient() {

    this.dataLoaded = true;

    this.clientsService.getAllUserandUserGroupByClient(this.clientId).subscribe((response) => {
      //console.log('getAllUserGroupByClient', response);
      this.userList = response['userInfo']['users'];
      this.userlength =  this.userList.length;
      this.usergroupList = response['userInfo']['userGroups'];

      //console.log('UserList',this.usergroupList);
      this.group_id = this.usergroupList[0]['sortKey'].split('#')[1];
      //console.log('group_id',this.group_id);
     // //console.log('All Group User', this.group_id );
      this.dataLoaded = false;
      //  //console.log('this.siteList', this.siteList);

    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = false;
      //this.errorString = err.error.message; 
      this.authService.updateErrorMessage(httpError['error']['message']);
    });


  }

  onSubmitSitesForm(event) {

  }

  closeForm() {

    this.newObject();
    this.isShowAddsection = false;
    this.isShowAddbtn = true;
  
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
  



  openFinishForm(){

    //this.stepperData.selectedIndex = 4;
    this.loadformEvent.emit(this.userList);
    if(this.userList.length > 0){
      this.stepperData.next();
    }


  }


  


  addUser() {

    this.newObject();

    if(this.userList.length == this.clientsService.getUserCount()){
      if(this.userList.length == this.clientsService.getUserCount()){
      this.authService.updateErrorMessage('You cant Add User More than ' + this.clientsService.getUserCount());
    }
    }else{


    this.isShowAddsection = true;
    this.isShowAddbtn = false;
    this.fileToUpload = '';
    this.userImage = '';

    }

    
 

   // typeof(url) !== 'undefined' && url ? url : 'assets/sample-site-image.png';
  }


  // handleFileInput(event) {
  //   //const files = event[0].File;
  //    const files = (event.target as HTMLInputElement).files;
  //   this.fileToUpload = files[0].name;
  //   if(files[0].size / 1000000 >4){
  //     this.authService.updateErrorMessage('File size cannot exceed 4MB');
  //     return;
  //   }
  //   this.readThis(event,files);
  // }

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
      ratio:1/1
     
    }
  ,width:'592px',maxHeight:'max-content', panelClass:'modal-user',disableClose: true,hasBackdrop:false});
  
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.userImage = result;
      }else{
        this.fileToUpload = '';
        event.target.value='';
      }
    });
    // var myReader:FileReader = new FileReader();
  
    // myReader.onloadend = (e) => {
    //   this.userImage = myReader.result;
    //   //console.log(myReader.result);
    // }
    // myReader.readAsDataURL(file);
  }


  
showVal() {
  //console.log(this.userForm.controls);
}

getMessage(formControlName: string, displayName: string) {
  let val = this.userForm.get(formControlName).value.trim();
  if (this.userForm.get(formControlName).status == "VALID") return;
 // this.isFormSubmitted = true;

  if (this.userForm.get(formControlName).touched && val.length == 0) {
    return displayName + " cannot be empty";
  }
  if (
    !this.userForm.get(formControlName).pristine &&
    this.userForm.get(formControlName).invalid
  )
    return "Entered " + displayName + " is invalid";
  //  this.isFormSubmitted = false;
}



getMessageUpdate(formControlName: string, displayName: string) {
  let val = this.updateuserForm.get(formControlName).value.trim();
  if (this.updateuserForm.get(formControlName).status == "VALID") return;
 // this.isFormSubmitted = true;

  if (this.updateuserForm.get(formControlName).touched && val.length == 0) {
    return displayName + " cannot be empty";
  }
  if (
    !this.updateuserForm.get(formControlName).pristine &&
    this.updateuserForm.get(formControlName).invalid
  )
    return "Entered " + displayName + " is invalid";
  //  this.isFormSubmitted = false;
}



  onSubmituserForm(event){

  }

  updatecloseForm() {
    
    this.isShowAddsection = false;
    this.isShowAddbtn = true;
    this.isShowUpdateAddsection = false;

  }




  isAddressValid(state){

    
    if(state == 'update'){

      if(this.updateuserForm.valid){
        this.dataLoaded = true;

        if(this.updateuserForm.controls.editaddress.value.trim()!='' && this.updateuserForm.controls.editaddress.value.trim()!= '' && this.updateuserForm.controls.editzipCode.value.trim()!=''){


          let addressDetails = '<AddressValidateRequest USERID="325HUSHT1273">'+
          '<Revision>1</Revision>'+
          '<Address ID="0">'+
          '<Address1>'+ this.updateuserForm.controls.editaddress.value + '</Address1>'+
          '<Address2>'+ this.updateuserForm.controls.editaddressline.value + '</Address2>'+
          '<City/>'+
          '<State>'+ this.updateuserForm.controls.editstate.value  + '</State>'+
          '<Zip5>'+  this.updateuserForm.controls.editzipCode.value + '</Zip5>'+
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
         this.errorString = 'Address Not Found.';

         this.authService.updateErrorMessage(this.errorString);

      
          for (const key of Object.keys(this.updateuserForm.controls)) {
            if (this.updateuserForm.controls[key].invalid) {
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
              this.updateuserForm.controls['editaddressline'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1[0]);
            }
      
            this.updateuserForm.controls['editaddress'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS2[0]);
            this.updateuserForm.controls['editzipCode'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ZIP5[0]);
            this.updateuserForm.controls['editcity'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].CITY[0]);
            this.updateuserForm.controls['editstate'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].STATE[0]);
      
          });
      
            this.updateUserDetails();
          //console.log('else',err.error.text.includes('Error'));
      
        }
      });

        }else{

          this.updateUserDetails();
        }

     }else{

      this.isupdatedFormSubmitted = true;

      for (const key of Object.keys(this.updateuserForm.controls)) {
        if (this.updateuserForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
       }
      }

      if(this.updateuserForm.controls.editemail.value.trim() != ''){
        if(this.updateuserForm.controls.editemail.status == "INVALID"){
          this.isupdateemailId = true;
        }else{
          this.isupdateemailId = false;
        }
      }else{

        this.isupdateemailId        = false;

      }
      if(this.updateuserForm.controls.editemailtotext.value.trim() != ''){
        if(this.updateuserForm.controls.editemailtotext.status == "INVALID"){
          this.isupdateemailtotextId = true;
        }else{
          this.isupdateemailtotextId = false;
        }
      }else{

        this.isupdateemailtotextId        = false;

      
      }


     }

      

      
    } else {
    
       // this.saveSubscriptionForm();

       if(this.userForm.valid){

      this.dataLoaded = true;
     
      if(this.userForm.controls.address.value.trim()!='' &&  this.userForm.controls.zipCode.value.trim()!=''){


        let addressDetails = '<AddressValidateRequest USERID="325HUSHT1273">'+
        '<Revision>1</Revision>'+
        '<Address ID="0">'+
        '<Address1>'+ this.userForm.controls.address.value + '</Address1>'+
        '<Address2>'+ this.userForm.controls.addressline.value + '</Address2>'+
        '<City/>'+
        '<State>'+ this.userForm.controls.state.value  + '</State>'+
        '<Zip5>'+  this.userForm.controls.zipCode.value + '</Zip5>'+
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
        this.errorString = 'Address Not Found.';

        this.authService.updateErrorMessage(this.errorString);

    
        for (const key of Object.keys(this.userForm.controls)) {
          if (this.userForm.controls[key].invalid) {
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
            this.userForm.controls['addressline'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1[0]);
          }
    
          this.userForm.controls['address'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS2[0]);
          this.userForm.controls['zipCode'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ZIP5[0]);
          this.userForm.controls['city'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].CITY[0]);
          this.userForm.controls['state'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].STATE[0]);
    
        });
    
    
        //console.log('else',err.error.text.includes('Error'));
        this.saveUserDetails();
    
      }
    });
  

      }else{

        this.saveUserDetails();
      }
    
       }else{

        this.isFormSubmitted = true;


        for (const key of Object.keys(this.userForm.controls)) {
          if (this.userForm.controls[key].invalid) {
            const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
            invalidControl.focus();
            break;
         }
        }

        if(this.userForm.controls.email.value.trim() != ''){
          if(this.userForm.controls.email.status == "INVALID"){
            this.isemailId = true;
            this.isFormSubmitted = true;
  
          }else{
            this.isemailId = false;
          }
        }
        if(this.userForm.controls.emailtotext.value.trim() != ''){
          if(this.userForm.controls.emailtotext.status == "INVALID"){
            this.isemailtotextId = true;
            this.isFormSubmitted = true;
  
          }else{
            this.isemailtotextId = false;
          }
        }



       }


    
    }

   

  }  

  updateUser(userdata){

    //console.log('userdata for populate for upate form', userdata);
//console.log("userList",this.userList);
    this.isShowUpdateAddsection = true;
    this.isShowAddsection = false;
    this.isShowAddbtn = false;
    this.userIdForUpdate=userdata['sortKey'];
     this.updateUserId =  userdata['sortKey'].split('#')[1];

    this.editformObject = {

      'editusergroup': [[], Validators.required],
      'edituserName': ['', Validators.required],
      'editemail': ['' ],
      'editemailtotext':['', [Validators.email]],
      'editphoneno': ['', [ Validators.required, Validators.minLength(14) ,Validators.maxLength(17) ]],
      'editdutUser': ['' , Validators.required],
      'editalertLevel': ['', Validators.required],
      'editaddress': [''],
      'editaddressline': [''],
      'editzipCode': [''],
      'editcity': [''],
      'editstate': [''],
      'editcountry': ['United States Of America']

    };
    
    this.updateuserForm = this.fb.group(this.editformObject);
    let existingusergroups =  this.usergroupList.filter((group)=>{
      return userdata.userGroups.includes(group.sortKey);
    })
    
   if(!existingusergroups)
   existingusergroups=[];
    
    var data = {

      'editusergroup': existingusergroups,
      'edituserName': userdata.name,
      'editemail':  userdata.email,
      'editemailtotext':userdata.emailtotext,
      'editphoneno': userdata.phone,
      'editdutUser': userdata.dutUser.toString(),
      'editalertLevel': userdata.alertLevel,
      'editaddress': userdata.address.line1,
      'editaddressline': userdata.address.line2,
      'editzipCode': userdata.address.zipCode,
      'editcity': userdata.address.city,
      'editstate':  userdata.address.state,
      'editcountry':  userdata.address.country
  
    } 

    //console.log('user seleected',data);
    this.updateuserForm.patchValue(data);
  }


  updateUserDetails(){
    //console.log(this.updateuserForm.controls)
    this.isupdatedFormSubmitted = false;
    let users= [this.userIdForUpdate];

    if(this.updateuserForm.controls.editphoneno.status === "INVALID"){
     
      this.isupdatedFormSubmitted = true;

    }


    if(this.updateuserForm.valid){
      let editedusergroups = [];
      let editedusergroupsForUpdateUsers = this.updateuserForm.controls.editusergroup.value;
       this.updateuserForm.controls.editusergroup.value.forEach(element => {
        editedusergroups.push(element.sortKey);
       });

       if(this.updateuserForm.controls.editdutUser.value=="true"){
        this.dutUser = true;
       }else{
        this.dutUser = false;

       }
      
      const editeduserData = {
        "address": {
          "city": this.updateuserForm.controls.editcity.value.trim(),
          "country": this.updateuserForm.controls.editcountry.value.trim(),
          "line1": this.updateuserForm.controls.editaddress.value.trim(),
          "line2": this.updateuserForm.controls.editaddressline.value.trim(),
          "state": this.updateuserForm.controls.editstate.value.trim(),
          "zipCode": this.updateuserForm.controls.editzipCode.value.trim(),
        },
        "alertLevel": this.updateuserForm.controls.editalertLevel.value,
        "dutUser": this.dutUser,
        "name": this.updateuserForm.controls.edituserName.value.trim(),
        "phone": this.updateuserForm.controls.editphoneno.value.trim(),
        "photo": this.userImage,
        "userGroups": editedusergroups,
        "emailtotext": this.updateuserForm.controls.editemailtotext.value,
      }
  
       this.dataLoaded = true;
      //console.log('userData', editeduserData);
      this.clientsService.updateUser(editeduserData , this.clientId , this.updateUserId).subscribe((response)=> {
        //console.log('Updated User',response);
       
      //  this.dataLoaded = true;
        this.updatecloseForm();
        //console.log('clientId:',  response['primaryKey'].split('#')[1]);
        //console.log('user', response['sortKey'] );
        //console.log('user Id', this.user_id );
        this.usergroupUpdateUser(response['sortKey'], this.clientId,editedusergroups);
       },(httpError:HttpErrorResponse)=>{
         this.dataLoaded = false;
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
        //this.showAlert(err.error.message,'error',"Failed to save");
      })
    }else{
     
      this.isupdatedFormSubmitted = true;

      for (const key of Object.keys(this.updateuserForm.controls)) {
        if (this.updateuserForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
       }
      }

      if(this.updateuserForm.controls.editemail.value.trim() != ''){
        if(this.updateuserForm.controls.editemail.status == "INVALID"){
          this.isupdateemailId = true;
        }else{
          this.isupdateemailId = false;
        }
      }else{

        this.isupdateemailId        = false;

      
      }
      if(this.updateuserForm.controls.editemailtotext.value.trim() != ''){
        if(this.updateuserForm.controls.editemailtotext.status == "INVALID"){
          this.isupdateemailtotextId = true;
        }else{
          this.isupdateemailtotextId = false;
        }
      }else{

        this.isupdateemailtotextId        = false;

      
      }
      

    }

   

  }

  saveUserDetails() {

    if(this.userForm.controls.phoneno.status === "INVALID"){
      this.isFormSubmitted = true;
    }


    if(this.userForm.valid){

       this.isFormSubmitted = false;
       let usergroups = [];

       if(this.userForm.controls.dutUser.value == 'true'){

        this.dutUser = true;
       }else{

        this.dutUser = false;

       }
     //  this.dutUser = this.userForm.controls.dutUser.value.toString();

       let usergroupsForUpdate = this.userForm.controls.usergroup.value;
       this.userForm.controls.usergroup.value.forEach(element => {
        usergroups.push(element.sortKey);
        
       });

       if(this.userForm.controls.emailtotext.value.trim()){

        this.userForm.controls.emailtotext.value.trim()
       }else{

        this.userForm.controls.emailtotext.value.trim()
       }
      const userData = {
        "address": {
          "city": this.userForm.controls.city.value.trim(),
          "country": this.userForm.controls.country.value.trim(),
          "line1": this.userForm.controls.address.value.trim(),
          "line2": this.userForm.controls.addressline.value.trim(),
          "state": this.userForm.controls.state.value.trim(),
          "zipCode": this.userForm.controls.zipCode.value.trim(),
        },
        "alertLevel": this.userForm.controls.alertLevel.value,
        "dutUser":   this.dutUser,
        "email": this.userForm.controls.email.value.trim(),
        "emailtotext": this.userForm.controls.emailtotext.value.trim(),
        
        "name": this.userForm.controls.userName.value.trim(),
        "phone": this.userForm.controls.phoneno.value.trim(),
        "photo": this.userImage,
        "userGroups": usergroups,
      }
  
       this.dataLoaded = true;
       //console.log('userData', userData);
      this.clientsService.createUser(userData , this.clientId).subscribe((response)=> {
        //console.log(response);
        this.isShowAddsection = false;
        this.isShowAddbtn = true;
       
       // this.dataLoaded = false;
        //console.log('clientId:',  response['primaryKey'].split('#')[1]);
        //console.log('user', response['sortKey'] );
        //console.log('user Id', this.user_id );
        this.usergroupUpdateUser(response['sortKey'], this.clientId,usergroups);
       },(httpError:HttpErrorResponse)=>{
        this.dataLoaded = false;
       // this.errorString = err.error.message;
       this.authService.updateErrorMessage(httpError['error']['message']);
        //this.showAlert(err.error.message,'error',"Failed to save");
      })
    }
    else{

      if(this.userForm.controls.email.value.trim() != ''){
        if(this.userForm.controls.email.status == "INVALID"){
          this.isemailId = true;
          this.isFormSubmitted = true;

        }else{
          this.isemailId = false;
        }
      }
      if(this.userForm.controls.emailtotext.value.trim() != ''){
        if(this.userForm.controls.emailtotext.status == "INVALID"){
          this.isemailtotextId = true;
          this.isFormSubmitted = true;

        }else{
          this.isemailtotextId = false;
        }
      }
      
      for (const key of Object.keys(this.userForm.controls)) {
        if (this.userForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
       }
      }

      this.isFormSubmitted = true;


    }
  }

  showAlert(alertMsg='',alertType='success',alertTitle='') {
    const dialogRef = this.dialog.open(AlertComponent,{data:{
      alertMsg:alertMsg,
      alertType:alertType,
      alertTitle:alertTitle
    },panelClass:'modal-alert',disableClose: true,});

    dialogRef.afterClosed().subscribe(result => {
     // this.inProcess = false;
     this.getAllUsesByClient();
     this.dataLoaded = false;
    //  this.updatecloseForm();
    });
  }

  usergroupUpdateUser(userId, clientId,usergroups){

    var itemsProcessed = 0;
    this.usergroupList.forEach((usergroup)=>{
      let userGroupIdforUpdate = usergroup.sortKey.split('#')[1];
      let usergroupList = usergroup.userList;
      let groupExists= usergroups.includes(usergroup.sortKey);
      if(groupExists){
        let userExixts = usergroupList.includes(userId);
        if(!userExixts){
          usergroupList.push(userId);
          let updatedusergroupList=usergroupList;
          const usersListToupdate ={
            "userList" : updatedusergroupList
          }
          this.clientsService.updateGroupUsers(userGroupIdforUpdate,usersListToupdate,clientId).subscribe((res:any)=>{
            itemsProcessed++;
            if(itemsProcessed === this.usergroupList.length) {
              this.getAllUsesByClient();
            }
           
          },(httpError:HttpErrorResponse)=>{
            //this.errorString = err.error.message;
            this.authService.updateErrorMessage(httpError['error']['message']);
            ////console.log("err",err);
          })
        }else{
          itemsProcessed++;
          if(itemsProcessed === this.usergroupList.length) {
            this.getAllUsesByClient();
          }
        }
      }else{
        let updatedusergroupList=usergroupList.filter((user)=>{
          return user!=userId;
        })
        const usersListToupdate ={
          "userList" : updatedusergroupList
        }
        this.clientsService.updateGroupUsers(userGroupIdforUpdate,usersListToupdate,clientId).subscribe((res:any)=>{
          itemsProcessed++;
          if(itemsProcessed === this.usergroupList.length) {
            this.getAllUsesByClient();
          }
        },(httpError:HttpErrorResponse)=>{
          //this.errorString = err.error.message;
          this.authService.updateErrorMessage(httpError['error']['message']);
          ////console.log("err",err);
        })
      }
    })
    //this.getAllUsesByClient();
  }

  selectedUserGroup(data){

    let usergroupselected= this.userForm.controls.usergroup.value;
  
    this.group_id = usergroupselected.split('#')[1];

  }

}
