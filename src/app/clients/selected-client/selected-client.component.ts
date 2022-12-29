import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ClientsService } from '../clients.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersComponent } from '../../users/users.component';
import { MatDialog } from '@angular/material/dialog';
import { AddSiteComponent } from '../add-site/add-site.component';
import { AuthService } from '../../auth.service'
import { CreateApplicationComponent } from '../../applications/create-application/create-application.component'
import { WellsService } from '../../wells/wells.service'
import { Observable, of } from 'rxjs';
import { forkJoin } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApplicationsService } from '../../applications/applications.service'
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'
import { DomSanitizer } from '@angular/platform-browser';
import { DashboardsService } from '../../dashboards/dashboards.service';
import { AlertService } from '../../shared/alert.service'
import * as xml2js from 'xml2js';
import { ImagecropperComponent } from 'src/app/shared/imagecropper/imagecropper.component';



@Component({
  selector: 'app-selected-client',
  templateUrl: './selected-client.component.html',
  styleUrls: ['./selected-client.component.scss'],
})
export class SelectedClientComponent implements OnInit {

  apiLoaded: Observable<boolean>;
  fileUrl: any = "";
  selectedClientId: string = null;
  selectedSiteId: string = null;
  clientInfo: any = null;
  selectedClientSites: any[];
  selectedClientUsers: any[];
  shifts: any[] = [];
  dutConfig: any = null;
  selectedSiteIndex: number = -1;
  isClientActive: boolean = true;
  dataLoaded: boolean = false;
  role: string = '';
  errorString = "";
  private userInfo;
  getDashboardsCount: number =0;
  siteFields = {
    'name': { fieldName: 'name', mode: 'view', oldValue: null },
    'customSiteId': { fieldName: 'customSiteId', mode: 'view', oldValue: null },
    'line1': { fieldName: 'line1', mode: 'view', oldValue: null },
    'line2': { fieldName: 'line2', mode: 'view', oldValue: null },
    'city': { fieldName: 'city', mode: 'view', oldValue: null },
    'state': { fieldName: 'state', mode: 'view', oldValue: null },
    'country': { fieldName: 'country', mode: 'view', oldValue: null },
    'zipCode': { fieldName: 'zipCode', mode: 'view', oldValue: null },
    'dropboxLink': { fieldName: 'dropboxLink', mode: 'view', oldValue: null }
  }
  selectedSiteApplications: any[];
  selectedSiteWells: any[];
  activeWells: number = 0;
  inactiveWells: number = 0;
  selectedSiteApplicationIndex: number = 0;
  newApplicationId: string = null;
  mapMarkers = [];
  mapType: string = 'satellite';
  defaultLat: number = 41.008510;
  defaultLng: number = -102.428553;
  groupPermissions: object = null;
  userPermissions: object = null;

  map: google.maps.Map;
  readonly icons: object = {
    active: {
      icon: "assets/well_active.png",
    },
    inactive: {
      icon: "assets/well_inactive.png",
    }
  }


  fileToUpload: string;
  logoImage: string | ArrayBuffer;
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('pdfFileInput') pdfFileInput: ElementRef;
  @ViewChild('siteName', { static: false }) siteName: ElementRef;
  @ViewChild('configFileInput', { static: false }) configFileInput: ElementRef;
  @ViewChild('dataFileInput', { static: false }) dataFileInput: ElementRef;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  addressJsonRes: any;
  bounds: google.maps.LatLngBounds;

