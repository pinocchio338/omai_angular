import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { AuthService } from '../auth.service'

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private http:HttpClient, private authService:AuthService) { }
  getAllAlerts(client,user,authToken){
    
    let header = new HttpHeaders().set("Authorization", 'Bearer ' + this.authService.getAuthToken());
    return this.http.get(environment.apiUrl+'api/v1/client/'+client+'/user/'+user+'/alerts',{'headers':header});
  }

  }
