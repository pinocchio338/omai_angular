import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentsListComponent } from '../components-list/components-list.component'
import { DashboardsService } from '../dashboards.service'
import { DomSanitizer } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../auth.service'

@Component({
  selector: 'app-add-dashboard',
  templateUrl: './add-dashboard.component.html',
  styleUrls: ['./add-dashboard.component.scss']
})
export class AddDashboardComponent implements OnInit, OnDestroy {
  // @ViewChild('iframe') iframe: ElementRef;
  // @ViewChild('iframe', { read: ViewContainerRef }) iframe : any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private dashboardsService: DashboardsService) {
    this.dashboardName = sessionStorage.getItem('dashboardName') || null;
  }
  selectedClientId: string = '';
  selectedSiteId: string = '';
  selectedDashboardId: string = '';
  topComponent: any = null;
  bottomComponent: any = null;
  dataLoaded: boolean = true;
  dashboardName: string = '';
  state: string = 'edit-all';
  topComponentType: string = '';
  bottomComponentType: string = ''
  errorString = "";
  token: any = null;
  backupComponent = null;
  backupComponentType = null;
  selectedDashboardObject: any = null;
  mode: string = '';
  componentNameError='';
  selectedSite: string = '';

  ngOnInit(): void {
    this.selectedClientId = decodeURIComponent(this.route.snapshot.params.clientId);
    this.selectedSiteId = decodeURIComponent(this.route.snapshot.params.siteId);
    this.selectedDashboardId = decodeURIComponent(this.route.snapshot.params.dashboardId);
    this.selectedSite = sessionStorage.getItem('selectedSite');
    //console.log(typeof (this.selectedDashboardId))
    if (this.selectedDashboardId != 'undefined')
      this.mode = 'edit';
    else
      this.mode = 'create';
    if (typeof (this.route.snapshot.params.name) !== 'undefined' && this.route.snapshot.params.name) {
      this.dashboardName = decodeURIComponent(this.route.snapshot.params.name);
      // this.mode = 'create';
    }
    if (typeof (this.route.snapshot.params.token) !== 'undefined' && this.route.snapshot.params.token) {
      this.token = this.route.snapshot.params.token;
      this.authService.setAuthToken(this.token);
    }


    if (this.selectedDashboardId != 'undefined') {
      this.dataLoaded = false;
      this.dashboardsService.getDashboardDetails(this.selectedClientId.split('#')[1],
        this.selectedSiteId.split('#')[1],
        this.selectedDashboardId.split('#')[1]).subscribe(result => {
          this.selectedDashboardObject = result;
          this.dataLoaded = true;
          this.dashboardName = result['name'];

          if (result['components'].length) {
            this.topComponent = result['components'][0];
            if (this.topComponent['type'] != 'DIAGRAM') {
              this.topComponent['url'] = this.transform(this.topComponent['url'])
            }
            else {
              this.topComponent['url'] = this.transform(window.location.origin+'/assets/diagram/index.html?mode=view&index=' + (0));
            }
            this.topComponentType = result['components'][0]['type'];
            if (this.topComponent['type'] == 'DIAGRAM') {
              sessionStorage.setItem('jsonData_0', this.topComponent['data'])
            }
            // console.error(result['components'][1])
            if (result['components'][1]) {
              // this.bottomComponent = result['components'][1];
              if (result['components'][1]['type'] != 'DIAGRAM') {
                result['components'][1]['url'] = this.transform(result['components'][1]['url'])
              }
              else {
                result['components'][1]['url'] = this.transform(window.location.origin+'/assets/diagram/index.html?mode=view&index=' + (1));
              }
              this.bottomComponent = result['components'][1];
              this.bottomComponentType = result['components'][1]['type'];
              if (this.bottomComponent['type'] == 'DIAGRAM') {
                sessionStorage.setItem('jsonData_1', this.bottomComponent['data'])
              }
            }
          }
        }, (error: HttpErrorResponse) => {
          this.dataLoaded = true;
        })
    }
  }

  ngOnDestroy() {
    sessionStorage.removeItem('jsonData_0')
    sessionStorage.removeItem('jsonData_1')
    sessionStorage.removeItem('labels_0')
    sessionStorage.removeItem('labels_1')
  }

  goBack() {
    sessionStorage.removeItem('jsonData_0')
    sessionStorage.removeItem('jsonData_1')
    this.router.navigate(['clients', this.selectedClientId, this.selectedSiteId]);
  }

  addComponent(position) {
    if (position == 'top') {
      this.backupComponent = this.topComponent
      this.backupComponentType = this.topComponentType;
    }
    else {
      this.backupComponent = this.bottomComponent
      this.backupComponentType = this.bottomComponentType;
    }
    if (position == 'top' && this.topComponent != null) {
      this.edit(position);
      return;
    }
    else if (position == 'bottom' && this.bottomComponent != null) {
      this.edit(position);
      return;
    }
    this.dataLoaded = false;
    this.dashboardsService.getComponentsForSite(this.selectedClientId.split('#')[1],
      this.selectedSiteId.split('#')[1]).subscribe(data => {
        //console.log(data)
        this.dataLoaded = true;
        this.showDashboardList(position, data)
      }, (error: HttpErrorResponse) => {
        this.dataLoaded = true;
        // this.errorString = error.error.message;
        this.authService.updateErrorMessage(error.error.message);
        this.showDashboardList(position, {})

      })
  }

  showDashboardList(position, data) {
    const dialogRef = this.dialog.open(ComponentsListComponent, {
      width: 'fit-content',
      maxHeight: '95vh',
      // height: 'fit-content',
      // padding: '24px 0',
      // disableClose: true,
      data: { selectedClientId: this.selectedClientId, data }
    });
    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed', result);
      if (result && result !== 'new-quicksight') {
        this.dataLoaded = false;
        this.dashboardsService.getComponentDetails(this.selectedClientId.split('#')[1],
          this.selectedSiteId.split('#')[1], result).subscribe(response => {
            //console.log(response)
            if (response['url']) {
              response['url'] = this.transform(response['url'])
            }
            else {
              var index = position == top ? 0 : 1;
              response['url'] = this.transform(window.location.origin+'/assets/diagram/index.html?mode=view&index=' + (index));
              sessionStorage.setItem('jsonData_'+index, response['data']);
            }
            this.dataLoaded = true;
            this.state = "edit-" + position;
            position == 'top' ? this.topComponent = response : this.bottomComponent = response;
            position == 'top' ? this.topComponentType = "preset" : this.bottomComponentType = "preset";
          }, (err: any) => {
            // this.errorString = err.error.message;
            this.dataLoaded = true;
          })
      }
      if (result === 'new-graph') {
        this.dataLoaded = false;
        this.state = "edit-" + position;//https://thepaperkart.com/diagram
        this.dashboardsService.getAllSchemas(this.selectedClientId.split('#')[1], this.selectedSiteId.split('#')[1]).subscribe(data => {
          let labels = [];
          // console.error(data)
          try {
            data['duts'][0]['schema'].forEach(element => {
              labels.push(element['Name'])
            });
            if (position == 'top') {
              sessionStorage.setItem('labels_0', JSON.stringify(labels));
            }
            else {
              sessionStorage.setItem('labels_1', JSON.stringify(labels));
            }
            this.dataLoaded = true;
          }
          catch (e) {
            this.dataLoaded = true;
          }
          let response = { type: 'DIAGRAM', name:'', url: this.transform(window.location.origin+'/assets/diagram/index.html?mode=edit&index=' + (position == 'top' ? '0' : '1')) }
          position == 'top' ? this.topComponent = response : this.bottomComponent = response;
          position == 'top' ? this.topComponentType = "DIAGRAM" : this.bottomComponentType = "DIAGRAM";
          this.dataLoaded = true;
        })
      }
      if (result === 'new-quicksight') {
        this.dataLoaded = false;
        this.dashboardsService.authorComponent(this.selectedClientId.split('#')[1], this.selectedSiteId.split('#')[1], null).subscribe(response => {
          //console.log(response)
          this.dataLoaded = true;
          response['name'] = '';
          response['url'] = this.transform(response['url'])
          this.state = "edit-" + position;
          position == 'top' ? this.topComponent = (response) : this.bottomComponent = (response);
          position == 'top' ? this.topComponentType = "new" : this.bottomComponentType = "new";
        }, (err: any) => {
          this.authService.updateErrorMessage(err.error.message);
          this.dataLoaded = true;
        })
      }
    });
  }

  transform(url: string) {
    // console.error(url)
    let newUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    // console.error(newUrl)
    return newUrl;
  }

  loadFrame(type: string) {
    // if(type !== 'DIAGRAM'){
    //   return;
    // }
    // let elem:Element = document.getElementById("iframe")
    // let doc =  this.iframe.nativeElement.contentDocument || this.iframe.nativeElement.contentWindow;
    // console.error(doc);
  }

  edit(position: string) {
    // this.state='edit-'+position;
    // console.error()
    // console.error(position, this.topComponent, this.bottomComponent)
    if ((position == 'top' && this.topComponent['type'] == 'DIAGRAM') || (position == 'bottom' && this.bottomComponent['type'] == 'DIAGRAM')) {
      this.state = "edit-" + position;

      this.dashboardsService.getAllSchemas(this.selectedClientId.split('#')[1], this.selectedSiteId.split('#')[1]).subscribe(data => {
        let labels = [];
        // console.error(data)
        try {
          data['duts'][0]['schema'].forEach(element => {
            labels.push(element['Name'])
          });
          if (position == 'top') {
            sessionStorage.setItem('labels_0', JSON.stringify(labels));
          }
          else {
            sessionStorage.setItem('labels_1', JSON.stringify(labels));
          }
          this.dataLoaded = true;
        }
        catch (e) {
          this.dataLoaded = true;
        }
        let componentUrl = this.transform(window.location.origin+'/assets/diagram/index.html?mode=edit&index=' + (position == 'top' ? '0' : '1'))
        position == 'top' ? this.topComponent['url'] = componentUrl : this.bottomComponent['url'] = componentUrl;
        position == 'top' ? this.topComponentType = "DIAGRAM" : this.bottomComponentType = "DIAGRAM";
        this.dataLoaded = true;
      })
      return;
      // if (position == 'top') {
      //   this.topComponent['url'] = this.transform("https://oandmai.com/diagram/index.html?mode=edit&index=0");
      // }
      // else if (position == 'bottom') {
      //   this.topComponent['url'] = this.transform("https://oandmai.com/diagram/index.html?mode=edit&index=1");
      // }
      // this.dataLoaded = true;
      // return;
    }
    this.dataLoaded = false;
    let componentId = null;
    position == 'top' ? componentId = this.topComponent['id'] : componentId = this.bottomComponent['id'];
    // console.error('component ID', componentId)
    this.dashboardsService.authorComponent(this.selectedClientId.split('#')[1], this.selectedSiteId.split('#')[1], componentId).subscribe(response => {
      response['name'] = ''
      response['url'] = this.transform(response['url']);
      this.state = "edit-" + position;
      position == 'top' ? this.topComponent = response : this.bottomComponent = response;
      this.dataLoaded = true;
    }, (err: any) => {
      this.authService.updateErrorMessage(err.error.message);
    })
  }

  accept(position: string) {
    this.dataLoaded = false;
    // console.error(this.topComponent.name)
    if((position == 'top' &&  this.topComponent['type']=='DIAGRAM' &&!this.topComponent.name) || (position == 'bottom' &&  this.bottomComponent['type']=='DIAGRAM' && !this.bottomComponent.name)){
      this.componentNameError = "Component name should be non-empty";
      this.dataLoaded = true;
      return;
    }
    else{
      this.componentNameError="";
    }
    if (position == 'top' && this.topComponentType == 'new') {
      this.topComponent = null;
    }
    else if (position == 'bottom' && this.topComponentType == 'new') {
      this.bottomComponent = null;
    }
    // console.error(position, this.topComponentType, this.bottomComponentType)
    // console.error(this.topComponent, this.bottomComponent)
    if ((position == 'top' && this.topComponentType == 'DIAGRAM') || (position == 'bottom' && this.bottomComponentType == 'DIAGRAM')) {
      let diagramData = sessionStorage.getItem('jsonData_' + (position == 'top' ? '0' : '1'))
      if (diagramData) {
        let componentName = position == 'top' ? this.topComponent['name'] : this.bottomComponent['name'];
        let data =
          [{
            "name": componentName,
            "data": diagramData.split('\n').join(''),
            "integrationId": new Date().getTime(),
            "mappedSites": [this.selectedSiteId],
            "type": "DIAGRAM"
          }]
        // console.error('saving component')
        this.dataLoaded = false;

        // update component - diagram
        // console.error(this.topComponent, this.bottomComponent)
        if ((position == 'top' && this.topComponent['id']) || (position == 'bottom' && !this.topComponent['id'])) {
          let componentData = null;
          // delete (componentData['url'])
          position == 'top' ? componentData = this.topComponent : componentData = this.bottomComponent;
          componentData['data'] = diagramData;
          this.dashboardsService.updateComponent(this.selectedClientId.split('#')[1], componentData).subscribe(response => {
            // console.error(response);
            this.dataLoaded = true;
            let url = window.location.origin+"/assets/diagram/index.html?mode=preview&index=" + (position == 'top' ? '0' : '1');
            componentData['url'] = this.transform(url);
          },
            (error: HttpErrorResponse) => {
              this.dataLoaded = true;
            })
          this.state = 'edit-all';
          return;
        }

        // create component - diagram
        this.dashboardsService.createComponent(this.selectedClientId.split('#')[1], this.selectedSiteId.split('#')[1], JSON.stringify(data)).subscribe((data) => {
          this.dataLoaded = true;
          if (position == 'top') {
            this.topComponent = data[0];
            this.topComponent['url'] = this.transform(window.location.origin+"/assets/diagram/index.html?mode=preview&index=0")
          }
          else if (position == 'bottom') {
            this.bottomComponent = data[0];
            this.bottomComponent['url'] = this.transform(window.location.origin+"/assets/diagram/index.html?mode=preview&index=1")
          }
        }, (error: HttpErrorResponse) => {
          // console.error(error)
          this.dataLoaded = true;
        });
        // this.
        // );
      }
      debugger;
      this.dataLoaded = true;
      if (position == 'top') {
        this.topComponent['url'] = this.transform(window.location.origin+"/assets/diagram/index.html?mode=preview&index=0")
      }
      else if (position == 'bottom') {
        this.bottomComponent['url'] = this.transform(window.location.origin+"/assets/diagram/index.html?mode=preview&index=1")
      }

      // console.error(this.topComponent, this.bottomComponent)
    } else {
      // console.error(this.topComponentType, this.bottomComponentType)
      if (position == 'top') {
        if (this.backupComponentType && this.backupComponent) {
          this.topComponentType = this.backupComponentType;
          this.topComponent = this.backupComponent;
        }
      }
      else if (position == 'bottom') {
        if (this.backupComponentType && this.backupComponent) {
          this.bottomComponentType = this.backupComponentType;
          this.bottomComponent = this.backupComponent;
        }
      }
    }

    this.state = 'edit-all';
    if (!((position == 'top' && this.topComponentType == 'DIAGRAM') || position == 'bottom' && this.bottomComponentType == 'DIAGRAM')) {
      this.refreshDashboards();
      this.dataLoaded = true;
    }
  }

  saveDashboard() {
    // this.authService.isToolbarSubscribed = false;
    // this.authService.updateUserData({'selectedClientId':null,'selectedSiteId':null})
    this.dataLoaded = false;
    let components = [];
    if (this.topComponent && this.topComponent["id"])
      components.push(this.topComponent['id'])
    if (this.bottomComponent && this.bottomComponent["id"])
      components.push(this.bottomComponent['id'])
    let data = {
      name: this.dashboardName,
      isHome: "false",
      components: components
    }
    if (this.mode == 'create') {
      this.dashboardsService.saveDashboard(this.selectedClientId.split('#')[1], this.selectedSiteId.split('#')[1], data)
        .subscribe(response => {
          this.dataLoaded = true;
          if (typeof (this.route.snapshot.params.token) !== 'undefined' && this.route.snapshot.params.token) {
            location.replace('https://www.google.com')
          }
          else {
            this.router.navigate(['clients', this.selectedClientId, this.selectedSiteId]);
          }
          // http://localhost:4200/clients/client%2396369/site%2393979
        }, (error: HttpErrorResponse) => {
          this.dataLoaded = true;
          // this.errorString = error.error.message;
          this.authService.updateErrorMessage(error.error.message);
        })
    }
    else {
      data["status"] = "active";
      this.dashboardsService.updateDashboard(this.selectedClientId.split('#')[1],
        this.selectedSiteId.split('#')[1],
        this.selectedDashboardId.split('#')[1], data)
        .subscribe(response => {
          this.dataLoaded = true;
          if (typeof (this.route.snapshot.params.token) !== 'undefined' && this.route.snapshot.params.token) {
            sessionStorage.removeItem('jsonData_0')
            sessionStorage.removeItem('jsonData_1')
            location.replace('https://www.google.com')
          }
          else {
            sessionStorage.removeItem('jsonData_0')
            sessionStorage.removeItem('jsonData_1')
            this.router.navigate(['clients', this.selectedClientId, this.selectedSiteId]);
          }
          // http://localhost:4200/clients/client%2396369/site%2393979
        }, (error: HttpErrorResponse) => {
          this.dataLoaded = true;
          // this.errorString = error.error.message;
          this.authService.updateErrorMessage(error.error.message);
        })
    }
  }

  refreshDashboards() {
    this.dashboardsService.refreshDashboard(this.selectedClientId.split('#')[1], this.selectedSiteId.split('#')[1]).subscribe(response => { }, (err: any) => {
      // this.errorString = err.error.message;
      this.authService.updateErrorMessage(err.error.message);
    })
  }

  joinTables() {
    //console.log(this.selectedClientId);
    this.router.navigate([
      'jointables',
      this.selectedClientId, this.selectedSiteId,
    ]);
  }

  delete(position) {
    if (position == 'top') {
      this.topComponent = null;
      sessionStorage.removeItem('jsonData_0')
      sessionStorage.removeItem('labels_0')
    }
    else if (position == 'bottom') {
      this.bottomComponent = null;
      sessionStorage.removeItem('jsonData_1')
      sessionStorage.removeItem('labels_1')
    }
    this.state = 'edit-all'
  }
}

