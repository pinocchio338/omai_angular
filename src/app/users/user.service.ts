import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth.service' ;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:HttpClient,
    private authService:AuthService) { 
      this.headers = new HttpHeaders()
    }
    private headers:HttpHeaders;

  getAllUsers(client){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.get(environment.apiUrl+'api/v1/client/'+client+'/users',{headers: this.headers})
    //{{url}}/api/v1/client/66333/users
  }
  getSitesAllUsers(client,site){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.get(environment.apiUrl+'api/v1/client/'+client+'/site/'+site+'/users',{headers: this.headers});
    //{{url}}/api/v1/client/66333/users
  }
  getAllSites(client){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.get(environment.apiUrl+'api/v1/client/'+client+'/sites',{headers: this.headers})
  }
  addNewUser(userdata,client){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.post(environment.apiUrl+'api/v1/client/'+client+'/user',userdata,{headers: this.headers})
  }

  getAllClients(){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.get(environment.apiUrl + 'api/v1/client',{headers: this.headers})
  } 

  userSuspend(clientId: any, userId:any ){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    //{{url}}/api/v1/client/30705/user/16672/suspend
    return this.http.patch(environment.apiUrl + 'api/v1/client/'+ clientId + '/user/'+  userId +'/suspend',null,{headers: this.headers});
  
  } 

  userActivate(clientId: any, userId:any ){
   // {{url}}/api/v1/client/30705/user/16672/activate
   this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.patch(environment.apiUrl + 'api/v1/client/'+ clientId + '/user/'+  userId +'/activate',null,{headers: this.headers});

  } 


  userDelete(clientId: any, userId:any){
    // {{url}}/api/v1/client/30705/user/16672
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.delete(environment.apiUrl + 'api/v1/client/'+ clientId + '/user/'+  userId,{headers: this.headers});
  }

  userUpdate(clientId: any, userId:any , data:any){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.http.put(environment.apiUrl + 'api/v1/client/'+ clientId + '/user/'+  userId, data,{headers: this.headers});
  }







    
    // let users = localStorage.getItem('users');
    // if(users){
    //   let usersData = JSON.parse(users);
    //   usersData.unshift(userdata);
    //   localStorage.setItem("users",JSON.stringify(usersData));
    // }else{
    //   let usersData = [];
    //   usersData.push(userdata);
    //   localStorage.setItem("users",JSON.stringify(usersData));
    // }
    // return true;
  }
