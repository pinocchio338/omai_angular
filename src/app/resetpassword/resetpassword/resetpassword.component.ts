import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { ResetpasswordService } from '../resetpassword.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {
  dataLoaded: boolean = true;
  userSecret:any = null;
  userName:any = null;
  email:any=null;
  PwdEye:string='password';
  confrimPwdEye:string='password';
  resetPwdFormSubmitted:boolean = false;
  errorString="";
  showResentMsg:boolean =false;
  resendSuccessText="An OTP Has Been Sent On Your Email";
  constructor(private _resetPwdService:ResetpasswordService ,private fb: UntypedFormBuilder,private router:Router, private route: ActivatedRoute,private authService:AuthService) { }
  resetPwdForm  = this.fb.group({
    password: ['', Validators.compose([Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/)])],
    confirmPwd: ['', Validators.compose([Validators.required,Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/)])], 
    otp: ['', Validators.compose([Validators.required])]
       
  });
  ngOnInit(): void {

    this.userSecret = this.route.snapshot.queryParamMap.get("secret");
    this.userName = this.route.snapshot.queryParamMap.get("name");
    this.email = this.route.snapshot.queryParamMap.get("email");
    //console.log("this.userSecret",this.userSecret);
    if(!this.userSecret){
      this.router.navigate(['/login']);
    }
  }
  gotologin(){
    this.router.navigate(['/login']);
  }
  resendOtp(){
    // if(this.resetPwdForm.invalid || this.password.value!=this.confirmPwd.value){
    //   return false;
    // }
    let resendOtpData={'email':this.email,'resend':true};
    this.dataLoaded = false;
    this._resetPwdService.resendOtp(resendOtpData).subscribe((res:any)=>{
      this.dataLoaded = true;
      this.resendSuccessText= "An OTP Has Been Sent On Your Email";
      this.showResentMsg = true;
      setTimeout(() => {
        this.resendSuccessText="";
        this.showResentMsg = false;
      }, 5000);
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
     // this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  get password(){
    return this.resetPwdForm.controls.password;
  }
  get confirmPwd(){
    return this.resetPwdForm.controls.confirmPwd;
  }
  get otp(){
    return this.resetPwdForm.controls.otp;
  }
  showHidePwd(hideshowFor){
    if(hideshowFor=='PwdEye'){
      this.PwdEye =  this.PwdEye=='password'?'text':'password'; 
    }else if(hideshowFor=='confrimPwdEye'){
      this.confrimPwdEye =  this.confrimPwdEye=='password'?'text':'password';
    }
  }
  resetPwd(){
    this.resetPwdFormSubmitted = true;
    if(this.resetPwdForm.valid){
      this.dataLoaded = false;
      const resetPwdData={'secret':this.userSecret,'password':this.password.value,'otp':this.otp.value};
      this._resetPwdService.resetPwd(resetPwdData).subscribe((res:any)=>{
        this.dataLoaded = true;
        //console.log(res);
        this.router.navigate(['/login']);
      },(httpError:HttpErrorResponse)=>{
      
        this.dataLoaded = true;
       // this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })
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
}
