import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service' 
@Injectable({
  providedIn: 'root'
})
export class WellsService {
  constructor(private http:HttpClient, private authService:AuthService) { 
    this.headers = new HttpHeaders()
  }
  private headers:HttpHeaders;

  getAllWells(clientId,siteId){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.get(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/wells',{headers: this.headers})
  }
  createNewWell(clientId,siteId,welldata){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.post(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/well',welldata,{headers: this.headers})
  }
  deleteWell(clientId,siteId,wellId){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.delete(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/well/'+wellId,{headers: this.headers})
  }
  updateWell(clientId,siteId,welldata){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.put(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/well',welldata,{headers: this.headers})
  }
}
