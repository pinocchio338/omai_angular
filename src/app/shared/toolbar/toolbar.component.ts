import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { ApplicationsService } from '../../applications/applications.service';
import { LoginService } from '../../login/login.service';
import { DashboardsService } from '../../dashboards/dashboards.service'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RcaComponent } from '../../rca/rca/rca.component';
import { AlertService } from '../alert.service';
import { ComponentNamePopupComponent } from '../../dashboards/component-name-popup/component-name-popup.component'
import { HttpErrorResponse } from '@angular/common/http';
import { AlertComponent } from '../alert/alert.component'
import { ChangepasswordComponent } from '../changepassword/changepassword.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Input() currentPage: string = 'mysites'; // decorate the property with @Input()
  @Input() logo: string = '';
  @Input() companyName: string = 'OMai';
  @Input() hideApplications: boolean = false;

  showAddClientButton = true;
  role: string = '';
  applicationData: any = {};
  userInfo: object = {};
  clientInfo: object = {};
  dashboardData: any = [];
  applicationList: any = [];
  alerts: any = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  selectedClientAndSite: any = {};
  alertsData: Array<any> = [];
  clientId: any = 23456;
  loggedInUserId: any = null;
  groupPermissions: object = null;
  userPermissions: object = null;
  alertPermissions: object = null;
  errorString = "";
  isLoaded: boolean = true;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
    private _applicationService: ApplicationsService,
    private loginService: LoginService,
    private dashboardsService: DashboardsService,
    private _alertService: AlertService,
    private alertDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.clientId = this.route.snapshot.params.clientId;
    this.groupPermissions = this.authService.getPermission('userGroups')
    this.userPermissions = this.authService.getPermission('users')
    this.alertPermissions = this.authService.getPermission('alerts')
    // console.warn('userPermissions',this.userPermissions);
    // console.error(this.selectedClientAndSite['selectedClientId'] , this.selectedClientAndSite['selectedSiteId'])
    // if(this.selectedClientAndSite['selectedClientId'] && this.selectedClientAndSite['selectedSiteId']){
    //   this.getDashboards();
    //   this.getAlerts();
    // }
    this.authService.loginData.subscribe(data =>{
      this.clientInfo = this.authService.getClientInfo();
    })
    this.role = this.authService.getRole();
    if(this.role === 'super-admin' && this.currentPage=='mysites'){
      //console.log('changing')
      this.currentPage = 'clients';
    }
    this.clientInfo = this.authService.getClientInfo();
    // console.error(this.currentPage)
    if (!this.authService.isToolbarSubscribed || true) {
      this.authService.isToolbarSubscribed = true;
      this.authService.userData.subscribe(data => {
        // //console.log(JSON.stringify(this.selectedClientAndSite), JSON.stringify(data))
        if (data['selectedClientId'] && data['selectedSiteId']) {
          // console.error('old:',this.selectedClientAndSite);
          // console.error('new:',data);
          // console.warn('clients and sites',this.selectedClientAndSite, data)
          this.selectedClientAndSite = data;
          // if(Object.keys(data).length==0){
          //   this.selectedClientAndSite = JSON.parse(this.authService.getStoredUserData());
        }
        // console.error(this.selectedClientAndSite)
        // if(this.selectedClientAndSite['selectedClientId'] && this.selectedClientAndSite['selectedSiteId']){
        // this.getDashboards();
        // this.getAlerts();
        // }
        // }
      });
    }
    else {
      //console.log('already subscribed')
    }
    if (this.clientInfo) {
      this.logo = this.clientInfo['logo'];
      if (this.logo == undefined || this.logo == '') {

        this.logo = 'assets/sample-site-image.png';

      }
      this.companyName = this.clientInfo['name'];
      this.clientId = this.clientInfo['clientId'];
    }

    this.authService.appData.subscribe(data => {
      this.applicationData = data;
    })

    this.authService.dashboardData.subscribe(data => {
      this.dashboardData = data;
    })

    // console.error('alerts data')
    this.authService.alertsData.subscribe(data => {
      // console.error(data);
      if (!data || !Object.keys(data).length) {
        return;
      }
      // console.warn('data',data)
      this.getAlerts(data['alerts'])
    })

    if (
      this.route.snapshot['_routerState'].url.includes('clients/add') ||
      this.role != 'super-admin'
    ) {
      this.showAddClientButton = false;
    } else {
      this.showAddClientButton = true;
    }
    this.userInfo = this.authService.getUserInfo();
    //console.log('loggedinuserInfo', this.userInfo);
    if (this.userInfo['photo'] == null || this.userInfo['photo'] == '') {
      this.userInfo['photo'] = 'assets/sample-site-image.png';
    }
    else{
      this.userInfo['photo'] = this.userInfo['photo'].trim();
    }
    if (this.userInfo && this.userInfo['userId']) {
      this.loggedInUserId = this.userInfo['userId'].split('#')[1];
    }
    if (this.loggedInUserId) {
      try {
        // this.getAlerts();
      }
      catch (e) {
        console.error('error in getting alerts');
      }
    }

    // if (!this.userInfo || Object.keys(this.userInfo).length == 0) {
    //   this.router.navigateByUrl('/login');
    // }

  }

  isAllowed(key: string, type: string) {
    return this.authService.isAllowed(key, type);
  }

  gotoMysites(){
    this.currentPage = "mysites";
    this.router.navigate(['clients']);
  }


  showRca(e: Event, alertData) {
  
    e.stopPropagation();
    const dialogRef = this.dialog.open(RcaComponent, {
      data: {
        clientId: this.selectedClientAndSite['selectedClientId'].split('#')[1],
        from:alertData.from,
        fromId:alertData.primaryKey,
        siteId:alertData.siteId,
        errorId:alertData.sortKey,
        entity:alertData.entity,
        errorCode:alertData.errorCode,
        errorDetail:alertData.errorDetail,
        level:alertData.level,
        name:alertData.name,
        service:alertData.service,
        timestamp:alertData.timestamp
        
      },
      position:{top:'2%'}
    ,width:'700px', panelClass:'modal-rca',disableClose: true,
  });
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        // this.getAlerts();
      }
    });
  }

  getAlerts(alertsResData) {
    this.alertsData=[];
    alertsResData.forEach(resAlert => {
      // //console.log(resAlert);     
      if (resAlert['dutErrors']) {
        resAlert['dutErrors'].forEach(dutError => {
          // let alertObject = JSON.parse(JSON.stringify(dutError));
          // alertObject['from'] = 'Dut';
          // alertObject['siteId'] = resAlert.siteId;
          if(!dutError.read){
            this.alertsData.push(dutError);
          }
         
        });
      }
      if (resAlert['applicationErrors']) {
        resAlert['applicationErrors'].forEach(applicationError => {
          // let alertObject = JSON.parse(JSON.stringify(applicationError));
          // alertObject['from'] = 'Application';
          // alertObject['siteId'] = resAlert.siteId;
          if(!applicationError.read)
          this.alertsData.push(applicationError);
        });
      }
    });

    // => 
    // alertsData.forEach(objAlert => {
    //   objAlert['dutErrors'].forEach(dutError => {
    //     let alertObject=JSON.parse(JSON.stringify(dutError));
    //     alertObject['from']='Dut';
    //     this.alertsData.push(alertObject);
    //   });
    //   objAlert['applicationErrors'].forEach(applicationError => {
    //     let alertObject=JSON.parse(JSON.stringify(applicationError));
    //     alertObject['from']='Application';
    //     this.alertsData.push(alertObject);
    //   });
    // });
    // //console.log("this.alertsData",this.alertsData);
    // })
  }

  gotouserandgroups() {
    this.currentPage = "userandgroups";
    this.router.navigate(['userandgroups', this.selectedClientAndSite['selectedClientId']]);
  }
  gotoalerts(){
    this.router.navigate(['alertspage', this.selectedClientAndSite['selectedClientId'].split('#')[1],
    this.selectedClientAndSite['selectedSiteId'].split('#')[1],this.loggedInUserId]);

  }
  gotoApplications(index: number) {
    this.currentPage = 'applications';
    this.router.navigate(['applications', this.selectedClientAndSite['selectedClientId'].split('#')[1],
      this.selectedClientAndSite['selectedSiteId'].split('#')[1],
      this.applicationData['applications'][index]['sortKey'].split('#')[1]]);
  }
  gotoUserGroups() {
    this.currentPage = 'userandgroups';
    this.router.navigate(['userandgroups', this.selectedClientAndSite['selectedClientId']]);
  }
  goToHome() {
    if(this.role == 'super-admin')
      this.currentPage = 'clients';
    else{
        this.currentPage = 'mysites';
        sessionStorage.removeItem('firstAttempt');
      }
    this.router.navigate(['clients']);
  }

  goToClients() {
    this.currentPage = 'clients';
    this.router.navigateByUrl('/clients');
  }

  goToClientInfo(){
    this.currentPage = 'clientinfo';
    this.router.navigate(['clients','details',this.selectedClientAndSite['selectedClientId']]);
  }

  goToDashboards(index: number) {
    this.currentPage = 'dashboards';
    // //console.log("dashboards",this.dashboardData[index].sortKey.split('#')[1])
    this.router.navigate(['dashboards', this.selectedClientAndSite['selectedClientId'],
      this.selectedClientAndSite['selectedSiteId'], this.dashboardData[index].sortKey]);
  }

  compareDashboards() {
    this.currentPage = 'dashboards';
    this.router.navigate(['dashboards', 'compare', this.selectedClientAndSite['selectedClientId']]);
  }

  addDashboard() {
    let dashboardName = '';
      const dialogRef = this.dialog.open(ComponentNamePopupComponent, {
        width: '500px', 
        disableClose: true,       
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(typeof(result) != 'undefined' && result){
            dashboardName = result;
            //console.log(result)
            sessionStorage.setItem('dashboardName',result)
            this.router.navigate(['dashboards','add', this.selectedClientAndSite['selectedClientId'],
            this.selectedClientAndSite['selectedSiteId']
          ]);
        }
      });
  }
  chnagePwd() {
      const chnagePwdDialogRef = this.dialog.open(ChangepasswordComponent, {
        data:{
          userId:this.loggedInUserId
        },
        width: '500px', 
        disableClose: true,       
      });
  
      chnagePwdDialogRef.afterClosed().subscribe(result => {
        //console.log("result",result);
      });
  }

  deleteDashboard(event, dashboardId) {
    event.preventDefault();
    // event.stopPropagation();
    // //console.log(event,dashboardId);
    // this.isLoaded = false;
    this.showAlert('Do you want to delete this dashboard?', 'success', 'Delete Dashboard',dashboardId);
    // return;    
  }

  editDashboard(event, dashboardId) {
    this.isLoaded = false;
    // event.stopPropagation();
    this.router.navigate(['dashboards', 'edit', this.selectedClientAndSite['selectedClientId'],
      this.selectedClientAndSite['selectedSiteId'], 'dashboard#' + dashboardId]);
  }

  addClient() {
    localStorage.removeItem('draft_clientId');
    localStorage.removeItem('client_Id');
    this.router.navigate(['clients/add']);
  }

  logout() {
    this.loginService.logout();
    this.router.navigateByUrl('/login');
  }

  getFirstName(name: string) {
    return name.split(' ')[0];
  }

  getDashboards() {
    if (!this.selectedClientAndSite['selectedClientId'] || !this.selectedClientAndSite['selectedSiteId']) {
      return;
    }
    this.dashboardsService.getDashboards(this.selectedClientAndSite['selectedClientId'].split('#')[1],
      this.selectedClientAndSite['selectedSiteId'].split('#')[1]).subscribe(response => {
        this.dashboardData = response['dashboards'];
      })
  }

  showAlert(alertMsg = '', alertType = 'success', alertTitle = '', dashboardId) {
    const dialogRef = this.alertDialog.open(AlertComponent, {
      disableClose: true,
      data: {
        alertMsg: alertMsg,
        alertType: alertType,
        alertTitle: alertTitle,
        showCancel:true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if (result) {
        this.isLoaded = false;
        this.dashboardsService.deleteDashboard(this.selectedClientAndSite['selectedClientId'].split('#')[1],
          this.selectedClientAndSite['selectedSiteId'].split('#')[1], dashboardId).subscribe(response => {
            this.getDashboards();
            this.isLoaded = true;
          },
            (httpError: HttpErrorResponse) => {
              //this.errorString = error.error.message;
              this.isLoaded = true;
              this.authService.updateErrorMessage(httpError['error']['message']);
              //console.error(error)
            })
      }
    });
  }

  isDashboard(){
    if(this.currentPage=='dashboards' || typeof(this.currentPage)=='undefined')
      return true;
    return false;
  }

}
