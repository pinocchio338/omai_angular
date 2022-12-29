import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { AuthService } from '../auth.service'

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  private siteCount : any ;
  constructor(private httpClient: HttpClient,
    private authService: AuthService) {
    this.headers = new HttpHeaders();
  }
  private headers: HttpHeaders;

  getClients() {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl + 'api/v1/client', { headers: this.headers })
  }

  getClientsById(clientId: string) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl + 'api/v1/client/'+clientId, { headers: this.headers })
  }

  getSites(clientId: string) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl + 'api/v1/client/' + clientId + '/sites', { headers: this.headers })
  }

  getUsers(clientId: string) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl + 'api/v1/client/' + clientId + '/users', { headers: this.headers })
  }


  saveSubscription(data: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.post(environment.apiUrl + 'api/v1/client', data, { headers: this.headers });
  }


  getSiteListByClient(clientId: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl + 'api/v1/client/' + clientId + '/sites', { headers: this.headers });
  }

  addSiteByClient(data: any, cliendId: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.post(environment.apiUrl + 'api/v1/client/' + cliendId + '/site', data, { headers: this.headers });
  }


  getAllUserandUserGroupByClient(cliendId) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl + 'api/v1/client/' + cliendId + '/users', { headers: this.headers });
  }

  createGroup(data: any, cliendId: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.post(environment.apiUrl + 'api/v1/client/' + cliendId + '/usergroup', data, { headers: this.headers });
  }

  userGroupUpdate(userId: any, clientId: any, data: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.post(environment.apiUrl + 'api/v1/client/' + clientId + '/usergroup/' + userId + '/users', data, { headers: this.headers });
  }

  createUser(data: any, clientId: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.post(environment.apiUrl + 'api/v1/client/' + clientId + '/user', data, { headers: this.headers });
  }


  getSubcritionDataByClientId(clientId: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl + 'api/v1/client/' + clientId, { headers: this.headers });
  }

  activateUser(clientId: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.patch(environment.apiUrl + 'api/v1/client/' + clientId + '/activate', null, { headers: this.headers });
  }

  updateUsergroup(data: any, clientId: any, userId: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.put(environment.apiUrl + 'api/v1/client/' + clientId + '/usergroup/' + userId, data, { headers: this.headers });

  }
  updateGroupUsers(usergroup: any, users: any, clientId) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.post(environment.apiUrl + 'api/v1/client/' + clientId + '/usergroup/' + usergroup + '/users', users, { headers: this.headers });
  }


  updateEmergencyContacts(clientId: string, siteId: string, contacts: any[]) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    //console.log('here', clientId, siteId, contacts)
    return this.httpClient.post(environment.apiUrl + 'api/v1/client/' + clientId + '/site/' + siteId + '/emergencyContacts', { contacts }, { headers: this.headers });
  }

  updateUsergroupPermission(data: any, clientId: any, groupId: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.post(environment.apiUrl + 'api/v1/client/' + clientId + '/usergroup/' + groupId + '/permissions', data, { headers: this.headers });
  }


  updateUser(data: any, clientId: any, userId: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.put(environment.apiUrl + 'api/v1/client/' + clientId + '/user/' + userId + '/', data, { headers: this.headers });
  }

  updateSubscription(data: any, clientId: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.put(environment.apiUrl + 'api/v1/client/' + clientId, data, { headers: this.headers });
  }

  updateSite(data: any, clientId: any, siteId: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    // {{url}}/api/v1/client/22169/site/42366
    return this.httpClient.put(environment.apiUrl + 'api/v1/client/' + clientId + '/site/' + siteId, data, { headers: this.headers });
  }

  updateClient(clientId: string, data: any) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.put(environment.apiUrl + 'api/v1/client/' + clientId, data, { headers: this.headers });
  }

  getShifts(clientId: string, siteId: string) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl + 'api/v1/client/' + clientId + '/site/' + siteId + '/shifts', { headers: this.headers });
  }

  getDutConfig(clientId: string, siteId: string){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl + 'api/v1/client/' + clientId + '/site/' + siteId + '/dutconfig',{headers: this.headers});
  }

  deleteClient(clientId: string) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.delete(environment.apiUrl + 'api/v1/client/' + clientId, { headers: this.headers });
  }

  activateDeactivateSite(clientId: string, siteId: string, status: string) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    //console.log(clientId, siteId, status)
    return this.httpClient.patch(environment.apiUrl + 'api/v1/client/' + clientId + '/site/' + siteId + '/' + status, {}, { headers: this.headers });
  }

  deleteSite(clientId: string, siteId: string) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.delete(environment.apiUrl + 'api/v1/client/' + clientId + '/site/' + siteId, { headers: this.headers });
  }

  addLayout(clientId: string, siteId: string, fileName: string, data: object) {
    //console.log(fileName)
    return this.httpClient.post(environment.apiUrl + "api/v1/client/" + clientId + "/site/" + siteId + "/layout", data,
      {
        headers: new HttpHeaders().set('X-FILENAME', fileName).set('Authorization', 'Bearer ' + this.authService.getAuthToken())
      })
  }

  deleteLayout(clientId: string, siteId: string, fileName: string) {
    //console.log(fileName)
    return this.httpClient.delete(environment.apiUrl + "api/v1/client/" + clientId + "/site/" + siteId + "/layout",
      {
        headers: new HttpHeaders().set('X-FILENAME', fileName).set('Authorization', 'Bearer ' + this.authService.getAuthToken())
      })
  }

  sendReminder(clientId){
    this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl + "api/v1/client/"+clientId+"/reminder",{ headers: this.headers })
  }

  verifyAddress(addressData){

    // https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=
    let url = 'https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=';
  //  this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(url + addressData);
  }


  setSiteCount(data:any){
   this.siteCount = sessionStorage.setItem('siteCount', data);
  }

  getSiteCount(){

    this.siteCount = sessionStorage.getItem('siteCount');
    return this.siteCount;
  }


  setUserCount(data:any){
    this.siteCount = sessionStorage.setItem('usersCount', data);
   }
 
   getUserCount(){
 
     this.siteCount = sessionStorage.getItem('usersCount');
     return this.siteCount;
   }

  
  
}
