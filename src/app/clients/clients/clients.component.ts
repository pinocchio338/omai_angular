import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ClientsService } from '../clients.service'
import {Router, ActivatedRoute} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../auth.service'
import { ImagecropperComponent } from 'src/app/shared/imagecropper/imagecropper.component';
import { MatDialog } from '@angular/material/dialog';
// import * as html_to_pdf from 'html-pdf-node'
// import { ToolbarComponent } from 'src/app/shared/toolbar/toolbar.component';
// import * as $ from 'jquery';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  [x: string]: any;
  errorString="";
  clients : Client[] = [];
  drafts : Client[] = [];
  showDraft : boolean = false;
  selectedClientIndex : number = -1;
  selectedClientType: string ="live";
  selectedClientSites : any[] = [];
  selectedClientUsers : any[] = [];
  searchedClients : Client[] = [];
  tempClients : Client[] = [];
  liveClients: Client[] = [];
  expiredClients: Client[] = [];
  weekExpiringClients: Client[] = [];
  monthExpiringClients: Client[] = [];
  viewedClients: Client[] = [];
  dataLoaded : boolean = false;
  selectedCategory : string = 'all';
  selectedClientDisplayMode : string = 'view';
  isSearchActive : boolean = false;
  draftClientId: any;
  selectedDraftIndex: any;
  fileToUpload: string;
  logoImage: string | ArrayBuffer;
  selectedClientId : string;
  selectedClientTempData : any = null;
  readonly dayDuration: number = 24*60*60*1000;
  readonly weekDuration: number = this.dayDuration * 7;
  readonly monthDuration: number = this.weekDuration * 4;
  readonly now: Date = new Date();
  
  showExpiredAndExpiring: boolean = false;
  showExpired: boolean = false;
  showExpiringInWeek: boolean = false;
  showExpiringInMonth: boolean = false;

  paymentTermsData:any=[30,45,60];
  constructor(private clientsService : ClientsService,
    private router: Router, 
    private route: ActivatedRoute, 
    private snackBar: MatSnackBar,
    private authService:AuthService,
    public element: ElementRef,
    private dialog:MatDialog) { }
  @ViewChild('clientEmail') clientEmail;
  @ViewChild('fileInput') fileInput:ElementRef;
  @ViewChild('sites', { static: false }) sitesWrapper: ElementRef;
  ngOnInit(): void {
    this.selectedClientId =this.route.snapshot.params.id;
    // //console.log('selectedClientId',this.selectedClientId)
    this.getAllData(this.selectedClientId);
  }

  getAllData(selectedClientId){
    this.clientsService.getClients().subscribe((clientsData)=>{
      this.selectedClientIndex = 0; 
      //console.log(clientsData)
      // this.clients = clientsData['clients'];
      // console.error(clientsData['clients'].length)
      if(!clientsData['clients'].length){
        this.dataLoaded = true;
        return;
      }
      clientsData['clients'].forEach((client: Client) => {
        if(client['status'] == 'draft'){
          this.drafts.push(client)
        }
        else{
          let subscriptionEndTime = new Date(client.subscriptionEndDate);
          // //console.log(subscriptionEndTime.getTime() - this.now.getTime())
          if(subscriptionEndTime.getTime() - this.now.getTime() <=0){
            this.expiredClients.push(client);
            if(client.primaryKey === selectedClientId){
              this.selectedClientIndex = (this.expiredClients.length)-1;
              this.showExpiredAndExpiring = this.showExpired = true;
              this.selectedClientType = 'expired'
            }
          }
          else if(subscriptionEndTime.getTime() - this.now.getTime() <= this.weekDuration){
            this.weekExpiringClients.push(client);
            if(client.primaryKey === selectedClientId){
              this.selectedClientIndex = (this.weekExpiringClients.length)-1;
              this.showExpiredAndExpiring = this.showExpiringInWeek = true;
              this.selectedClientType = 'week'
            }
          }
          else if(subscriptionEndTime.getTime() - this.now.getTime() <= this.monthDuration){
            this.monthExpiringClients.push(client);
            if(client.primaryKey === selectedClientId){
              this.selectedClientIndex = (this.monthExpiringClients.length)-1;
              this.showExpiredAndExpiring = this.showExpiringInMonth = true;
              this.selectedClientType = 'month';
            }
          }
          else{
            this.liveClients.push(client);
            if(client.primaryKey === selectedClientId){
              this.selectedClientIndex = (this.liveClients.length)-1;
              this.selectedClientType = 'live'
            }
          }
            
          this.clients.push(client)
          // if(client.primaryKey === selectedClientId)
          // this.selectedClientIndex = (this.clients.length)-1;
        }
      })
      // this.searchedClients = this.clients;
      // this.selectedClientIndex = 0; 
      this.selectCategory(this.selectedClientType);
      this.selectClient(this.selectedClientType, this.selectedClientIndex); 
      this.tempClients = JSON.parse(JSON.stringify(this.liveClients));
      // console.error('updating')
      if(this.searchedClients && this.searchedClients.length)
        this.authService.updateUserData({selectedClientId: this.searchedClients[this.selectedClientIndex].sortKey,selectedSiteId:''})  
      else{
        this.dataLoaded = true;
      }
      // //console.log('drafts',this.drafts)  
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.mesage;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
validateEmail(){
  //console.log("clientEmail",this.clientEmail);
}
  selectClient(type: string,index: number){
    // console.error(type);
    this.selectedClientIndex = index;
    this.selectCategory(type);
    
    if(this.searchedClients[this.selectedClientIndex])
      this.searchedClients[this.selectedClientIndex]['duration'] = this.getLicenseDuration(this.searchedClients[this.selectedClientIndex]);
    // //console.log('Duration', parseInt(this.searchedClients[this.selectedClientIndex]['duration']));
    // //console.log('Duration', this.searchedClients[this.selectedClientIndex]);
    // //console.log('photo', this.searchedClients[this.selectedClientIndex].logo);
    if(! this.searchedClients[this.selectedClientIndex] || this.searchedClients[this.selectedClientIndex].logo == undefined || this.searchedClients[this.selectedClientIndex].logo == ''){

      this.clientphoto = 'assets/sample-site-image.png';
     

    }else {
 
      this.clientphoto = this.searchedClients[this.selectedClientIndex].logo

    }
    if(this.searchedClients && this.searchedClients.length>0){
      this.getSites();
      this.getUsers();
      //console.log(this.searchedClients);
    }
  }

  expiringSoon(){
    try{
      let subscriptionEndTime = new Date(this.searchedClients[this.selectedClientIndex].subscriptionEndDate);
      if(subscriptionEndTime.getTime() - this.now.getTime() <= this.monthDuration)
        return true;
      return false;
    }
    catch(e){
      return false;
    }
  }

  getSites(){
    if(!this.searchedClients[this.selectedClientIndex])
      return;
    const clientId = this.searchedClients[this.selectedClientIndex].primaryKey.split('#')[1];

    this.clientsService.getSites(clientId).subscribe((sitesData)=> {
      //console.log(sitesData)
      this.selectedClientSites = sitesData['sites'];
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.mesage;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  getUsers(){
    const clientId = this.searchedClients[this.selectedClientIndex].primaryKey.split('#')[1];    
    this.clientsService.getUsers(clientId).subscribe((userData)=> {
      //console.log(userData)
      this.selectedClientUsers = userData['userInfo'];
      this.processUsersData(this.selectedClientUsers);
      this.dataLoaded = true;
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.mesage;
      this.dataLoaded = true;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  processUsersData(userData:any[]){
    let userGroups = userData['userGroups'];
    let users = userData['users'];
    let processedUsers = {};
    users.forEach(user => {
      processedUsers[user.sortKey]=user;
    });
    // userGroups.forEach(group => {
    //   group.userList = JSON.parse(group.userList);
    // });
    userData['usersObject']=processedUsers;
  }


  selectDraftClient(draftData , index){

    this.selectedDraftIndex = index;
     //console.log('draftData',draftData);
     this.draftClientId = draftData['sortKey'].split('#')[1];
     localStorage.setItem("draft_clientId", this.draftClientId);
     this.router.navigate(['/clients/add']);

  }

  scroll(direction :string){
    let element = this.sitesWrapper.nativeElement;
    let offset = direction == 'next' ? 200 : -200;
    element.scrollBy(offset,0)
  }

  searchSites(searchString:string){
    //console.log(searchString)
    searchString = searchString.trim().toLowerCase();
    if(searchString.length == 0){
      this.searchedClients = this.liveClients = this.tempClients;
      this.selectClient(this.selectedClientType,0);
      return;
    }
    let searchingClients = [];
    this.clients.forEach(client => {
      if(client.name.toLowerCase().includes(searchString))
        searchingClients.push(client)
    });
    this.searchedClients = searchingClients;
    this.liveClients = this.searchedClients;
    if(searchingClients.length) 
      this.selectedClientIndex = 0;
    else
      this.selectedClientIndex = -1;
    this.getSites();
    this.getUsers();   
  }

  manageSites(siteId: string){
    const clientId = this.searchedClients[this.selectedClientIndex].primaryKey;
    if(!siteId && this.selectedClientSites[0]){
      siteId = this.selectedClientSites[0].sortKey; 
    }   
    //   this.router.navigate(['clients',clientId]);
    // }
    // else{
      // console.error(this.searchedClients[this.selectedClientIndex])
      if(siteId)
        this.router.navigate(['clients',clientId,siteId]);  
      else
        this.router.navigate(['clients',clientId]);  
    // }
    // this.router.navigate(['dashboard', this.loginForm.controls.username.value, mode]);
  }

  manageGroup(){
    const clientId = this.searchedClients[this.selectedClientIndex].primaryKey;   
    this.router.navigate(['/groups',clientId]);

   // this.router.navigate(['/manage-groups',clientId]);

  }

  manageUsers(){
    const clientId = this.searchedClients[this.selectedClientIndex].primaryKey;   
    this.router.navigate(['/users',clientId]);

   // this.router.navigate(['/manage-groups',clientId]);
  }

  checkAmount(data){


    if (data == 'sites') {

      if(parseInt(this.searchedClients[this.selectedClientIndex][data])){
        let value = parseInt(this.searchedClients[this.selectedClientIndex][data]);
        //console.log(typeof(value));
        //console.log(value);
      }
    
   
  } else if (data == 'users') {
   
   
    if(parseInt(this.searchedClients[this.selectedClientIndex][data])){
      let value = parseInt(this.searchedClients[this.selectedClientIndex][data]);
      //console.log(typeof(value));
      //console.log(value);
    }

  } else if (data == 'dasboards') {
 
  
    if(parseInt(this.searchedClients[this.selectedClientIndex][data])){
      let value = parseInt(this.searchedClients[this.selectedClientIndex][data]);
      //console.log(typeof(value));
      //console.log(value);
    }

  } else if (data == 'alerts') {
   
   
    if(parseInt(this.searchedClients[this.selectedClientIndex][data])){
      let value = parseInt(this.searchedClients[this.selectedClientIndex][data]);
      //console.log(typeof(value));
      //console.log(value);
    }
    
  } else {

    
    if(parseInt(this.searchedClients[this.selectedClientIndex][data])){
      let value = parseInt(this.searchedClients[this.selectedClientIndex][data]);
      //console.log(typeof(value));
      //console.log(value);
    }
  }

  }


  selectCategory(category: string){
    this.selectedClientType = this.selectedCategory = category;
    // console.error(this.selectedCategory);    
    switch(category){
      case 'live': this.searchedClients = this.liveClients;break;
      case 'expired': this.searchedClients = this.expiredClients;break;
      case 'week': this.searchedClients = this.weekExpiringClients;break;
      case 'month': this.searchedClients = this.monthExpiringClients;break;
      default: this.searchedClients=[];
            this.selectedClientIndex = -1;
            this.selectedClientSites = [];
            this.selectedClientUsers = [];
            return;
    }
    // console.error(this.drafts.length,this.liveClients.length, this.expiredClients.length, this.weekExpiringClients.length, this.monthExpiringClients.length, this.clients.length)
    // this.selectedClientIndex = 0;
    // this.getSites();
    // this.getUsers();  
  }

  editStatus(operation: string,field: string){
    let value = parseInt(this.searchedClients[this.selectedClientIndex][field]);
    if(operation == 'increment' ){
      this.searchedClients[this.selectedClientIndex][field] = value + 1;
    }
    else if(operation == 'decrement' ){
      this.searchedClients[this.selectedClientIndex][field] = value - 1;
    }
  }

  updateClient(){
    let client = this.searchedClients[this.selectedClientIndex];
    //console.log('updated client',client);
    let subscriptionDuration = new Date(client.subscriptionStartDate);
    subscriptionDuration.setFullYear(subscriptionDuration.getFullYear()+client['duration'])
    client.subscriptionEndDate = subscriptionDuration.toISOString();
  
    let updatedClient = {
      name: client.name,
      email:client.email,
      sites: parseInt(client.sites),
      users: parseInt(client.users),
      dasboards: parseInt(client.dasboards),
      alerts: parseInt(client.alerts),
      subscriptionEndDate: client.subscriptionEndDate,
      licenseValue: client.licenseValue,
      paymentterms: client.paymentterms,
      address : client.address
    }
    if(this.logoImage){
      updatedClient['logo']=this.logoImage;
    }
    // delete(updatedClient['duration']);
    let clientId = client.primaryKey.split('#')[1];
    this.dataLoaded = false;
    
    this.clientsService.updateClient(clientId,updatedClient).subscribe(response =>{
      // this.getAllData(this.selectedClientId)
      client['logo'] = response['logo']
      this.clientphoto = response['logo'];
      
      this.selectedClientDisplayMode='view';
      this.logoImage = null;
      this.dataLoaded = true;
    },(httpError:HttpErrorResponse)=>{
     // this.errorString = err.error.mesage;
     this.dataLoaded = true;
     this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  getLicenseDuration(client : Client){
    if(!client || !client.subscriptionEndDate || !client.subscriptionStartDate)
      return 0;
    return new Date(client.subscriptionEndDate).getFullYear() - new Date(client.subscriptionStartDate).getFullYear();
  }

  getPhoto(url: string){
    return typeof(url) !== 'undefined' && url ? url : 'assets/sample-site-image.png';
  }


  deleteClient(){
    let clientId = this.searchedClients[this.selectedClientIndex].primaryKey;
    clientId = clientId.split('#')[1];
    this.dataLoaded = false;
    this.clientsService.deleteClient(clientId).subscribe(response => {
      //console.log('client'+clientId+' deleted');
      this.selectedClientDisplayMode='view';
      this.searchedClients.splice(this.selectedClientIndex,1)
      if(this.selectedClientIndex>=this.searchedClients.length)
        this.selectedClientIndex = this.searchedClients.length-1;
      this.selectClient(this.selectedClientType,this.selectedClientIndex);
      this.dataLoaded = true;
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.mesage;
      this.dataLoaded = true;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  selectUserGroup(groupId: string){
    this.router.navigate(['groups',this.searchedClients[this.selectedClientIndex].primaryKey , groupId]);
  }

  handleFileInput(event) {
    const files = (event.target as HTMLInputElement).files;
    this.fileToUpload = files[0].name;
    //console.log(this.fileToUpload.split('.')[1])
    if(!this.fileToUpload.split('.')[1].includes('jpg') && !this.fileToUpload.split('.')[1].includes('jpeg') && !this.fileToUpload.split('.')[1].includes('png'))
    {
      this.dataLoaded = true;
      event.target.value = null;  
      this.authService.updateErrorMessage('Please upload a valid file');
      return;
    }
    if(files[0].size / 1000000 >4){
      this.authService.updateErrorMessage('File size cannot exceed 4MB');
      return;
    }
    this.readThis(event,files);
  }


  readThis(event,inputValue: any): void {
    var file: File = inputValue[0];
  
  const dialogRef = this.dialog.open(ImagecropperComponent,{data:{
    file:event,
    ratio:1/1
   
  }
,width:'592px',maxHeight:'max-content', panelClass:'modal-user',disableClose: true,hasBackdrop:false});

  dialogRef.afterClosed().subscribe(result => {
    if(result){
      this.logoImage = result;
    }else{
      event.target.value='';
    }
  });
    // var myReader: FileReader = new FileReader();

    // myReader.onloadend = (e) => {
    //   this.logoImage = myReader.result;
    //   //console.log(myReader.result);
    // }
    // myReader.readAsDataURL(file);
  }

  getDraftCreationDays(index: number){
    let creationDate = this.drafts[index]['createdAt'];
    let days = (this.now.getTime() - new Date(creationDate).getTime())/this.dayDuration;
    days = Math.floor(days)
    if(days == 0)
      return 'today'
    if(days <= 1)
      return (days + ' day ago')
    return (days + ' days ago')
  }

  openImage(){
    this.fileInput.nativeElement.click()
  }

  editClientMode(){
    
    if(this.searchedClients[this.selectedClientIndex].logo == undefined || this.searchedClients[this.selectedClientIndex].logo ==''){
      this.clientphoto = 'assets/sample-site-image.png';

    }else{

      this.clientphoto = this.searchedClients[this.selectedClientIndex].logo;

    }
    this.selectedClientDisplayMode = 'edit';
    //console.log('edit client mode photo:', this.selectedClientTempData);
    this.selectedClientTempData = JSON.parse(JSON.stringify(this.searchedClients[this.selectedClientIndex]));
  }

  cancelEdit(){
    this.searchedClients[this.selectedClientIndex] = JSON.parse(JSON.stringify(this.selectedClientTempData))
    this.selectedClientDisplayMode = 'view';
    this.selectedClientTempData = null;
  }

  sendReminder(){
    this.dataLoaded = false;
    let clientId = this.searchedClients[this.selectedClientIndex]['sortKey'].toString().split('#')[1];
    this.clientsService.sendReminder(clientId).subscribe(response =>{
      this.dataLoaded = true;
      this.showMessage('Subscription expiring reminder sent to '+this.searchedClients[this.selectedClientIndex].email);
    },
    (httpError:HttpErrorResponse) => {
      this.dataLoaded = true;
      //this.errorString = error.error.mesage;
      this.authService.updateErrorMessage(httpError['error']['message']);
    }
      )
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'OK', {
      duration: 5000,
    });
  }
}



export interface Client{
  address: object,
  alerts : string,
  dasboards : string,
  email : string,
  licenseValue : number,
  paymentterms:number,
  logo : string,
  name : string,
  phoneNo : string,
  primaryKey : string,
  sites : string,
  sortKey : number,
  subscriptionEndDate : string,
  subscriptionStartDate : string,
  users : string
}