  constructor(
    private clientsService: ClientsService,
    private dashboardsService: DashboardsService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private wellsService: WellsService,
    private httpClient: HttpClient,
    private applicationsService: ApplicationsService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {    
    this.userInfo = this.authService.getUserInfo();  
    let siteId = null;
    siteId = sessionStorage.getItem('selectedSiteId')
    sessionStorage.removeItem('selectedSiteId')
    this.getAllData(siteId);  
    this.role = this.authService.getRole();
    this.groupPermissions = this.authService.getPermission('userGroups')
    this.userPermissions = this.authService.getPermission('users')  
  }

  getAllData(siteId: string) {
    this.selectedClientId = decodeURIComponent(this.route.snapshot.params.id);
    this.selectedSiteId = decodeURIComponent(this.route.snapshot.params.siteId);
  // this.dataLoaded = false;
    if (siteId){
      this.selectedSiteId = siteId;
      siteId = null;
    }
    this.clientsService.getClientsById(this.selectedClientId.split('#')[1]).subscribe((client) => {
      // data['clients'].forEach((client) => {
        // if (client.sortKey == this.selectedClientId) {
          this.clientInfo = client;
          if (this.role !== 'super-admin') {
            const clientData = { logo: this.clientInfo['logo'], name: this.clientInfo['name'] }
            this.authService.setClientInfo(clientData);
            // this.authService.updateUserData({selectedClientId: this.selectedClientId, selectedSiteId: this.selectedClientSites[this.selectedSiteIndex]})
          }
          //console.log(this.clientInfo);
          this.getSites();
          // this.dataLoaded = false;
        // }
      // });
      setTimeout(() => {
        this.drawWells();
        this.dataLoaded = true;

      }, 5000);
    }, (httpError: HttpErrorResponse) => {
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    });
  }

  isAllowed(key: string, type: string) {
    return this.authService.isAllowed(key, type);
  }

  getdutconfig() {
    const clientId = this.selectedClientId.split('#')[1];
    const siteId = this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1];
    this.clientsService.getDutConfig(clientId, siteId).subscribe((res: any) => {
      this.dutConfig = null;
      if (res && res.config) {
        let configHex = [res.config].join('');
        let file = URL.createObjectURL(this.toPngBlob(configHex));
        if (file)
          this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(file);
        this.dutConfig = res;
      }

    }, (httpError: HttpErrorResponse) => {
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  toPngBlob(hexdata) {
    var byteArray = new Uint8Array(hexdata.length / 2);
    for (var x = 0; x < byteArray.length; x++) {
      byteArray[x] = parseInt(hexdata.substr(x * 2, 2), 16);
    }
    var blob = new Blob([byteArray], { type: "application/octet-stream" });
    return blob;
  };

  drawWells() {
    // if (!this.selectedSiteWells || !this.selectedSiteWells.length)
    //   return;
    this.mapMarkers = [];
    try{
      this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        center: { lat: this.defaultLat, lng: this.defaultLng },
        zoom: 4,
      });
    }
    catch(e){}
    if(this.selectedSiteWells)
     this.bounds = new google.maps.LatLngBounds();

    this.selectedSiteWells.forEach(well => {
      const position = { lat: parseFloat(well['latitude']), lng: parseFloat(well['longitude']) }
      //console.log(well.status)
      const marker = new google.maps.Marker({
        position: position,
        icon: this.icons[well.status].icon,
        map: this.map,
        title: well.name
      });
      this.bounds.extend(position);
      this.mapMarkers.push(marker);
    });

      this.map.fitBounds(this.bounds);
    // console.error(this.mapMarkers)

}
    
  getSites() {
    const clientId = this.selectedClientId.split('#')[1];
    this.clientsService.getSites(clientId).subscribe((sitesData) => {
      //console.log(this.selectedSiteIndex);
      this.selectedClientSites = sitesData['sites'];
      if (this.selectedClientSites.length > 0 && this.selectedSiteIndex == -1)
        this.selectedSiteIndex = 0;        
      if (this.selectedSiteId)
        this.selectedClientSites.forEach((site, index) => {
          this.selectedSiteId == site.sortKey
            ? (this.selectedSiteIndex = index)
            : null;
          // site['siteLayouts'] = JSON.parse(site['siteLayouts'])
          // site['emergencyContacts'] = JSON.parse(site['emergencyContacts'])
        });

      if (this.selectedClientSites.length > 0)
        this.authService.updateUserData({
          selectedClientId: this.selectedClientId,
          selectedSiteId: this.selectedClientSites[this.selectedSiteIndex].sortKey
        })
        //console.log('selectedSiteIndex', this.selectedSiteIndex);
        if(this.selectedSiteIndex>=0){
          sessionStorage.setItem('selectedSite',this.selectedClientSites[this.selectedSiteIndex].name);
          // sessionStorage.setItem('selectedSiteId',this.selectedClientSites[this.selectedSiteIndex].sortKey);
        }
        if(!this.selectedClientSites || !this.selectedClientSites.length){
          this.dataLoaded = true;
          return;
        }
        try{
          this.getUsers();
          this.getDashboards();
          this.getApplications(null);
          this.getWells();
          this.getdutconfig();
          this.getAlerts();
          this.getShifts();
        }
        catch(e){}
    }, (httpError: HttpErrorResponse) => {
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    });
  }

  shiftUser(index: number, shift: string) {
    let emergencyContacts = this.selectedClientSites[this.selectedSiteIndex][
      'emergencyContacts'
    ];
    let temp = emergencyContacts[index];
    if (shift == 'up') {
      emergencyContacts[index] = emergencyContacts[index - 1];
      emergencyContacts[index - 1] = temp;
    } else if (shift == 'down') {
      emergencyContacts[index] = emergencyContacts[index + 1];
      emergencyContacts[index + 1] = temp;
    }
    this.updateEmergencyContacts(emergencyContacts);
  }

  deleteUser(index: number) {
    let emergencyContacts = this.selectedClientSites[this.selectedSiteIndex][
      'emergencyContacts'
    ];
    emergencyContacts.splice(index, 1);
    this.updateEmergencyContacts(emergencyContacts);
  }

  updateEmergencyContacts(contacts: any[]) {
    let selectedSite =      
      this.selectedClientSites[this.selectedSiteIndex].sortKey || this.selectedSiteId;
    let selectedClient = this.selectedClientId.split('#')[1];
    selectedSite = selectedSite.split('#')[1];
    // console.error(this.selectedSiteId,
      // this.selectedClientSites[this.selectedSiteIndex].sortKey)
    // console.error(selectedSite);
    this.clientsService
      .updateEmergencyContacts(selectedClient, selectedSite, contacts)
      .subscribe((response) => {
        //console.log(response);
      }, (httpError: HttpErrorResponse) => {
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      });
  }
  getReadableCount(number: number) {
    if (number % 10 == 1) return number + 'st';
    if (number % 10 == 2) return number + 'nd';
    if (number % 10 == 3) return number + 'rd';
    return number + 'th';
  }

  getUsers() {
    const clientId = this.selectedClientId.split('#')[1];
    this.clientsService.getUsers(clientId).subscribe((userData) => {
      //console.log(userData);
      this.selectedClientUsers = userData['userInfo'];
      this.processUsersData(this.selectedClientUsers);
      //console.log(this.selectedClientUsers);
      // this.getShifts();
      this.dataLoaded = true;
    }, (httpError: HttpErrorResponse) => {
      //this.errorString = err.error.message;
      this.dataLoaded = true;
      this.authService.updateErrorMessage(httpError['error']['message']);
    });
  }

  getApplications(result) {
    const clientId = this.selectedClientId.split('#')[1];
    const siteId = this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1];
    this.applicationsService.getApplications(clientId, siteId).subscribe(response => {
      //console.log(response)
      this.selectedSiteApplications = response['applications'];
      if(result){
        this.selectedSiteApplications.forEach((application, index) =>{
          if(application.sortKey == result){
            this.selectedSiteApplicationIndex = index;
          }
        })
      }
      this.authService.updateAppData(response);
    }, (httpError: HttpErrorResponse) => {
     // this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  getDashboards() {
    const clientId = this.selectedClientId.split('#')[1];
    const siteId = this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1];

    this.dashboardsService.getDashboards(clientId, siteId).subscribe(response => {
      // console.error(response['dashboards'],clientId,siteId)
      this.authService.updateDashboardsData(response['dashboards']);
      this.getDashboardsCount = response['dashboards'].length;
      let firstAttempt = sessionStorage.getItem('firstAttempt');
      // firstAttempt = 'true'; // TEMP---made to disable the routing
      // console.error(!firstAttempt , this.role=='client' , this.isAllowed('dashboard','view') , response)
      if(!firstAttempt && this.role=='client' && this.isAllowed('dashboard','view') && response && response['dashboards'] && response['dashboards'].length){
        sessionStorage.setItem('firstAttempt','true');
        this.router.navigate(['dashboards', this.selectedClientId,
        this.selectedClientSites[this.selectedSiteIndex].sortKey, response['dashboards'][0].sortKey]);
      }      
    })
  }


  getAlerts() {
    const clientId = this.selectedClientId.split('#')[1];
    const siteId = this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1];
    this.alertService.getAllAlerts(clientId, siteId, this.authService.getAuthToken()).subscribe(data => {
    this.authService.updateAlertsData(data);
    })
  }

