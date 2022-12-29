import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private authService: AuthService, private httpClient: HttpClient) { 
  }
  header: HttpHeaders;
  login(data: any){
    let imporsonationMail = sessionStorage.getItem('impersonateAs');
    if(imporsonationMail){
      this.header = new HttpHeaders().set('X-IMPERSONATE',imporsonationMail)
      return this.httpClient.post(environment.apiUrl + 'api/v1/login',data, {observe: 'response', headers: this.header})
    }
    return this.httpClient.post(environment.apiUrl + 'api/v1/login',data, {observe: 'response'})
  }
  forGotPassword(data){
    return this.httpClient.post(environment.apiUrl + 'api/v1/forgotpassword',data);
  }
  logout(){
    this.authService.clearData();
  }
}
