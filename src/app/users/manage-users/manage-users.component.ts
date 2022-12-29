import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClientsService } from './../../clients/clients.service'
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewuserComponent } from '../newuser/newuser.component';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { UseruploadComponent } from 'src/app/shared/userupload/userupload.component';
import { AuthService } from '../../auth.service';
import * as xml2js from 'xml2js';
import { HttpErrorResponse } from '@angular/common/http';
import { ImagecropperComponent } from 'src/app/shared/imagecropper/imagecropper.component';




@Component({
  selector: 'app-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  @ViewChild("userImage") userImage: ElementRef;

  selectedClientId: string = null;
  isFormSubmitted = false;
  clientInfo: any = null;
  selectedClientSites: any[];
  selectedClientUsers: any[];
  UserList: any[];
  allUserList: any[];
  isShowUserInfo = false;
  userDetailInfo: any;
  selectedClientIndex: number = 0
  selectedSiteIndex: number = 0;
  isClientActive: boolean = true;
  dataLoaded: boolean = false;
  isSearchActive: boolean = false;
  user_id: any;
  client_id: any;
  selectedUserName: any;
  selectedUserEmail: any;
  selectedEmailToText:any;
  selectedUserPhone: any;
  selectedUserPhoto: any;
  city: any;
  state: any;
  country: 'United States Of America';
  line1: any;
  line2: any;
  zipcode: any;
  file: File;
  imageUrl: string | ArrayBuffer = '';
  fileName: string = "No file selected";
  allUserGroups: Array<any> = [];
  isvalidStatus: boolean = false;
  userForm: UntypedFormGroup;
  formObject: any;
  userRole: string;
  selectedUser:any=null;
  errorString="";
  addressJsonRes: any;
  selectedUserSites:Array<any>=[];
  userPhotoBeforeEdit:any='';
  @ViewChild('csvReader') csvReader: any; 
  constructor(private fb: UntypedFormBuilder, private authService: AuthService, public dialog: MatDialog, private userService: UserService, private clientService: ClientsService, private router: Router, private route: ActivatedRoute) { }


  siteFields = {
    'name': { fieldName: 'name', mode: 'view', oldValue: null },
    'customSiteId': { fieldName: 'customSiteId', mode: 'view', oldValue: null },
    'address': { fieldName: 'address', mode: 'view', oldValue: null },
    'dropboxLink': { fieldName: 'dropboxLink', mode: 'view', oldValue: null }
  }

  getGroupDetails(groupId) {
    return this.allUserGroups.find(group => group.sortKey == groupId);
  }

  userFields = {
    // 'email': "user2@gmail.com"
    'name': { fieldName: 'name', mode: 'view', oldValue: null },
    'emailtotext': { fieldName: 'name', mode: 'view', oldValue: null },
    'phone': { fieldName: 'phone', mode: 'view', oldValue: null },
    'address': { fieldName: 'address', mode: 'view', oldValue: null },
    'photo': { fieldName: 'photo', mode: 'view', oldValue: null },


    //  'phone': "147852369"
  }
  emailValidator(control) {
    if (control.value) {
      const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      return matches ? null : { 'invalidEmail': true };
    } else {
      return null;
    }
  }
  newObject() {


    this.formObject = {

      'selectedUserPhone': ['', [Validators.required, Validators.minLength(10), Validators.maxLength(17)]],
      'selectedEmailToText':['', Validators.compose([this.emailValidator,Validators.maxLength(100)])]
    };
    this.userForm = this.fb.group(this.formObject);
  }


  get f() { return this.userForm.controls; }


  inlineFieldChangeMode(fieldName: string, mode: string, data: any) {
    if (mode == 'edit') {
      if (fieldName == 'photo') {
        this.userFields[fieldName]['oldValue'] = data.photo
        //this.selectedUserPhoto = data.photo;
        this.userFields[fieldName]['mode'] = mode
      }
      if (fieldName == 'name') {
        this.isvalidStatus = true;
        this.userFields[fieldName]['oldValue'] = data.name
        this.selectedUserName = data.name;
        this.userFields[fieldName]['mode'] = mode
      }
      if (fieldName == 'emailtotext') {
        const emToText = {
          'selectedEmailToText': data.emailtotext,
        }
        //console.log('user seleected', emToText);
        this.userForm.patchValue(emToText);
        this.userFields[fieldName]['mode'] = mode;
        // this.isvalidStatus = true;
        // this.userFields[fieldName]['oldValue'] = data.emailtotext
        // this.selectedEmailToText = data.emailtotext;
        // this.userFields[fieldName]['mode'] = mode
      }
      if (fieldName == 'phone') {


        const phoneNo = {
          'selectedUserPhone': data.phone,
        }

        //console.log('user seleected', phoneNo);
        this.userForm.patchValue(phoneNo);

        // this.userForm.controls.selectedUserPhone.value = data.phone;
        // this.selectedUserPhone = data.phone;
        this.userFields[fieldName]['mode'] = mode
      }
      if (fieldName == 'address') {
        this.city = data.address.city;
        this.state = data.address.state;
        this.country = data.address.country;
        this.line1 = data.address.line1;
        this.line2 = data.address.line2;
        this.zipcode = data.address.zipCode

        this.userFields[fieldName]['mode'] = mode
      }

    }

  }

  inlineFieldUpdate(fieldName: string, data: any) {
    let name = this.userFields[fieldName]['fieldName']


    //console.log('updated field value Name of USer', this.selectedUserName);
    //console.log('previous user deatils:', data);
    this.user_id = data['sortKey'].split('#')[1];
    this.client_id = data['primaryKey'].split('#')[1];

    if (fieldName == 'photo') {
      this.dataLoaded = false;
      const updatedUserInfo = {
        'photo': this.selectedUserPhoto,
        'name': data.name,
        'emailtotext': data.emailtotext,
        'phone': data.phone,
        'alertLevel': data.alertLevel,
        'address': data.address,
        'dutUser': data.dutUser
      }
      this.selectedUserPhoto = null;
      this.userImage.nativeElement.value = '';
      this.userService.userUpdate(this.client_id, this.user_id, updatedUserInfo).subscribe(response => {
        this.userFields[fieldName]['mode'] = 'view';
        let userInfo = this.authService.getUserInfo();
        if(userInfo['userId'] == response['sortKey']){
          userInfo['email'] = response['email'];
          userInfo['name'] = response['name'];
          userInfo['photo'] = response['photo'];
          userInfo['phone'] = response['phone'];
          this.authService.setUserInfo(userInfo);
        }
        this.getUsers(data);
      },(httpError:HttpErrorResponse)=>{
        this.dataLoaded = true;
       // this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })
    }
    if (fieldName == 'name') {
      this.dataLoaded = false;
      const updatedUserInfo = {
        'name': this.selectedUserName,
        'emailtotext': data.emailtotext,
        'phone': data.phone,
        'alertLevel': data.alertLevel,
        'address': data.address,
        'dutUser': data.dutUser
      }

      this.userService.userUpdate(this.client_id, this.user_id, updatedUserInfo).subscribe(response => {
        this.userFields[fieldName]['mode'] = 'view';
        this.getUsers(data);
        let userInfo = this.authService.getUserInfo();
        if(userInfo['userId'] == response['sortKey']){
          userInfo['email'] = response['email'];
          userInfo['name'] = response['name'];
          userInfo['photo'] = response['photo'];
          userInfo['phone'] = response['phone'];
          this.authService.setUserInfo(userInfo);
        }
       // this.selectClient(this.selectedClientIndex, data);
      },(httpError:HttpErrorResponse)=>{
        this.dataLoaded = true;
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })
    }
    if (fieldName == 'emailtotext') {
     
      if (this.userForm.controls.selectedEmailToText.status === "INVALID") {

        this.isFormSubmitted = true;
      } else {
        this.dataLoaded = false;
        const updatedUserInfo = {
          'name': data.name,
          'emailtotext':this.userForm.controls.selectedEmailToText.value,
          'phone': data.phone,
          'alertLevel': data.alertLevel,
          'address': data.address,
          'dutUser': data.dutUser
        }

        this.userService.userUpdate(this.client_id, this.user_id, updatedUserInfo).subscribe(response => {
          this.userFields[fieldName]['mode'] = 'view';
          this.getUsers(data);
          let userInfo = this.authService.getUserInfo();
          if(userInfo['userId'] == response['sortKey']){
            userInfo['email'] = response['email'];
            userInfo['name'] = response['name'];
            userInfo['photo'] = response['photo'];
            userInfo['phone'] = response['phone'];
            this.authService.setUserInfo(userInfo);
          }
        // this.selectClient(this.selectedClientIndex, data);
        },(httpError:HttpErrorResponse)=>{
          this.dataLoaded = true;
          //this.errorString = err.error.message;
          this.authService.updateErrorMessage(httpError['error']['message']);
        })
      }
    }
    if (fieldName == 'phone') {


      //console.log('phone length', this.userForm.controls.selectedUserPhone.value.length);

      if (this.userForm.controls.selectedUserPhone.status === "INVALID") {

        this.isFormSubmitted = true;
      } else {

        this.dataLoaded = false;
        const updatedUserData = {
          'name': data.name,
          'emailtotext': data.emailtotext,
          'phone': this.userForm.controls.selectedUserPhone.value,
          'alertLevel': data.alertLevel,
          'address': data.address,
          'dutUser': data.dutUser
        }
        this.userService.userUpdate(this.client_id, this.user_id, updatedUserData).subscribe(response => {
          this.userFields[fieldName]['mode'] = 'view';
          this.getUsers(data);
          let userInfo = this.authService.getUserInfo();
          if(userInfo['userId'] == response['sortKey']){
            userInfo['email'] = response['email'];
            userInfo['name'] = response['name'];
            userInfo['photo'] = response['photo'];
            userInfo['phone'] = response['phone'];
            this.authService.setUserInfo(userInfo);
          }
        },(httpError:HttpErrorResponse)=>{
          this.dataLoaded = true;
          //this.errorString = err.error.message;
          this.authService.updateErrorMessage(httpError['error']['message']);
        })


      }



    }




    if (fieldName == 'address') {
      this.dataLoaded = false;
      const address = {
        "city": this.city,
        "country": this.country,
        "line1": this.line1,
        "line2": this.line2,
        "state": this.state,
        "zipCode": this.zipcode,
      }
      const updatedUserAddressData = {
        'name': data.name,
        'emailtotext': data.emailtotext,
        'phone': this.selectedUserPhone,
        'alertLevel': data.alertLevel,
        'address': address,
        'dutUser': data.dutUser
      }
      this.userService.userUpdate(this.client_id, this.user_id, updatedUserAddressData).subscribe(response => {
        this.userFields[fieldName]['mode'] = 'view';
        this.getUsers(data);
        let userInfo = this.authService.getUserInfo();
        if(userInfo['userId'] == response['sortKey']){
          userInfo['email'] = response['email'];
          userInfo['name'] = response['name'];
          userInfo['photo'] = response['photo'];
          userInfo['phone'] = response['phone'];
          this.authService.setUserInfo(userInfo);
        }
      },(httpError:HttpErrorResponse)=>{
        this.dataLoaded = true;
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })

    }



  }


  isAddressValid(data: any){


    this.dataLoaded = false;
    //console.log('data-----', data);
    if(this.line1.trim()!='' &&  this.zipcode.trim()!=''){


      let addressDetails = '<AddressValidateRequest USERID="325HUSHT1273">'+
    '<Revision>1</Revision>'+
    '<Address ID="0">'+
    '<Address1>'+ this.line1  + '</Address1>'+
    '<Address2>'+ this.line2 + '</Address2>'+
    '<City/>'+
    '<State>'+ this.state  + '</State>'+
    '<Zip5>'+  this.zipcode + '</Zip5>'+
    '<Zip4/>'+
    '</Address>'+
    '</AddressValidateRequest>';

    //console.log('addressDetails', addressDetails);
    this.clientService.verifyAddress(addressDetails).subscribe((response) => {
      //console.log('address validation  Response:', response);

    },(err:any)=>{

  this.dataLoaded = true;
  if(err.error.text.includes('Error')){

    //console.log('if',err.error.text.includes('Error'));
    ////console.log(err.error.text.getElementsByTagName('Description')[0]);
   // var x = xmlDoc.getElementsByTagName("title")[0];

    // this.errorString = 'Address Not Found.';
    this.authService.updateErrorMessage(this.errorString);
    // for (const key of Object.keys(this.subscriptionForm.controls)) {
    //   if (this.subscriptionForm.controls[key].invalid) {
    //     const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
    //     invalidControl.focus();
    //     break;
    //  }
    // }

  }else{

    const parser = new xml2js.Parser({ strict: false, trim: true });
    parser.parseString(err.error.text, (err, result) => {
      this.addressJsonRes = result;

      //console.log('verified address Response', this.addressJsonRes);
      //console.log('verified address Response', this.addressJsonRes);
      if(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1){
        this.line2 = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1[0];
     
      }

      this.line1 = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS2[0];
      this.zipcode = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ZIP5[0];
      this.city = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].CITY[0];
      this.state = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].STATE[0];

    });

    this.inlineFieldUpdate('address' ,data );
    //console.log('else',err.error.text.includes('Error'));

  }

});


    }else {


      this.inlineFieldUpdate('address' ,data );

    }

    
  }

  inlineFieldCancel(fieldName: string) {
    if(fieldName=='photo'){    
    this.userDetailInfo.photo= this.userPhotoBeforeEdit;
    }
    // this.selectedUserName =  this.userFields[fieldName]['oldValue'];
    this.userFields[fieldName]['mode'] = 'view'
  }

  uploadPhoto(event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      if(file.size / 1000000 >4){
        this.authService.updateErrorMessage('File size cannot exceed 4MB');
        return;
      }
      this.fileName = file.name;
      if(!this.fileName.split('.')[1].includes('png') && !this.fileName.split('.')[1].includes('jpg') && !this.fileName.split('.')[1].includes('jpeg')){
        this.authService.updateErrorMessage('Please upload a valid file');
        this.dataLoaded = true;
        return;
      }
      this.file = file;
     
      
      const dialogRef = this.dialog.open(ImagecropperComponent,{data:{
        file:event,
        ratio:1/1
       
      }
    ,width:'592px',maxHeight:'max-content', panelClass:'modal-user',disableClose: true,hasBackdrop:false});
    
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.imageUrl = result;
          this.selectedUserPhoto = result;
          this.userPhotoBeforeEdit = this.userDetailInfo.photo;
          this.userDetailInfo.photo= result;
        }else{
          event.target.value='';
        }
      });
     
     
      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onload = event => {
      //   this.imageUrl = reader.result;
      //   this.selectedUserPhoto = reader.result;
      // };

    }
  }
  changeImage() {
    this.userImage.nativeElement.click();
    //this.selectedUser['edit']['photo']=true
  }
  loadData() {
    this.dataLoaded = false;
    this.newObject();
    this.selectedClientId = this.route.snapshot.params.id;
    this.getSites();
    this.clientService.getClients().subscribe(data => {
      data['clients'].forEach(client => {
        if (client.sortKey == this.selectedClientId) {
          this.clientInfo = client;
          //console.log(this.clientInfo)

          this.getUsers();

        }
      });
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
     // this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  ngOnInit(): void {
    this.loadData();
    this.userRole = this.authService.getRole();
  }
  importUsersListener($event: any): void {  
      let files = $event.srcElement.files;  
      if(files && files.length>0){
        const dialogNewUserRef = this.dialog.open(UseruploadComponent, {
          data: {
            clientId: this.selectedClientId.split('#')[1],
            files:files
          },
          hasBackdrop: false
          , width: '592px', disableClose: true , panelClass: 'modal-user-upload'
        });
        dialogNewUserRef.afterClosed().subscribe(result => {
         if (result > 0) {
            this.loadData();
          }else{
            this.csvReader.nativeElement.value = ""; 
          }
        });
      }
    }  
    fileReset() {  
      this.csvReader.nativeElement.value = "";
    }  
  uploadUsers() {
    this.csvReader.nativeElement.click();
  }
  selectClient(index: number, data: any) {
    
    //console.log('index', index);
    //console.log('selectClient User data', data);
    this.userDetailInfo = data;
    if(data){
    this.selectedUser = data.sortKey;
    this.selectedClientIndex = index;
    this.isShowUserInfo = true;
    this.selectedUserSites = [];
    this.getUserSites(this.selectedUser);
    }
    
    //console.log('User data', this.userDetailInfo);
    // this.getSites();
    // this.getUsersindex();
  }

  // getSites(){
  //   const clientId = this.searchedClients[this.selectedClientIndex].primaryKey.split('#')[1];
  //   this.sitesService.getSites(clientId).subscribe((sitesData)=> {
  //     //console.log(sitesData)
  //     this.selectedClientSites = sitesData['sites'];
  //   })
  // }

  getPhoto(url: string) {
    return typeof (url) !== 'undefined' && url ? url : 'assets/sample-site-image.png';
  }

  getUsersindex() {
    const clientId = this.UserList[this.selectedClientIndex].primaryKey.split('#')[1];
    this.clientService.getUsers(clientId).subscribe((userData) => {
      //console.log(userData)
      this.selectedClientUsers = userData['userInfo'];
      this.processUsersData(this.selectedClientUsers);

      this.dataLoaded = true;
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  getUserSitesDataInfo(){
    let selectedUser_Sites = [];
    this.allUserGroups.forEach((agrp)=>{
      if(this.userDetailInfo.userGroups.includes(agrp.sortKey) && agrp.permissions.sitePermissions){
      selectedUser_Sites.push(...Object.keys(agrp.permissions.sitePermissions));
      }
    });
    return selectedUser_Sites;
  }
  getUserSites(user) {    
    let selectedUser_Sites = this.getUserSitesDataInfo();
    this.selectedUserSites =  this.selectedClientSites.filter((site) => {
      if (selectedUser_Sites.includes(site.sortKey)) {
        return site;
      }
    })

  }

  getSites() {

    const clientId = this.selectedClientId.split('#')[1];
    this.clientService.getSites(clientId).subscribe((sitesData) => {

      this.selectedClientSites = sitesData['sites'];

      // this.selectedClientSites.forEach(site => {
      // //  site['siteLayouts'] = JSON.parse(site['siteLayouts'])
      //   site['siteLayouts'] = site['siteLayouts']
      // //  site['emergencyContacts'] = JSON.parse(site['emergencyContacts'])
      // site['emergencyContacts'] = site['emergencyContacts']
      // })
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })

  }

  getUsers(selectedUser=null) {
    this.dataLoaded = false;
    const clientId = this.selectedClientId.split('#')[1];
    this.clientService.getUsers(clientId).subscribe((userData) => {

      this.selectedClientUsers = userData['userInfo'];
      this.processUsersData(this.selectedClientUsers,selectedUser);
      if (this.UserList.length == 0) {
        this.isShowUserInfo = false;
      }
      this.dataLoaded = true;
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
     // this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  checkValidation(data) {
    //console.log('enter Value ', data)
    this.isvalidStatus = true;
  }


  processUsersData(userData: any[],selectedUser=null) {
    let userGroups = userData['userGroups'];
    this.allUserGroups = userGroups;
    let users = userData['users'];
    this.UserList = userData['users'];
    this.allUserList = this.UserList;


    let processedUsers = {};
    users.forEach(user => {
      processedUsers[user.sortKey] = user;
    });
    userGroups.forEach(group => {
      /// group.userList = JSON.parse(group.userList);
      group.userList = group.userList;
    });
    userData['usersObject'] = processedUsers;
    if(!selectedUser){
    this.userDetailInfo = this.UserList[this.selectedClientIndex || 0];
    }else{
      this.userDetailInfo = this.UserList.find((user)=>{
        return user.sortKey == selectedUser.sortKey;
      })
    }
    if (this.userDetailInfo) {
      this.isShowUserInfo = true;
      this.selectClient(0,this.userDetailInfo);
      
    }


  }

  // addUser(){
  //   this.router.navigate(['users/add-user',this.selectedClientId]);
  // }

  getLayoutName(path) {
    if (path.trim().length == 0)
      return '';
    return decodeURIComponent(path.split('/').slice(-1)[0])
  }

  goBack() {
    this.router.navigate(['clients', 'view', this.selectedClientId]);
  }

  searchUser(searchString: string) {
    searchString = searchString.trim().toLowerCase();
    if (searchString.length == 0) {
      this.UserList = this.allUserList;
    
      return;
    }
    let searchedUsers = [];
    this.allUserList.forEach(user => {
      if (user.name.toLowerCase().includes(searchString))
        searchedUsers.push(user)
    });
    this.UserList = searchedUsers;
    if(this.UserList && this.UserList.length>0){
    this.selectClient(0,this.UserList[0]);
    }else{
      this.selectClient(0,null);
    }
  }

  suspenUser(userData) {


    this.dataLoaded = false;
    this.user_id = userData['sortKey'].split('#')[1];
    this.client_id = userData['primaryKey'].split('#')[1];
    this.userService.userSuspend(this.client_id, this.user_id).subscribe((userData) => {

      this.getSites();
      this.getUsers();
      this.dataLoaded = true;
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    });

  }


  activeUser(userData) {

    this.dataLoaded = false;

    this.user_id = userData['sortKey'].split('#')[1];
    this.client_id = userData['primaryKey'].split('#')[1];
    this.userService.userActivate(this.client_id, this.user_id).subscribe((userData) => {
      this.getSites();
      this.getUsers();
      this.dataLoaded = true;

    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    });

  }


  deleteUser(userData) {

    this.dataLoaded = false;
    this.user_id = userData['sortKey'].split('#')[1];
    this.client_id = userData['primaryKey'].split('#')[1];
    this.userService.userDelete(this.client_id, this.user_id).subscribe((userData) => {

      this.getSites();
      this.getUsers();
      this.dataLoaded = true;
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    });
  }

  addNewUser() {

    const dialogRef = this.dialog.open(NewuserComponent, {
      data: {
        clientId: this.selectedClientId.split('#')[1] //this.data.clientId
      },
      position: { top: '2%' }
      , width: '592px', maxHeight: 'max-content', panelClass: 'modal-user', 
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.getSites();
        this.getUsers();

        //  result['newUser']=true;
        //  this.allUsers.unshift(result);
        //  this.users = this.allUsers;
        //   let users = this._userService.getAllUsers(this.data.clientId).subscribe((res:any)=>{
        //     if(res && res.userInfo.users){
        //       this.allUsers = res.userInfo.users
        //       this.users = this.allUsers;
        //     }
        //   })
      }
    });
  }

  loginAs(userMail: string){
    // console.error(userMail)
    sessionStorage.setItem('impersonateAs',userMail);
    this.router.navigateByUrl('/login');
  }

}
