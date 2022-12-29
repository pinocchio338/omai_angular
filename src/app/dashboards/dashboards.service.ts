import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { AuthService } from '../auth.service' 

@Injectable({
  providedIn: 'root'
})
export class DashboardsService {
 
  isSubscribedToView: boolean = false;
  isSubscribedToCompare: boolean = false;
  isSubscribedToAddOrEdit : boolean = false;
  constructor(private httpClient: HttpClient,
    private authService:AuthService) {
      this.headers = new HttpHeaders()
      // .set('email', 'sanjay.kataria@hushtell.com')
      // .set('userRole', 'READER')
      // .set('Authorization', 'Bearer '+this.authService.getAuthToken())
     }

  private headers:HttpHeaders;
  getDashboards(clientId: string,siteId: string){
    // clientId = "63550"
    // siteId = "26238"
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl+"api/v1/client/"+clientId+"/site/"+siteId+"/dashboards", {headers: this.headers});
  }

  getDashboardDetails(clientId: string,siteId: string, dashboardId: string){
    // clientId = "63550"
    // siteId = "26238"
    //console.log('dashboard details')
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/dashboards/'+dashboardId+"?format=editable&userRole=READER&resetDisabled=true&statePersistence=false&urDisabled=true", {headers: this.headers});
  }

  getComponentsForSite(clientId: string, siteId: string){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/components', {headers: this.headers});
  }

  getComponentDetails(clientId: string,siteId: string, componentId: any){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/component/'+componentId+"?render=true&userRole=READER&resetDisabled=true&statePersistence=false&urDisabled=true", {headers: this.headers});
  }

  authorComponent(clientId: string,siteId: string, componentId:string){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    let componentRequest = '';
    if(componentId)
      componentRequest = '&componentId='+componentId;
    else   
      componentRequest = '&userRole=READER';
        return this.httpClient.get(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/component/author?type=QUICKSIGHT'+componentRequest, {headers: this.headers});
  }

  saveDashboard(clientId: string, siteId: string, data: object){
    // //console.log(clientId,siteId,data)
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.post(environment.apiUrl+"api/v1/client/"+clientId+"/site/"+siteId+"/dashboard",data,{headers: this.headers})
  }

  refreshDashboard(clientId: string, siteId: string){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/refreshComponents',{headers: this.headers})
  }

  updateDashboard(clientId: string, siteId: string, dashboardId: string, data: object){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.put(environment.apiUrl+"api/v1/client/"+clientId+"/site/"+siteId+"/dashboard/"+dashboardId,data,{headers: this.headers})
  }

  deleteDashboard(clientId:string, siteId: string, dashboardId: string){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.delete(environment.apiUrl+'api/v1/client/'+clientId+'/site/'+siteId+'/dashboard/'+dashboardId,{headers: this.headers})
  }

  createComponent(clientId:string, siteId: string, data: string){
    console.warn('creating component');
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken()) 
    return this.httpClient.post(environment.apiUrl+"api/v1/client/"+clientId+"/component",data,{headers: this.headers})
  }

  getAllSchemas(clientId: string, siteId: string){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl+"api/v1/client/"+clientId+"/site/"+siteId+"/schemas", {headers: this.headers});
  }

  getLatestData(clientId: string, siteId: string, dutId: string, data){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    // console.error(data)
    return this.httpClient.post(environment.apiUrl+"api/v1/client/"+clientId+"/site/"+siteId+"/dut/"+dutId+'/data',data, {headers: this.headers});
  }

  updateComponent(clientId: string, data){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.put(environment.apiUrl+'api/v1/client/'+clientId+'/component/'+data['id'],data,{headers: this.headers})
  }

  deleteComponent(clientId: string, componentId: string){
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken());
    return this.httpClient.delete(environment.apiUrl+'api/v1/client/'+clientId+'/component/'+componentId,{headers: this.headers})
    
  }

  applyD3Chart(data: string){
    return this.httpClient.post("http://localhost:3000/posts", data);
  }

  getApplyD3Chart(){
    return this.httpClient.get("http://localhost:3000/posts");
  }
}

// getAllComponentsFOrDashboards, 
// getComponents, 
// AuthorComponents