  getWells() {
    this.activeWells = this.inactiveWells = 0;
    this.mapMarkers = [];
    const clientId = this.selectedClientId.split('#')[1];
    const siteId = this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1];
    this.wellsService.getAllWells(clientId, siteId).subscribe(response => {
      //console.log('wells', response)
      this.selectedSiteWells = response['wells'];
      this.selectedSiteWells.forEach(well => {
        if (well['status'] == 'active') {
          this.activeWells += 1;
        }
        else if (well['status'] == 'inactive') {
          this.inactiveWells += 1;
        }
      });
      setTimeout(() => {
        this.drawWells();
      }, 3000);
    }, (httpError: HttpErrorResponse) => {
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  selectSite(index: number) {
    this.selectedSiteIndex = index;
    // console.error('updating')
    sessionStorage.setItem('selectedSite',this.selectedClientSites[this.selectedSiteIndex].name);
    // sessionStorage.setItem('selectedSiteId',this.selectedClientSites[this.selectedSiteIndex].sortKey);
    this.authService.updateUserData({ selectedClientId: this.selectedClientId, selectedSiteId: this.selectedClientSites[this.selectedSiteIndex].sortKey })
    
    this.getUsers();
    this.getDashboards();
    this.getApplications(null);
    this.getWells();
    this.getdutconfig();
    this.getAlerts();
    this.getShifts();    
    this.router.navigate(['clients', this.selectedClientId, this.selectedClientSites[this.selectedSiteIndex].sortKey]);
  }
  processUsersData(userData: any[]) {
    let userGroups = userData['userGroups'];
    let users = userData['users'];
    let processedUsers = {};
    users.forEach((user) => {
      processedUsers[user.sortKey] = user;
    });
    // userGroups.forEach(group => {
    //   group.userList = JSON.parse(group.userList);
    // });
    userData['usersObject'] = processedUsers;
  }

  getLayoutName(path) {
    if (path.trim().length == 0) return '';
    return decodeURIComponent(path.split('/').slice(-1)[0]);
  }
  joinTables(){
    //console.log(this.selectedClientId);
    this.router.navigate([
      'jointables',
      this.selectedClientId,
      this.selectedClientSites[this.selectedSiteIndex].sortKey,
    ]);
  }
  viewWells() {
    //console.log(this.selectedClientId);
    this.router.navigate([
      'wells',
      this.selectedClientId,
      this.selectedClientSites[this.selectedSiteIndex].sortKey,
    ]);
    // this.router.navigate([
    //   'jointables',
    //   this.selectedClientId,
    //   this.selectedClientSites[this.selectedSiteIndex].sortKey,
    // ]);
  }
  goBack() {
    this.router.navigate(['clients', 'view', this.selectedClientId]);
  }

  openApplication() {
    this.router.navigate([
      'applications',
      this.selectedClientId.split('#')[1],
      this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1],
      this.selectedSiteApplications[this.selectedSiteApplicationIndex].sortKey.split('#')[1]
    ]);
  }

  manageShifts() {
    // //console.log(this.selectedClientId,this.selectedClientSites[this.selectedSiteIndex].sortkey)
    this.router.navigate([
      'shifts',
      this.selectedClientId,
      this.selectedClientSites[this.selectedSiteIndex].sortKey,
    ]);
  }

  addSite() {
    const dialogRef = this.dialog.open(AddSiteComponent, {
      data: {
        clientId: this.selectedClientId.split('#')[1],
        // siteId:this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1]
      },
      width: '592px',
      height: '592px',
      disableClose: true,
      panelClass: 'modal-user',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result['data'] && result['data']['sortKey']){
        this.dataLoaded = false;
        this.getAllData(result['data']['sortKey'])
      }
      else
        this.getAllData(this.selectedClientSites[this.selectedSiteIndex]['sortKey']);
    });
  }

