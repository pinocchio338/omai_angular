import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class ResetpasswordService {
  constructor(private http:HttpClient) { }
  resetPwd(resetPwdData){
   // let header = new HttpHeaders().set("Authorization", 'Bearer ' + this.authService.getAuthToken());
    return this.http.post(environment.apiUrl+'api/v1/resetpassword',resetPwdData);
  }
  resendOtp(data){
    return this.http.post(environment.apiUrl + '/api/v1/forgotpassword',data);
  }
  }
