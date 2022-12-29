import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  constructor(private http:HttpClient,
    private authService:AuthService) { 
      this.headers = new HttpHeaders()
    }
  private headers:HttpHeaders;
  
  getShifts(clientId: string, siteId: string){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    // return this.http.get(environment.apiUrl+'/api/v1/client/80131/site/52141/shifts');
    return this.http.get(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/shifts',{headers: this.headers});
  }
  deleteShift(clientId: string, siteId: string,shiftId){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.delete(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/shift/'+shiftId,{headers: this.headers})
  }
  getAllShifts(){
    return localStorage.getItem('shifts');
  }
  addNewShift(shiftData,clientId: string, siteId: string){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    //console.log("addNewShift::shiftData",shiftData);
    return this.http.post(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/shift',(shiftData),{headers: this.headers})
  }
  editShift(editedShiftData,clientId: string, siteId: string,shiftId){
    //console.log("editedShiftData::shiftData",editedShiftData);
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.put(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/shift/'+shiftId,(editedShiftData),{headers: this.headers})
  }
}
