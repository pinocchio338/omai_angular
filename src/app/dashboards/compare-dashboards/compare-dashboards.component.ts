import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../clients/clients.service'
import { DashboardsService } from '../dashboards.service'
import { AuthService } from '../../auth.service'
import { decode } from 'punycode';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-compare-dashboards',
  templateUrl: './compare-dashboards.component.html',
  styleUrls: ['./compare-dashboards.component.scss']
})
export class CompareDashboardsComponent implements OnInit {
  errorString="";
  selectedClientSites: any[];
  selectedClientId: string;
  baseSite: string = "none";
  baseDashboards: string;
  baseDashboard: string;
  baseDashboardData: any = null;
  comparedSite: string = "none";
  comparedDashboards: string;
  comparedDashboard: string;
  comparedDashboardData: any = null;
  token: string = '';
  dashboardData = [];
  baseDutId = null;
  comparedDutId = null;
  selectedSite: string = null;

  constructor(private route: ActivatedRoute,
    private clientsService: ClientsService,
    private dashboardsService: DashboardsService,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer) { }
  
  ngOnInit(): void {
    this.selectedSite = sessionStorage.getItem('selectedSite');
        this.selectedClientId = decodeURIComponent(this.route.snapshot.params.clientId);
        if(typeof(this.route.snapshot.params.token)!=='undefined' && this.route.snapshot.params.token){
          this.token = this.route.snapshot.params.token;
          this.authService.setAuthToken(this.token);
        }
        this.getSites()
  }

  ngOnDestroy(){
    this.dashboardData.forEach((datum:any) =>{
      clearInterval(datum)
    })
      sessionStorage.removeItem('jsonData_00')
      sessionStorage.removeItem('jsonData_01')
      sessionStorage.removeItem('jsonData_10')
      sessionStorage.removeItem('jsonData_11')
      sessionStorage.removeItem('labels_00')
      sessionStorage.removeItem('labels_01')
      sessionStorage.removeItem('labels_10')
      sessionStorage.removeItem('labels_11')
      
  }

  getSites(){  
    this.clientsService.getSites(this.selectedClientId.split('#')[1]).subscribe((sitesData)=> {
      this.selectedClientSites = sitesData['sites'];
      //console.log(this.selectedClientSites)
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  getDashboards(side: string){
    let siteId = ''
    siteId = side == 'base' ?  this.baseSite : this.comparedSite;
    this.dashboardsService.getDashboards(this.selectedClientId.split('#')[1], siteId.split('#')[1]).subscribe(dashboards => {
      //console.log(dashboards);
      side == 'base' ? this.baseDashboards = dashboards['dashboards'] : this.comparedDashboards = dashboards['dashboards']
    },(httpError:HttpErrorResponse)=>{
     // this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  showDashboard(side: string){
    let clientId = this.selectedClientId.split('#')[1];
    let siteId = side == 'base' ? this.baseSite.split('#')[1] : this.comparedSite.split('#')[1];
    let dashboardId = side == 'base' ? this.baseDashboard.split('#')[1] : this.comparedDashboard.split('#')[1];
    //console.log('showDashboard')
    this.dashboardsService.getDashboardDetails(clientId, siteId, dashboardId).subscribe(dashboard => {
      //console.log('dashboard at '+side,dashboard)
      dashboard['components'].forEach((component,index) => {        
        if(component['type']=='DIAGRAM'){
          let params = [];
          component.data = component.data.split('\n').join('');          
          let data = JSON.parse(component.data);
          while(typeof(data)=='string'){
            data = JSON.parse(data);
          }
          try{
          data.forEach(datum => {
              if(datum.labels && typeof(datum.labels[0].param)!=='undefined' && !params.includes(datum.labels[0].param)){
                params.push(datum.labels[0].param)
              }
              })
            }
            catch(e){}
          this.dashboardsService.getAllSchemas(this.selectedClientId.split('#')[1],siteId).subscribe(data => {
            if(data && data['duts'].length){
              side =='base'? this.baseDutId = data['duts'][0]['dutId'].split('#')[1] : this.comparedDutId = data['duts'][0]['dutId'].split('#')[1];
              let mergedIndex = side == 'base' ? '0'+index : '1'+index;
              let dutId = side == 'base' ? this.baseDutId : this.comparedDutId;
              this.iniatializeDataUpdater(params, siteId,dutId,mergedIndex);                
            }
          })
          component['url']=this.transform(window.location.origin+'/assets/diagram/index.html?mode=view&index='+(side == 'base' ? '0' : '1' + index))
          // console.error(side,index)
          sessionStorage.setItem('jsonData_'+(side == 'base' ? '0' : '1' + index),component['data'])
        }else{
          component['url'] = this.transform(component['url'])
        }
      });
      side == 'base' ? this.baseDashboardData = dashboard : this.comparedDashboardData = dashboard;
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  

  transform(url: string) {
    // console.error('transforming')
    let newUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    return newUrl;
  }

  goBack() {
    sessionStorage.removeItem('jsonData_0')
    sessionStorage.removeItem('jsonData_1')
    this.router.navigate(['clients', this.selectedClientId]);
  }

  iniatializeDataUpdater(params,siteId,dutId,index){
    let newThis = this;

    let clientId = this.selectedClientId.split('#')[1];
    this.dashboardsService.getLatestData(clientId,siteId,dutId, {"fields":params}).subscribe(response=>{
      sessionStorage.setItem('liveData_'+index,JSON.stringify(response['data'][0]))});

    let handle =setInterval(()=>{
      //console.log('fetching latest data', newThis);
      let clientId = this.selectedClientId.split('#')[1];
      this.dashboardsService.getLatestData(clientId,siteId,dutId, {"fields":params}).subscribe(response=>{
        sessionStorage.setItem('liveData_'+index,JSON.stringify(response['data'][0]))
      })
    },30000)
    this.dashboardData.push(handle);
  }
}
