import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../auth.service' 

@Injectable({
  providedIn: 'root'
})
export class RcaService {

  constructor(private http:HttpClient,
    private authService:AuthService) { 
      this.headers = new HttpHeaders()
    }
  
    private headers:HttpHeaders;
  saveRca(clientId,from,fromId,primaryKey,siteId,errorId,userId,rcaData){
      // clientId=54912;
      // from='dut',
      // siteId=16895;
      // fromId=32345;
      // errorId=54554;
      rcaData['primaryKey']=primaryKey;
      this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.post(environment.apiUrl+"api/v1/client/"+clientId+"/user/"+userId+"/error/"+errorId+"/rca",(rcaData),{headers: this.headers})
  }
}
