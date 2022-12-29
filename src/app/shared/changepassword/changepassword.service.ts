import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { environment } from '../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class ChangepasswordService {
  constructor(private http:HttpClient,private authService:AuthService) { }
  changePwdCall(chnagePwdData,user){
   let header = new HttpHeaders().set("Authorization", 'Bearer ' + this.authService.getAuthToken());
    return this.http.post(environment.apiUrl+'api/v1/user/'+user+'/resetpassword',chnagePwdData,{headers:header});
  }
  }