  getShifts() {
    // if(!this.selectedSiteIndex || typeof(this.selectedClientSites[this.selectedSiteIndex])== 'undefined')
    // {
    //   this.dataLoaded = true;
    //   return;
    // }
      try {
        this.clientsService
          .getShifts(
            this.selectedClientId.split('#')[1],
            this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1]
          )
          .subscribe((response) => {
            //console.log(response);
            this.dataLoaded = true;
            this.shifts = response['shifts'];
          }, (httpError:HttpErrorResponse) => {
            //this.errorString = err.error.message;
            this.dataLoaded = true;
            this.authService.updateErrorMessage(httpError['error']['message']);
            
          });
      } catch (e) {
        console.error(e);
      }
    
   
  }

  addUsers() {
    const inactiveUsers = [];
    this.selectedClientUsers['users'].forEach(user =>{
      if(user.status =='suspended'){
        inactiveUsers.push(user.sortKey)
      }
    });
    const dialogRef = this.dialog.open(UsersComponent, {
      data: {
        clientId: this.selectedClientId.split('#')[1],
        siteId: this.selectedClientSites[this.selectedSiteIndex].sortKey.split(
          '#'
        )[1],
        forSite: true,
        presentContacts: this.selectedClientSites[this.selectedSiteIndex]['emergencyContacts'],
        inactiveUsers: inactiveUsers
      },
      width: '592px',
      panelClass: 'modal-user',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result.length) return;
      let emergencyContacts = this.selectedClientSites[this.selectedSiteIndex][
        'emergencyContacts'
      ].concat(result);
      //console.log(emergencyContacts);
      this.updateEmergencyContacts(emergencyContacts);
      this.selectedClientSites[this.selectedSiteIndex][
        'emergencyContacts'
      ] = emergencyContacts;
    });
  }

  inlineFieldChangeMode(fieldName: string, mode: string) {
    if (mode == 'edit') {
      if (fieldName == 'name') {
        this.siteName.nativeElement.focus();
      }
      if (fieldName != 'line1')
        this.siteFields[fieldName]['oldValue'] = this.selectedClientSites[
          this.selectedSiteIndex
        ][fieldName];
      else {
        this.siteFields['line1']['oldValue'] = this.selectedClientSites[
          this.selectedSiteIndex
        ]['address']['line1'];
        this.siteFields['line2']['oldValue'] = this.selectedClientSites[
          this.selectedSiteIndex
        ]['address']['line2'];
        this.siteFields['city']['oldValue'] = this.selectedClientSites[
          this.selectedSiteIndex
        ]['address']['city'];
        this.siteFields['state']['oldValue'] = this.selectedClientSites[
          this.selectedSiteIndex
        ]['address']['state'];
        this.siteFields['zipCode']['oldValue'] = this.selectedClientSites[
          this.selectedSiteIndex
        ]['address']['zipCode'];
      }
    }
    this.siteFields[fieldName]['mode'] = mode;
  }

  inlineFieldUpdate(fieldName: string) {
    let name = '';
    let data = {};
    if (fieldName !== 'line1') {
      name = this.siteFields[fieldName]['fieldName'];
      data[name] = this.selectedClientSites[this.selectedSiteIndex][fieldName];
    } else {
      data['address'] = {};
      data['address']['line1'] = this.selectedClientSites[
        this.selectedSiteIndex
      ]['address']['line1'];
      data['address']['line2'] = this.selectedClientSites[
        this.selectedSiteIndex
      ]['address']['line2'];
      data['address']['city'] = this.selectedClientSites[
        this.selectedSiteIndex
      ]['address']['city'];
      data['address']['state'] = this.selectedClientSites[
        this.selectedSiteIndex
      ]['address']['state'];
      data['address']['country'] = this.selectedClientSites[
        this.selectedSiteIndex
      ]['address']['country'];
      data['address']['zipCode'] = this.selectedClientSites[
        this.selectedSiteIndex
      ]['address']['zipCode'];
    }
    this.dataLoaded = false;
    this.clientsService
      .updateSite(
        data,
        this.selectedClientId.split('#')[1],
        this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1]
      )
      .subscribe((response) => {
        this.siteFields[fieldName]['mode'] = 'view';
        this.dataLoaded = true;
      },
        (httpError: HttpErrorResponse) => {
          this.siteFields[fieldName]['mode'] = 'view';
          this.dataLoaded = true;
         // this.errorString = error.error.message;
          this.authService.updateErrorMessage(httpError['error']['message']);
        });
  }



  isAddressValid(){


    this.dataLoaded = false;
  //  //console.log('data-----', data);
    let addressDetails = '<AddressValidateRequest USERID="325HUSHT1273">'+
    '<Revision>1</Revision>'+
    '<Address ID="0">'+
    '<Address1>'+ this.selectedClientSites[this.selectedSiteIndex]['address']['line1']  + '</Address1>'+
    '<Address2>'+ this.selectedClientSites[this.selectedSiteIndex]['address']['line2'] + '</Address2>'+
    '<City/>'+
    '<State>'+ this.selectedClientSites[this.selectedSiteIndex]['address']['state']  + '</State>'+
    '<Zip5>'+  this.selectedClientSites[this.selectedSiteIndex]['address']['zipCode'] + '</Zip5>'+
    '<Zip4/>'+
    '</Address>'+
    '</AddressValidateRequest>';

    //console.log('addressDetails', addressDetails);
    this.clientsService.verifyAddress(addressDetails).subscribe((response) => {
      //console.log('address validation  Response:', response);

    },(err:any)=>{

  this.dataLoaded = true;
  if(err.error.text.includes('Error')){

    //console.log('if',err.error.text.includes('Error'));

    //this.errorString = 'Address Not Found.';
    this.authService.updateErrorMessage('Address Not Found.');

  }else{

    const parser = new xml2js.Parser({ strict: false, trim: true });
    parser.parseString(err.error.text, (err, result) => {
      this.addressJsonRes = result;

      //console.log('verified address Response', this.addressJsonRes);
      //console.log('verified address Response', this.addressJsonRes);

      this.selectedClientSites[this.selectedSiteIndex]['address']['line1'] = '';
      this.selectedClientSites[this.selectedSiteIndex]['address']['line2']= '';
      this.selectedClientSites[this.selectedSiteIndex]['address']['city']= '';
      this.selectedClientSites[this.selectedSiteIndex]['address']['state']= '';


      if(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1){
       // this.line2 = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1[0];
       this.selectedClientSites[this.selectedSiteIndex]['address']['line2']= this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1[0];
      }

      this.selectedClientSites[this.selectedSiteIndex]['address']['line1']  = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS2[0];
      this.selectedClientSites[this.selectedSiteIndex]['address']['zipCode'] = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ZIP5[0];
      this.selectedClientSites[this.selectedSiteIndex]['address']['city'] = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].CITY[0];
      this.selectedClientSites[this.selectedSiteIndex]['address']['state'] = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].STATE[0];

    });

    //  this.inlineFieldUpdate('address' ,data );
    //console.log('else',err.error.text.includes('Error'));
     this.inlineFieldUpdate('line1');

  }

});

  }

  inlineFieldCancel(fieldName: string) {
    if (fieldName !== 'line1')
      this.selectedClientSites[this.selectedSiteIndex][
        fieldName
      ] = this.siteFields[fieldName]['oldValue'];
    else {
      this.selectedClientSites[this.selectedSiteIndex]['address'][
        'line1'
      ] = this.siteFields['line1']['oldValue'];
      this.selectedClientSites[this.selectedSiteIndex]['address'][
        'line2'
      ] = this.siteFields['line2']['oldValue'];
      this.selectedClientSites[this.selectedSiteIndex]['address'][
        'city'
      ] = this.siteFields['city']['oldValue'];
      this.selectedClientSites[this.selectedSiteIndex]['address'][
        'state'
      ] = this.siteFields['state']['oldValue'];
      this.selectedClientSites[this.selectedSiteIndex]['address'][
        'zipCode'
      ] = this.siteFields['zipCode']['oldValue'];
      this.siteFields['line1']['mode'] = 'view';
    }
    this.siteFields[fieldName]['mode'] = 'view';
  }

  changeSiteStatus() {
    let action = '';
    if (
      this.selectedClientSites[this.selectedSiteIndex]['status'] == 'active'
    ) {
      action = 'deactivate';
    } else if (
      this.selectedClientSites[this.selectedSiteIndex]['status'] == 'inactive'
    ) {
      action = 'activate';
    }
    this.dataLoaded = false;
    this.clientsService
      .activateDeactivateSite(
        this.selectedClientId.split('#')[1],
        this.selectedClientSites[this.selectedSiteIndex]['sortKey'].split(
          '#'
        )[1],
        action
      )
      .subscribe((response) => {
        //console.log(response);
        if (action == 'deactivate') {
          this.selectedClientSites[this.selectedSiteIndex]['status'] =
            'inactive';
        } else if (action == 'activate') {
          this.selectedClientSites[this.selectedSiteIndex]['status'] = 'active';
        }
        this.dataLoaded = true;
      }, (httpError: HttpErrorResponse) => {
       // this.errorString = err.error.message;
       this.dataLoaded = true;
        this.authService.updateErrorMessage(httpError['error']['message']);
      });
  }

  deleteSite() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      if (result == 'ok') {
        this.dataLoaded = false;
        this.clientsService
          .deleteSite(
            this.selectedClientId.split('#')[1],
            this.selectedClientSites[this.selectedSiteIndex]['sortKey'].split(
              '#'
            )[1]
          )
          .subscribe((response) => {
            //console.log(response);
            this.selectedClientSites.splice(this.selectedSiteIndex, 1);
            if (this.selectedClientSites.length <= this.selectedSiteIndex) {
              this.selectedSiteIndex = this.selectedClientSites.length - 1;
            }
            this.dataLoaded = true;
          }, (httpError: HttpErrorResponse) => {
            //this.errorString = err.error.message;
            this.dataLoaded = true;
            this.authService.updateErrorMessage(httpError['error']['message']);
          });
      }
    });
  }

  getPhoto(url: string) {
    return typeof url !== 'undefined' && url
      ? url
      : 'assets/sample-site-image.png';
  }

