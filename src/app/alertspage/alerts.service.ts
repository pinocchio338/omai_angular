import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service' 
@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private headers:HttpHeaders;
  constructor(private http:HttpClient,
    private authService:AuthService) {
    this.headers = new HttpHeaders();
   this.headers =  this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
   }
  
  getAllAlerts(client,user){
    debugger;
    //console.log("this.authService.getAuthToken()",this.authService.getAuthToken())
    this.headers =  this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.get(environment.apiUrl+'api/v1/client/'+client+'/user/'+user+'/alerts',{headers: this.headers});
  }
  readAlert(client,user,readData,alertKey){
    this.headers =  this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.patch(environment.apiUrl+'api/v1/client/'+client+'/user/'+user+'/alert/'+alertKey,readData,{headers: this.headers});
  }
}
