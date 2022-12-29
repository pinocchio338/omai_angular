import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { AuthService } from '../auth.service' 

@Injectable({
  providedIn: 'root'
})
export class ClientgroupsService {

  constructor(private httpClient: HttpClient,
    private authService:AuthService) {
      this.headers = new HttpHeaders()
    }
    private headers:HttpHeaders;

  updateGroupUsers(usergroup:any,users:any,clientId){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.post(environment.apiUrl+'api/v1/client/'+clientId+'/usergroup/'+usergroup+'/users',users,{headers: this.headers}); 
  }
  deleteGroup(groupfordelete:any,clientId){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    //console.log("groupfordelete",groupfordelete);
    return this.httpClient.delete(environment.apiUrl+'api/v1/client/'+clientId+'/usergroup/'+groupfordelete,{headers: this.headers}); 
  }
  addNewGroup(usergroup:any,clientId){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.post(environment.apiUrl+'api/v1/client/'+clientId+'/usergroup',usergroup,{headers: this.headers}); 
  }
  updateGroupPermissions(usergroupPermissions:any,clientId,groupId){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.post(environment.apiUrl+'api/v1/client/'+clientId+'/usergroup/'+groupId+'/permissions',{'permissions':usergroupPermissions},{headers: this.headers}); 
  }
  updateGroupName(usergroupName:any,clientId,groupId){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.put(environment.apiUrl+'api/v1/client/'+clientId+'/usergroup/'+groupId,{'display_name':usergroupName},{headers: this.headers}); 
  }

}
