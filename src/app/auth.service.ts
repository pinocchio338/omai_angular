import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import xhook from 'xhook';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private userRole: string = null;
// private userClientId: string = "client#11919"
private userInfo: object = {};
private appInfo: object = {}
private alertsInfo: object = {};
private dashboardsInfo: object = {};
private loginInfo: object = {};
// private alertsInfo: object = {};

private appDataSource = new BehaviorSubject<any>(this.appInfo);
appData = this.appDataSource.asObservable();

private userDataSource = new BehaviorSubject<any>(this.userInfo);
userData = this.userDataSource.asObservable();

private dashboardDataSource = new BehaviorSubject<any>(this.dashboardsInfo);
dashboardData = this.dashboardDataSource.asObservable();

private alertsDataSource = new BehaviorSubject<any>(this.alertsInfo);
alertsData = this.alertsDataSource.asObservable();

private errorSource = new BehaviorSubject<any>(this.alertsInfo);
errorData = this.errorSource.asObservable();

private loginSource = new BehaviorSubject<any>(this.loginInfo);
loginData = this.errorSource.asObservable();

isToolbarSubscribed: boolean = false;

// private rules = {
//   "admin": false,
//   "alerts": {
//     "receive": true,
//     "send": true
//   },
//   "applications": [
//     "ApplicationId_1",
//     "ApplicationID_2"
//   ],
//   "dashboard": {
//     "add": false,
//     "asHome": true,
//     "dashboards": [
//       "DashboardID1",
//       "DashboardID2"
//     ],
//     "delete": false,
//     "edit": true,
//     "view": true
//   },
//   "report": {
//     "generate": true
//   },
//   "userGroups": {
//     "add": false,
//     "delete": false,
//     "edit": true,
//     "view": true
//   },
//   "users": {
//     "add": false,
//     "delete": false,
//     "edit": true,
//     "view": true
//   }
// }  
private rules = {}
  constructor(private router: Router) { 
    xhook.after((request, response) => {
      // console.warn(response);
      if(response.status == 403){
        if(typeof(response.text) == 'string'){
          // console.error('redirecting')
          const text = JSON.parse(response.text);
          if(text.message == 'User is not authorized to access this resource with an explicit deny' ||
             text.Message == 'User is not authorized to access this resource with an explicit deny'){
            // this.router.navigateByUrl('/');
            window.location.href = window.location.origin;
            this.updateErrorMessage('Token has expired. Please login again')
          }
        }
      }
      // return response;
    });
  }

  setRole(role: string){
    this.userRole = role;
    sessionStorage.setItem('role',role);
    //console.log('setting role',role)
  }

  getRole(){
    this.userRole = sessionStorage.getItem('role')
    return this.userRole;
  }

  getRules(){
    return this.rules;
  }

  // setUserClientId(clientId: string){
  //   this.userClientId = clientId;
  // }

  // getUserClientId(){
  //   return this.userClientId;
  // }

  clearData(){
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('userInfo');
    sessionStorage.removeItem('clientInfo');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('permissions');
    sessionStorage.removeItem('selectedSite'); 
    sessionStorage.removeItem('firstAttempt');
    this.updateAlertsData([]);
    this.updateAppData([]);
    this.updateUserData([]);
    this.updateLoginData([]);
    this.updateDashboardsData([]);   
  }

  setUserInfo(info: object){
    this.userInfo = info;
    this.updateLoginData(info);
    // console.error(this.userInfo)
    sessionStorage.setItem('userInfo',JSON.stringify(this.userInfo))
  }
  
  getUserInfo(){
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
    return this.userInfo;
  }

  setClientInfo(data:object){
    sessionStorage.setItem('clientInfo', JSON.stringify(data));
  }

  getClientInfo(){
    return JSON.parse(sessionStorage.getItem('clientInfo'))
  }

  updateAppData(data:object){
    // console.error(data)
    this.appDataSource.next(data)
  }

  updateUserData(data:object){
    // sessionStorage.setItem('userAndClient',JSON.stringify(data))
    // console.error(data)
    this.userDataSource.next(data)
  }

  updateDashboardsData(data:object){
    this.dashboardDataSource.next(data)
  }

  
  updateAlertsData(data:object){
    this.alertsDataSource.next(data)
  }

  updateErrorMessage(data:string){
    this.errorSource.next(data);
  }

  updateLoginData(data: any){
    // console.error(data)
    this.loginSource.next(data);
  }

  getStoredUserData(){
    return sessionStorage.getItem('userAndClient')
  }

  setPermissions(data){
    sessionStorage.setItem('permissions',JSON.stringify(data))
  }

  getPermission(key: string){
    try{
      let permissions = JSON.parse(sessionStorage.getItem('permissions'));
      return permissions[key];    
    }
    catch(e){
      return null;
    }
  }
  
  removeErrorMessage(error: string){
    setTimeout(()=>{
      error = null;
    },1000);
    return true;
  }

  isAllowed(key: string, type: string){
    try{
    const permissions = JSON.parse(sessionStorage.getItem('permissions'));
    return this.getRole()=='super-admin' || this.getRole()=='client-admin' || permissions[key][type];
    }    
    catch(e){
      return this.getRole()=='super-admin' || this.getRole()=='client-admin';      
    }
  }
  setAuthToken(token){
    sessionStorage.setItem('token',token);
    // sessionStorage.setItem('token','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGVlcGFrIFNvbmF3YW5lIiwicGhvdG8iOiJodHRwczovL3MzLXVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3Jlc291cmNlcy1idWNrZXQtcHJvamVjdHgtYmUtcHJhdGlrL3BsYXRmb3JtL3BsYXRmb3JtT3duZXIvdXNlcnMvcGhvdG9zL3VzZXIlMjM1MjY4NS5qcGciLCJlbWFpbCI6ImRzb25hd2FuZUBiaW9nYXNlbmcuY29tIiwicGhvbmUiOiI3NDQtMTQ2LTQyODgiLCJ1c2VySWQiOiJ1c2VyIzUyNjg1IiwiaWF0IjoxNjExNDY1ODYxLCJleHAiOjE2MTE0NjU5ODF9.IV9zvqgitF2EPC7-3g02fWsckktiYmBjtczZilrgts4')
  }

  getAuthToken(){
    // return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGVlcGFrIFNvbmF3YW5lIiwicGhvdG8iOiJodHRwczovL3MzLXVzLXdlc3QtMi5hbWF6b25hd3MuY29tL3Jlc291cmNlcy1idWNrZXQtcHJvamVjdHgtYmUtcHJhdGlrL3BsYXRmb3JtL3BsYXRmb3JtT3duZXIvdXNlcnMvcGhvdG9zL3VzZXIlMjM1MjY4NS5qcGciLCJlbWFpbCI6ImRzb25hd2FuZUBiaW9nYXNlbmcuY29tIiwicGhvbmUiOiI3NDQtMTQ2LTQyODgiLCJ1c2VySWQiOiJ1c2VyIzUyNjg1IiwiaWF0IjoxNjExNDY1ODYxLCJleHAiOjE2MTE0NjU5ODF9.IV9zvqgitF2EPC7-3g02fWsckktiYmBjtczZilrgts4'
    return sessionStorage.getItem('token');
  }

}




// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG90byI6Imh0dHBzOi8vcmVzb3VyY2VzLWJ1Y2tldC1wcm9qZWN0eC1iZS1zdGFnaW5nLnMzLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tL2NsaWVudHMvY2xpZW50JTIzNTk2OTgvdXNlci9waG90b3MvMTY4NDkuanBlZyIsInBhc3N3b3JkIjoifXdqU2Flc1U4OCQiLCJ1c2VyR3JvdXBzIjpbInVzZXJncm91cCMxNTU0NSIsInVzZXJncm91cCMzODc3MSJdLCJzb3J0S2V5IjoidXNlciMyMjQxMiIsInN0YXR1cyI6ImFjdGl2ZSIsInByaW1hcnlLZXkiOiJjbGllbnQjNTk2OTgiLCJlbWFpbCI6ImpvaG5ueS5pbmdyYW1AYWF0YmlvZ2FzLmF0IiwicGhvbmUiOiI5NzgtMjg2LTg3MDUiLCJuYW1lIjoiSm9obm55IEluZ3JhbSIsImlhdCI6MTYwOTQ4MjQxNX0.dDIZ2bu3YhnEBx-7yqj-vFLxNJiq4LOIdLp-W4LZzeQ