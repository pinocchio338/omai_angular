import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '../../user.service'
import { environment } from 'src/environments/environment';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { ImagecropperComponent } from 'src/app/shared/imagecropper/imagecropper.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  selectedClientId: string = null;
  dutUser: Object[] = [{'label':'Yes', 'value':true}, {'label':'No', 'value':false}];
  alertype: string[] = ['High', 'Medium','Low'];
  userForm: UntypedFormGroup;
  clients: any[] = [];
  siteList: Array<any> = [];
  selectedClientName: string = '';
  dataLoaded: boolean = false;
  file: File;
  imageUrl: string | ArrayBuffer = '';
  bgImageUrl = environment.imgUrl+'sample-site-image.png';
  fileName: string = "No file selected";
  inProcess:boolean = false;
  @ViewChild("userImage") userImage:ElementRef;
  errorString="";
  constructor(private router: Router,public alertDialog: MatDialog, private route: ActivatedRoute,private _userService:UserService, private fb: UntypedFormBuilder, private userService: UserService,private authService:AuthService) {
    this.selectedClientId =this.route.snapshot.params.id;

    this.userService.getAllClients().subscribe(data => {
      this.clients = data['clients'];
      this.clients.forEach(client => {
        if(client['primaryKey'] == this.selectedClientId){
          this.selectedClientName = client['name']
        }
      })
      this.dataLoaded = true;
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })


    this.userForm  = this.fb.group({
      userName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      email: ['', Validators.compose([Validators.required, this.emailValidator,Validators.maxLength(100)])],
      emailtotext: ['', Validators.compose([Validators.required, this.emailValidator,Validators.maxLength(100)])],
     
      
      phone: ['', Validators.compose([Validators.required, Validators.maxLength(17)])],
      addressLine1: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      addressLine2: ['', Validators.compose([ Validators.maxLength(100)])],
      city: ['', Validators.compose([Validators.required, Validators.maxLength(25)])],
      state: ['', Validators.compose([Validators.required, Validators.maxLength(25)])],
      zipCode: ['', Validators.compose([Validators.required, Validators.maxLength(5)])],
      dutUser: [false, Validators.compose([Validators.required])],
      alertLevel: ['Medium', Validators.compose([Validators.required])],
      country: ['United States Of America', Validators.compose([Validators.required])],
      photo: [null],
      siteAssociated:[]
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
     
    },panelClass:'modal-alert'});

    dialogRef.afterClosed().subscribe(result => {
      this.inProcess = false;
    });
    // if (file) {
    //   this.fileName = file.name;
    //   this.file = file;
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = event => {
    //     this.imageUrl = reader.result;
    //     this.userForm.patchValue({
    //       photo: reader.result
    //     });
    //   };
      
    //   this.photo.updateValueAndValidity()
    // }
  }
  changeImage(){
    this.userImage.nativeElement.click();
  }
   emailValidator(control) {
    if (control.value) {
      const matches = control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/);
      return matches ? null : { 'invalidEmail': true };
    } else {
      return null;
    }
  }
  get photo(){
    return this.userForm.controls.photo;
  }
   get city(){
    return this.userForm.controls.city;
   }
   get state(){
    return this.userForm.controls.state;
   }
   get zipCode(){
    return this.userForm.controls.zipCode;
   }
   get addressLine1(){
    return this.userForm.controls.addressLine1;
   }
   get userName(){
     return this.userForm.controls.userName;
   }
   get email(){
    return this.userForm.controls.email;
  }
  get emailtotext(){
    return this.userForm.controls.emailtotext;
  }
  get phone(){
    return this.userForm.controls.phone;
  }
get siteAssociated(){
  return this.userForm.controls.siteAssociated;
}
  ngOnInit(): void {
    //console.log("this.selectedClientId",this.selectedClientId.split('#')[1]);
    this._userService.getAllSites(this.selectedClientId.split('#')[1]).subscribe((res:any)=>{
      if(res && res.sites){
        this.siteList = res.sites;
      }
     },(httpError:HttpErrorResponse)=>{
       //this.errorString = err.error.message;
       this.authService.updateErrorMessage(httpError['error']['message']);
     })
  }

  submitForm(){
    if(this.userForm.status =='VALID'){
      let userFormData = this.userForm.value
      let userObject = {
        "address": {
          "city": userFormData['city'],
          "line1": userFormData['line1'],
          "line2": userFormData['line2'],
          "state": userFormData['state'],
          "country": userFormData['country'],
          "zipCode": userFormData['zipCode']
        },
        "alertLevel": userFormData['alertLevel'],
        "dutUser": userFormData['dutUser'],
        "email": userFormData['email'],
        "emailtotext":userFormData['emailtotext'],
        "name": userFormData['userName'],
        "phone": userFormData['phone'],
        "photo": userFormData['photo'],
        "siteAssociated":userFormData['siteAssociated']
      }
      //console.log(userObject)
      this.dataLoaded = false;
      this.userService.addNewUser(userObject,this.selectedClientId.split('#')[1]).subscribe(response => {
        this.dataLoaded = true;
        ////console.log("newuser response",response);
        this.goBack();
      },(httpError:HttpErrorResponse)=>{
        this.dataLoaded = true;
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
       // this.showAlert(err.error.message,'error',"Failed To Save");
      })
    }
    else{
      //console.log('invalid user data')
    }

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
  goBack(){
    this.router.navigate(['users',this.selectedClientId]);
  }

}
