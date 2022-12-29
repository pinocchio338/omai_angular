import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardsService } from '../dashboards.service'
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../auth.service'
import { embedDashboard } from 'amazon-quicksight-embedding-sdk';
import { HttpErrorResponse } from '@angular/common/http';
 
@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent implements OnInit,OnDestroy {
  errorString="";
  dashboardsList: any[] = [];
  constructor(private dashboardsService: DashboardsService,
    private router: Router,
    private route: ActivatedRoute, 
    private authService:AuthService,
    private sanitizer: DomSanitizer) { }

  selectedClientId: string;
  selectedSiteId: string; 
  selectedDashboardId: string;
  dashboardInfo: any;
  quickSightDashboards: any =[];
  userInfo: any;
  dataLoaded: boolean = false;
  token: string = '';
  dashboardData: any[] = [];
  dutId: string = null;
  dashboardName: string = '';
  selectedSite: string = '';
  ngOnInit(): void {
   
    // this.dataLoaded = false;
    //console.log('this.dataLoaded')
    this.selectedSite = sessionStorage.getItem('selectedSite');
    if(!this.dashboardsService.isSubscribedToView){
      // this.dashboardsService.isSubscribedToView = true;
      this.dutId = null;
      if(typeof(this.route.snapshot.params.token)!=='undefined' && this.route.snapshot.params.token){
        this.token = this.route.snapshot.params.token;
        this.authService.setAuthToken(this.token);
      }
    this.route.params.subscribe(params => {
      this.selectedClientId = params['clientId']? decodeURIComponent(params['clientId']).split('#')[1] : '';
      this.selectedSiteId = params['siteId']? decodeURIComponent(params['siteId']).split('#')[1] : '';
      this.selectedDashboardId = params['dashboardId']? decodeURIComponent(params['dashboardId']).split('#')[1] : '';
      if(typeof(this.route.snapshot.params.token)!=='undefined' && this.route.snapshot.params.token){
        this.token = this.route.snapshot.params.token;
        this.authService.setAuthToken(this.token);
      }
      this.dataLoaded = false;
    this.dashboardsService.getDashboardDetails(this.selectedClientId, this.selectedSiteId, this.selectedDashboardId).subscribe(response => {
      //console.log('dashboards',response)
      this.dashboardName = response['name']
      response['components'].forEach((component,index) => {
        if(component.type=='DIAGRAM'){
          component.url=window.location.origin+'/assets/diagram/index.html?mode=view&index='+(index);
          sessionStorage.setItem('jsonData_'+(index),component.data);
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
            // console.error(params)
          if(!this.dutId){
            this.dashboardsService.getAllSchemas(this.selectedClientId,this.selectedSiteId).subscribe(data => {
              if(data && data['duts'].length){
                this.dutId = data['duts'][0]['dutId'].split('#')[1];
                this.iniatializeDataUpdater(params, index);                
              }
            })
          }
          else{
            this.iniatializeDataUpdater(params, index);
          }
        }          
        component.url = this.transform(component.url)
        
      });
      this.dashboardInfo = response;
      this.dataLoaded = true;
    },(httpError:HttpErrorResponse)=>{
     // this.errorString = err.error.message;
      this.dataLoaded = true;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
    this.userInfo = this.authService.getUserInfo();
  });}
  }

  ngOnDestroy(){
    this.dashboardData.forEach((datum:any) =>{
      clearInterval(datum)
    })
      sessionStorage.removeItem('jsonData_0')
      sessionStorage.removeItem('jsonData_1')
      sessionStorage.removeItem('labels_0')
      sessionStorage.removeItem('labels_1')
  }

  iniatializeDataUpdater(params,index){
    let newThis = this;
    this.dashboardsService.getLatestData(this.selectedClientId,this.selectedSiteId,this.dutId, {"fields":params}).subscribe(response=>{
      sessionStorage.setItem('liveData_'+index,JSON.stringify(response['data'][0]))
    });
    
    let handle =setInterval(()=>{
      //console.log('fetching latest data', newThis);
      this.dashboardsService.getLatestData(this.selectedClientId,this.selectedSiteId,this.dutId, {"fields":params}).subscribe(response=>{
        sessionStorage.setItem('liveData_'+index,JSON.stringify(response['data'][0]))
      })
    },30000)
    this.dashboardData.push(handle);
  }

  transform(url: string) {
    let newUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // console.error(newUrl);
    return newUrl;
  }

  goBack() {
    sessionStorage.removeItem('jsonData_0')
    sessionStorage.removeItem('jsonData_1')
    this.router.navigate(['clients', 'client#'+this.selectedClientId, 'site#'+this.selectedSiteId]);
  }
}
