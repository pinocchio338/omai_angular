import { HttpErrorResponse } from '@angular/common/http';
import { ElementRef,ChangeDetectorRef, SimpleChange  } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { RcaComponent } from 'src/app/rca/rca/rca.component';
import { AlertsService } from '../alerts.service';

@Component({
  selector: 'app-alertpage',
  templateUrl: './alertpage.component.html',
  styleUrls: ['./alertpage.component.scss']
})
export class AlertpageComponent implements OnInit {
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  errorString="";
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild('exporter') exporter;
  displayedColumns: Array<string> = ['service','entity', 'errorCode','errorDetail', 'from','site', 'level','name', 'timestamp','action']; // = ['SRNO','A', 'B', 'C', 'D','E', 'F','G'];
  dataSource: any;
  selectedClientId: string = '';
  selectedSiteId: string = '';
  dataLoaded: boolean = true;
  currentPage:number=0;
  clientInfo = null;
  selectedPageSize:any=10;
  pageList: number[] = [5,10,15,20,50,100];
  paginated:boolean = false;
  selectedSite: string = '';
  alertsData: Array<any> = [];
  loggedInUser:any=null;
  showPagination:boolean=false;
  constructor(
    private dialog:MatDialog,
    private _alertService:AlertsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private authService:AuthService) { 
      this.dataLoaded = false;
    }
    selectPage(page){
      this.paginated = true;
      if(page=='f'){
        this.currentPage = 0;
      }else if(page=='p'){
        if(this.currentPage>0){
          this.currentPage--;
        }
      }else if(page=='n'){
      //if(this.currentPage<this.applicationData.length){
        this.currentPage++;
      //}
    }else if(page=='l'){
    //  this.currentPage=this.applicationData.length;
       
    }
   }
  pageSizeChange(){
    // //console.log("this.selectedPage",this.selectedPageSize);
    this.paginated = false;
    this.currentPage=0;
   }
  setReadAlert(alertToRead){
    if(alertToRead.read){
      return false;
    }
    this.dataLoaded = false;
    //console.log("alertToRead",alertToRead);
    const alertReadData = {"primaryKey":alertToRead.primaryKey};
    const alertKey = alertToRead.sortKey.split('#')[1];
    this._alertService.readAlert(this.selectedClientId, this.loggedInUser,alertReadData,alertKey).subscribe((res:any)=>{
      //console.log("res",res);
      this.getAlerts();
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
      //this.errorString = err.error.mesaage;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  showRca(e: Event, alertData) {
  
    e.stopPropagation();
    const dialogRef = this.dialog.open(RcaComponent, {
      data: {
        clientId: this.selectedClientId,
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
  addSpaceInStr(str){
    if(str){
    return str.replace(/,/g, ', ');
    }else{
      return str;
    }
  }
  ngOnInit(): void {
   
    this.clientInfo = this.authService.getClientInfo();
    
    this.selectedSite = sessionStorage.getItem('selectedSite');
    this.route.params.subscribe(params => {
      this.selectedClientId = params['clientId']? decodeURIComponent(params['clientId']) : '';
      this.selectedSiteId = params['siteId']? decodeURIComponent(params['siteId']) : '';
      this.loggedInUser = params['userId']? decodeURIComponent(params['userId']) : '';
      this.getAlerts();
    });
  }
  getAlerts() {
    if(!(this.selectedClientId && this.loggedInUser))
    return;
     this._alertService.getAllAlerts(this.selectedClientId, this.loggedInUser).subscribe(data => {
     this.authService.updateAlertsData(data);
      this.getAlertsData(data);
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
      //this.errorString = err.error.mesaage;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  goBack(){
    this.router.navigate(['clients',"client#"+this.selectedClientId,"site#"+this.selectedSiteId]);
   }

 
  ngOnChanges(changes: SimpleChange) {
    if (changes["dataSource"]) {
      this.dataSource = new MatTableDataSource(this.dataSource);
      setTimeout(() =>{
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }
  ngAfterViewInit() {
    if(this.dataSource)
      this.dataSource.paginator = this.paginator
}
exportCsv(){
  this.exporter.exportTable('csv',{fileName:'applications_data'})
}
getAlertsData(alertsResData) {
  this.dataLoaded = false;
  let start = this.currentPage*this.selectedPageSize;
  let end = this.selectedPageSize + start;
  start++;
  this.alertsData=[];
  debugger;
  alertsResData.alerts.forEach(resAlert => {
     //console.log(resAlert);     
    if (resAlert['dutErrors']) {
      resAlert['dutErrors'].forEach(dutError => {
        let alertObject = JSON.parse(JSON.stringify(dutError));
        alertObject['from'] = 'DUT';
        alertObject['site'] = resAlert.name;
        alertObject['siteId'] = resAlert.siteId;
        this.alertsData.push(alertObject);
        if(alertObject.timestamp.includes(' ')){
          let splittedDate = alertObject.timestamp.split(' ');
          alertObject.timestamp = splittedDate[0]+'T'+splittedDate[1]+'Z'
        }
      });
    }
    if (resAlert['applicationErrors']) {
      resAlert['applicationErrors'].forEach(applicationError => {
        let alertObject = JSON.parse(JSON.stringify(applicationError));
        alertObject['from'] = 'Application';
        alertObject['site'] = resAlert.name;
        alertObject['siteId'] = resAlert.siteId;
        this.alertsData.push(alertObject);
      });
    }
  });
  // //console.log("this.alertsData",this.alertsData);
  //  this.alertsData.sort(function(a:any,b:any){
  //   return new Date(a.timestamp) - new Date(b.timestamp)
  //  }).reverse();
  this.alertsData.sort(function(a,b){
    return b.timestamp.localeCompare(a.timestamp);
  })
 // //console.log("this.alertsData sorted",this.alertsData);
  this.dataSource = new MatTableDataSource<any>(this.alertsData);
  this.dataLoaded = true;
}

 
  showMessage(message){
    this.snackBar.open(message, 'OK', {
      duration: 5000,
    });
  }


}