uploadAppFiles(event, files: FileList, type: string) {
  if(files.length > 5){
    this.dataLoaded = true;
    this.authService.updateErrorMessage("Maximum 5 Files Are Allowed");
    return;
  }
  this.dataLoaded = false;
  let uploadCalls = [];
  if (files && files.length > 0) {
   
    var bar = new Promise((resolve, reject) => {
    for (let i = 0; i < files.length; i++) {
      var file: File = files.item(i);
      if(!file.name.split('.')[1].includes('csv'))
      {
        if(files.length-1 == i)
          this.dataLoaded = true;
        event.target.value = null;  
        this.authService.updateErrorMessage('Please upload a valid file');
        this.dataLoaded = true;        
        break;
      }
      if(file.size / 1000000 >4){
        this.authService.updateErrorMessage('File size cannot exceed 4MB');
        // return;
        break;
      }
      let reader: FileReader = new FileReader();
      try{
          reader.readAsText(file);
          reader.onload = (e) => {
            let csv: string = reader.result as string;
            console.log('csv', csv)
            try{
              csv = "data:@file/csv;base64," + btoa(csv)
            }
            catch(e){
              this.dataLoaded = true;
              event.target.value = null;
              this.authService.updateErrorMessage('Please upload a valid file');
              return;
            }
            let data = {};
            data[type] = csv;
            let uploadcall = this.applicationsService.updateConfigSchemaOrData(
              this.selectedClientId.split('#')[1],
              this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1],
              this.selectedSiteApplications[this.selectedSiteApplicationIndex].sortKey.split('#')[1],
              data, type);
              uploadCalls.push(uploadcall);
              if (files.length === uploadCalls.length) {resolve(true);            
              }
          }
          reader.onerror = (e) =>{
            this.authService.updateErrorMessage('Please upload a valid file');
            this.dataLoaded = true;
          }
      }
      catch(e){
        this.authService.updateErrorMessage('Please upload a valid file');
        this.dataLoaded = true;        
      }
    }
  }).then(()=>{
    forkJoin(uploadCalls).subscribe((res:any)=>{
      this.getAllData(null);
      this.showMessage('Data upload initiated successfully');
      this.dataLoaded = true;
    }, (httpError:HttpErrorResponse) => {
          
      //this.showMessage('Could not upload file');
      this.dataLoaded = true;
      //this.errorString = error['error']['message'];
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  })
}
  
}
  handleFileInput(event,files: FileList, type: string) {
    //
    this.fileToUpload = files[0].name;
    // console.error(this.fileToUpload)
    
    if(files[0].size / 1000000 >4){
      this.authService.updateErrorMessage('File size cannot exceed 4MB');
      // return;
      return;
    }
    // console.error(files[0].type)
    if (type == 'site-image')
      this.readImage(event,files);
    else if (type == 'site-layout')
      this.readPDF(event, files);
    else if (type == 'app-config')
      this.readCSV(event, files, 'schema');
    else if (type == 'app-data'){
      //this.readCSV(files, 'data');
      this.uploadAppFiles(event, files,'data');
    }
  }

  readCSV(event, files: any, type: string): void {
    //console.log(files);
    if (files && files.length > 0) {
      let file: File = files.item(0);
      if(!file.name.split('.')[1].includes('csv'))
      {
        this.dataLoaded = true;
        event.target.value = null;
        this.authService.updateErrorMessage('Please upload a valid file');
        return;
      }
      this.dataLoaded = false;
      let reader: FileReader = new FileReader();
      try{
        reader.readAsText(file);
        reader.onload = (e) => {
          let csv: string = reader.result as string;
          // console.log('csv', csv)
          try{
            csv = "data:@file/csv;base64," + btoa(csv)
          }
          catch(e){
            this.dataLoaded = true;
            event.target.value = null;
            this.authService.updateErrorMessage('Please upload a valid file');
            return;
          }
          let data = {};
          data[type] = csv;
          this.applicationsService.updateConfigSchemaOrData(
            this.selectedClientId.split('#')[1],
            this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1],
            this.selectedSiteApplications[this.selectedSiteApplicationIndex].sortKey.split('#')[1],
            data, type).
            subscribe(response => {
              // //console.log('layout added', response)
              this.getAllData(null);
              this.showMessage('Configuration is uploaded successfully');
              this.dataLoaded = true;
            }, (httpError:HttpErrorResponse) => {
              
              //this.showMessage('Could not upload file');
              this.dataLoaded = true;
              //this.errorString = error['error']['message'];
              this.authService.updateErrorMessage(httpError['error']['message']);
            })
        }
        reader.onerror = (e) =>{
          this.authService.updateErrorMessage('Please upload a valid file');
          this.dataLoaded = true;
        }
      }
      catch(e){
        this.authService.updateErrorMessage('Please upload a valid file');
        this.dataLoaded = true;
      }
    }
  }

  readPDF(event, inputValue: any): void {
    var file: File = inputValue[0];
    var myReader: FileReader = new FileReader();
    let fileName = file.name;
    this.dataLoaded = false;
    if(!fileName.split('.')[1].includes('pdf') )
    {
      this.dataLoaded = true;
      event.target.value = null;  
      this.authService.updateErrorMessage('Please upload a valid file');
      return;
    }
    myReader.onloadend = (e) => {
      let newLayout = myReader.result;
      this.dataLoaded = false;
      this.clientsService.addLayout(this.selectedClientId.split('#')[1],
        this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1], fileName, { 'layout': newLayout }).
        subscribe(response => {
          this.dataLoaded = true;
          // //console.log('layout added', response)
          this.getAllData(null);
          this.dataLoaded = true;
        }, (httpError: HttpErrorResponse) => {
          this.dataLoaded = true;
          //this.errorString = error.error.message;
          this.authService.updateErrorMessage(httpError['error']['message']);
        })
    }
    myReader.onerror = (e) =>{
      this.authService.updateErrorMessage('Please upload a valid file');
      this.dataLoaded = true;
    }
    myReader.readAsDataURL(file);
  }

  readImage(event,inputValue: any): void {
    var file: File = inputValue[0];
    let fileToUpload = file.name;
    //console.log(fileToUpload.split('.')[1])
    if(!fileToUpload.split('.')[1].includes('jpg') && !fileToUpload.split('.')[1].includes('jpeg') && !fileToUpload.split('.')[1].includes('png'))
    {
      this.dataLoaded = true;
      event.target.value = null;  
      this.authService.updateErrorMessage('Please upload a valid file');
      return;
    }
    const dialogRef = this.dialog.open(ImagecropperComponent,{data:{
      file:event,
      ratio:2/1
     
    }
  ,width:'592px',maxHeight:'max-content', panelClass:'modal-user',disableClose: true,hasBackdrop:false});
  
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.logoImage = result;
        this.dataLoaded = false;
        this.clientsService
        .updateSite(
          { siteImage: this.logoImage },
          this.selectedClientId.split('#')[1],
          this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1]
        )
        .subscribe((response) => {
          this.selectedClientSites[this.selectedSiteIndex]['logo'] = response['logo']
          //console.log('updating logo');
          this.getAllData(null);
          this.dataLoaded = true;
        }, (httpError: HttpErrorResponse) => {
          //this.errorString = err.error.message;
          this.dataLoaded = true;
          this.authService.updateErrorMessage(httpError['error']['message']);
        });
      }else{
        event.target.value = '';
      }
    });





    // var myReader: FileReader = new FileReader();

    // myReader.onloadend = (e) => {
    //   this.logoImage = myReader.result;
    //   //console.log('image: ', myReader.result);
    //   // this.dataLoaded = false;
    //   // this.clientsService
    //   //   .updateSite(
    //   //     { siteImage: this.logoImage },
    //   //     this.selectedClientId.split('#')[1],
    //   //     this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1]
    //   //   )
    //   //   .subscribe((response) => {
    //   //     this.selectedClientSites[this.selectedSiteIndex]['logo'] = response['logo']
    //   //     //console.log('updating logo');
    //   //     this.getAllData(null);
    //   //     this.dataLoaded = true;
    //   //   }, (httpError: HttpErrorResponse) => {
    //   //     //this.errorString = err.error.message;
    //   //     this.dataLoaded = true;
    //   //     this.authService.updateErrorMessage(httpError['error']['message']);
    //   //   });
    // };
    // myReader.readAsDataURL(file);
  }

  openImage() {
    this.fileInput.nativeElement.click();
  }

  openPdf() {
    this.pdfFileInput.nativeElement.click();
  }

  openConfig() {
    this.configFileInput.nativeElement.click();
  }

  openData() {
    this.dataFileInput.nativeElement.click();
  }

  addApplication() {
    //console.log('add')
    const dialogRef = this.dialog.open(CreateApplicationComponent, {
      data: {
        clientId: this.selectedClientId.split('#')[1],
        siteId: this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1]
      },
      width: '592px',
      panelClass: 'modal-user',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.getAllData();
      this.getApplications(result);
    });
  }

  downloadLayout(url: string, filename: string) {
    this.httpClient.get(url, { responseType: "blob" })
      .subscribe(res => {
        var a = document.createElement("a");
        a.href = URL.createObjectURL(res);
        a.download = filename;
        // start download
        a.click();
      })
  }

  downloadSchemaOrData(type: string) {
    // if(type == 'schema')
    //console.log('downloading schema')
    this.dataLoaded = false;
    this.applicationsService.getApplicationSchema(
      this.selectedClientId.split('#')[1],
      this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1],
      this.selectedSiteApplications[this.selectedSiteApplicationIndex].sortKey.split('#')[1]).subscribe(response => {
        let stringData = this.hex_to_ascii(response['data']);
        
        let file_name  = response['fileName'];
         file_name = file_name.split('_schema.csv');

         let fileName = file_name[0];
        fileName=fileName.split('_');
        //console.log(file_name);
        //console.log(file_name.length);
        let appFileName='';
         
        if(fileName.length > 0){
        
          for(let i=0; i < fileName.length; i++){
            if(i == fileName.length - 1){
            }else{
                appFileName = appFileName + fileName[i].charAt(0).toUpperCase()+fileName[i].slice(1)+'_'
            }

          }
        }

        //console.log(stringData);
        this.dataLoaded = true;
        this.downloadFileFromBlob(stringData, appFileName+'schema.csv');
      }, (httpError:HttpErrorResponse) => {
        this.dataLoaded = true;
        //this.errorString = error.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })

    // else if(type == 'data')
    // this.applicationsService.getApplicationData(
    //   this.selectedClientId.split('#')[1],
    //   this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1],
    //   this.selectedSiteApplications[this.selectedSiteIndex].sortKey.split('#')[1]).subscribe(response => {
    //     //console.log(response)
    //   })
  }

  hex_to_ascii(hexString: string) {
    var hex = hexString.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }

  downloadFileFromBlob(data: string, fileName: string) {
    let blob = new Blob([data], { type: "octet/stream" });
    let blobUrl = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName;
    link.click();
  }

  deleteLayout(fileName: string, index: number) {
    this.dataLoaded = false;
    this.clientsService.deleteLayout(this.selectedClientId.split('#')[1],
      this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1], fileName).subscribe(
        response => {
          this.selectedClientSites[this.selectedSiteIndex]['siteLayouts'].splice(index, 1);
          this.dataLoaded = true;
        }, (httpError:HttpErrorResponse) => {
          //this.errorString = err.error.message;
          this.dataLoaded = true;
          this.authService.updateErrorMessage(httpError['error']['message']);
        }
      )
  }

  showMessage(message) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
    });
  }

  deleteApplication(event, index) {
    event.preventDefault();
    //console.log(event)
    this.dataLoaded = false;
    this.applicationsService.deleteApplication(this.selectedClientId.split('#')[1],
      this.selectedClientSites[this.selectedSiteIndex].sortKey.split('#')[1],
      this.selectedSiteApplications[index].sortKey.split('#')[1]).subscribe(response => {
        this.selectedSiteApplications.splice(index, 1)
        this.dataLoaded = true;
      }, (httpError:HttpErrorResponse) => {
        //this.showMessage('Could Not Delete Application');
        this.dataLoaded = true;
        //this.errorString = error.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })
  }

  selectApplication(index: number) {
    this.selectedSiteApplicationIndex = index;
    this.accordion.closeAll();
  }

  isDefined(obj) {
    return typeof (obj) != 'undefined';
  }

  getDutTime(date){
    return new Date(date);
  }

  isDutLive(date){
    if(!date){
      return '';
    }
    const now = new Date().getTime();
    const lastStatus = new Date(date).getTime();
    if(now-lastStatus <= 2*60*1000){
      return "assets/indicator-active.png"
    }
    else{
      return "assets/indicator-inactive.png"
    }
  }
}
