import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../../auth.service';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../login.service'
import { HttpErrorResponse } from '@angular/common/http';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  role: string = "super-admin";
  dataLoaded: boolean = true;
  fgtPwderrorText:string='';
  fgtSuccessText="";
  errorString="";
  constructor(private router: Router, private loginService: LoginService ,private authService: AuthService,private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.authService.clearData();
    // this.authService.errorData.subscribe()
  }
  errorText:string = '';
  loginForm  = this.fb.group({
    email: ['', Validators.compose([Validators.required,Validators.minLength(5) ,Validators.maxLength(50)])],
    password: ['', Validators.compose([Validators.required,Validators.minLength(5), Validators.maxLength(15)])],    
  });
  forgotpassword(){
    this.errorText = "";
    this.fgtSuccessText="";
    if(!this.loginForm.controls.email.value){
      this.fgtPwderrorText = "Please Enter Valid Email";
      return false;
    }
    this.fgtPwderrorText = "";
    this.dataLoaded=false;
    let forgotpasswordData={'email':this.loginForm.controls.email.value};
    this.loginService.forGotPassword(forgotpasswordData).subscribe((res:any)=>{
    this.fgtSuccessText= "Your Password Reset Link Has Been Sent On Your Email";
    this.loginForm.reset();
      this.dataLoaded=true;
    },(httpError:HttpErrorResponse)=>{
     // this.fgtPwderrorText = err.error.message;
      // this.errorString = err.error.message;
      // this.authService.removeErrorMessage(this.errorString);
      this.dataLoaded=true;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
    
  }
  login(){
    //console.log(this.loginForm)
    if(this.loginForm.invalid){
      this.errorText = "Please Enter Valid Email and Password"
      // return;
    }
    else{
      this.dataLoaded = false;
      this.loginService.login(this.loginForm.value).subscribe(res => {
        let response  = res.body;

        this.authService.setAuthToken(res.headers.get('token'));
        if(response['permissions'] && response['permissions']['superAdmin']){
          this.authService.setRole('super-admin');
        }
        else if(response['permissions'] && response['permissions']['admin'] == true){
          this.authService.setRole('client-admin');
          this.authService.setPermissions(response['permissions']);
        }
        else{
          this.authService.setRole('client');
          this.authService.setPermissions(response['permissions'])
        }
        this.authService.setUserInfo(response['user'])
        //console.log(response['headers'])
        sessionStorage.removeItem('impersonateAs')
        this.router.navigateByUrl('/clients');
      }, (httpError:HttpErrorResponse) => { if(httpError['error']['message']){
       // this.errorText = httpError['error']['message'];
       this.dataLoaded = true;
       this.authService.updateErrorMessage(httpError['error']['message']);
        // this.authService.removeErrorMessage(this.errorString);
        // //console.log(this.errorString)
        //console.log(httpError['error']['message'])
      }
      else{
        this.authService.updateErrorMessage("Please Enter Valid Email and Password");
      }
      this.dataLoaded = true;
    })
      //console.log(this.role)
      // this.authService.setRole(this.role)
    }
  }
}
