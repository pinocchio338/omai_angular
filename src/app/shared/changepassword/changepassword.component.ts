import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ChangepasswordService } from '../changepassword/changepassword.service';
import { AuthService } from 'src/app/auth.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from 'src/app/login/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnInit {
  frmChangePwd: UntypedFormGroup;
  PwdEye:string='password';
  confrimPwdEye:string='password';
  frmChangePwdFormSubmitted:boolean = false;
  loggedInUserId:any=null;
  dataLoaded:boolean=true;
  pwdChangedSuccess='';
  constructor(
    private router: Router,
    private loginService:LoginService, private _authService:AuthService, private fb: UntypedFormBuilder,private _changePwdService:ChangepasswordService,@Inject(MAT_DIALOG_DATA) public data:any,public cngPwdDialogRef: MatDialogRef<ChangepasswordComponent>) { 
    this.frmChangePwd = this.fb.group({
      oldpassword: ['', Validators.compose([Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/)])],
      password: ['', Validators.compose([Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/)])],
      confirmPwd: ['', Validators.compose([Validators.required,Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/)])], 
    })
  }
  get oldpassword(){
    return this.frmChangePwd.controls.oldpassword;
  }
  get password(){
    return this.frmChangePwd.controls.password;
  }
  get confirmPwd(){
    return this.frmChangePwd.controls.confirmPwd;
  }
  showHidePwd(hideshowFor){
    if(hideshowFor=='PwdEye'){
      this.PwdEye =  this.PwdEye=='password'?'text':'password'; 
    }else if(hideshowFor=='confrimPwdEye'){
      this.confrimPwdEye =  this.confrimPwdEye=='password'?'text':'password';
    }
  }
  checkPassword(inputtxt){ 
    var decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
    if(inputtxt.value.match(decimal)) { 
    return true;
    }
    else{ 
    return false;
    }
  } 
  ngOnInit(): void {
    this.loggedInUserId =  this.data.userId;
  }
  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }
  changePwd(){
    this.frmChangePwdFormSubmitted = true;
    if(this.frmChangePwd.invalid || !this.loggedInUserId ||  this.password.value!=this.confirmPwd.value){
      return false;
    }
    this.dataLoaded=false;
    const cPwdData={'oldPassword':this.oldpassword.value,'password':this.password.value};
    this._changePwdService.changePwdCall(cPwdData,this.loggedInUserId).subscribe((res:any)=>{
      this.frmChangePwd.reset();
      this.frmChangePwdFormSubmitted = false;
      this.pwdChangedSuccess='Your Password Has Been Changed Successfully.';
      this.dataLoaded=true;
      setTimeout(() => {
        this.cngPwdDialogRef.close();
        this.logout();
      }, 3000);
      
      
    },(httpError:HttpErrorResponse)=>{
      this._authService.updateErrorMessage(httpError['error']['message']);
      this.dataLoaded=true;
    })
  }
}
