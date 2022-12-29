import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { AuthService } from '../auth.service'

@Injectable({
  providedIn: 'root'
})
export class JointableService {
  constructor(private httpClient: HttpClient,
    private authService: AuthService) {
    this.headers = new HttpHeaders();
  }
  private headers: HttpHeaders;

  getTablesNfields(client,site) {
    this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
    return this.httpClient.get(environment.apiUrl + 'api/v1/client/'+client+'/site/'+site+'/schemas', { headers: this.headers })
  }
previewData(client,site,data){
  this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
  return this.httpClient.post(environment.apiUrl + 'api/v1/client/'+client+'/site/'+site+'/view/preview',data, { headers: this.headers })
}
createDataSet(client,site,data){
  this.headers = this.headers.set('Authorization', 'Bearer '+this.authService.getAuthToken())
  return this.httpClient.post(environment.apiUrl + 'api/v1/client/'+client+'/site/'+site+'/view',data, { headers: this.headers })
}
}
