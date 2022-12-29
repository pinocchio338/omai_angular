import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service' 
@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {

  private headers:HttpHeaders;
  constructor(private http:HttpClient,
    private authService:AuthService) {
    this.headers = new HttpHeaders();
   this.headers =  this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
   }
  // getApplications(){
  //   return this.http.get(environment.apiUrl+'api/v1/client/80131/site/52141/applications'); 
  // }

  createApplication(clientId: string, siteId: string, applicationName: string){
   this.headers =  this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.post(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/application',{'name': applicationName},{headers: this.headers}); 
  }

  getApplicationSchema(clientId: string, siteId: string, applicationId: string){
   this.headers =  this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.get(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/application/'+applicationId+'/schema',{headers: this.headers});     
  }

  deleteApplication(clientId: string, siteId: string, applicationId: string){
   this.headers =  this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.delete(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/application/'+applicationId,{headers: this.headers}); 
  }

  getApplicationData(clientId: string, siteId: string, applicationId: string,start:number=0,end:number=100,filterKey:string='',filterValue:string=''){
   this.headers =  this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
   //api/v1/client/10954/site/35056/application/10008/data?filterKey=initial_temperature_of&filterValue=107.8&end=100&start=0
   if(filterKey && filterValue){
    return this.http.get(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/application/'+applicationId+'/data?filterKey='+filterKey+'&filterValue='+filterValue+'&start='+start+'&end='+end,{headers: this.headers});     
   }else{
    return this.http.get(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/application/'+applicationId+'/data?start='+start+'&end='+end,{headers: this.headers});     
   }
  }

  getApplications(clientId:string, siteId:string){
   this.headers =  this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    if(clientId ==' temp')
      return this.http.get(environment.apiUrl+'api/v1/client/80131/site/52141/applications',{headers: this.headers}); 
    return this,this.http.get(environment.apiUrl+"api/v1/client/"+clientId+"/site/"+siteId+"/applications",{headers: this.headers})
  }

  updateConfigSchemaOrData(clientId: string, siteId: string, applicationId: string, data: object, type: string){
   this.headers =  this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.put(environment.apiUrl+"api/v1/client/"+clientId+"/site/"+siteId+"/application/"+applicationId+"/"+type,data,{headers: this.headers})
  }
  getDataOnEmail(clientId,siteId,applicationId){
    this.headers =  this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this,this.http.get(environment.apiUrl+"api/v1/client/"+clientId+"/site/"+siteId+"/application/"+applicationId+"/data/download",{headers: this.headers})
  }
}
