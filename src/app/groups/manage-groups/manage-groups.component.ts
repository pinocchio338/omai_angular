import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/users/user.service';
import { UsersComponent } from '../../users/users.component';
import { MatDialog } from '@angular/material/dialog';
import { GroupsService } from '../groups.service';
import { ClientsService } from 'src/app/clients/clients.service';
import { AuthService } from 'src/app/auth.service';
import { HttpErrorResponse } from '@angular/common/http';




@Component({
  selector: 'app-manage-groups',
  templateUrl: './manage-groups.component.html',
  styleUrls: ['./manage-groups.component.scss']
})
export class ManageGroupsComponent implements OnInit {
  @ViewChild('inputGroupName') inputGroupName: ElementRef;
  @ViewChild('inputGroupNameEdit') inputGroupNameEdit: ElementRef;
  
  dataLoaded: boolean = false;
  allUsers:Array<any> = [];
  allUserGroups:Array<any> = [];
  groupSettingForm : UntypedFormGroup;
  isShowDetails = true;
  groupList = [];
  selectedClientId:string = null;
  clientInfo: any = null;
  siteInfo: any =null;
  selectedClientSites: any[];
  selectedClientUsers: any[];
  userGroupList: any ;
  selectedClientIndex : number = 0
  selectedSiteIndex:number = 0;
  allApplicationsList:Array<any> = [];
  siteList : any;
  siteInfoList = [];
  siteInfoDashboardList= [];
  siteInfoApplicationList = [];
  application = [];
  dashboard = [];
  site  = [];

  allDashboardsList:Array<any> = [];
  siteId:any = null;  
  groupForEdit:any = null;
  newGroupError:string ='';
  editGroupError:string = '';
  inProcess:boolean = false;
  newGroupSaveBtnText="Save";
  editGroupSaveBtnText="Save";
  isAdmin = false;
  newGroup:any = {
    "name":'',
    userList:[],
    permissions:{
    
    "admin":false,
    'alerts':{'receive':false,'send':false},
    'report':{'generate':false},
    'sitePermissions':{},
    'userGroups':{'add':false,'view':false,'edit':false,'delete':false},
    'dashboard':{'add':false,'view':false,'edit':false,'delete':false,'asHome':false},
    'users':{'add':false,'view':false,'edit':false,'delete':false},
    'applications':{'add':false,'view':false,'edit':false,'delete':false}

  }
}
  selectedUserGroupId: any;
  newGroupSiteList: any;
  groupEditApllicationList: any[];
  groupEditDashboardList: any[];
  SitePermissions: {};
  sitePermissonObject: {};
  dashlist: any[];
  applist: any[];
  dashboardInfoList =[];
  applicationInfoList = [];
  updatedashboardInfoList = [];
  updateApllicationList = [];
  updatesitePermissonObject: {};
  errorString="";
  isempty: boolean;
  isNewGroup: boolean = true;
  allsites: any;
    constructor(private fb: UntypedFormBuilder, private router: Router, private route: ActivatedRoute,public dialog: MatDialog,private _userService:UserService,private _groupService:GroupsService, private clientService:ClientsService,private authService:AuthService) {
   }
   
  attributeDisplay(attribute1,attribute2){
    if (attribute1.sortKey == attribute2.sortKey) {
      return attribute1.name;
    } else {
      return "";
    }
  }
  // constructor(private router: Router) { }

  // ngOnInit(): void {
  //   this.selectedClientId =this.route.snapshot.params.id;
  //   this.clientService.getClients().subscribe( data => {
  //     data['clients'].forEach(client => {
  //       if(client.sortKey == this.selectedClientId)
  //         {
  //           this.clientInfo = client;           
  //           //console.log(this.clientInfo)
  //           this.getSites();
  //           this.getUsers();
  //         }
  //     });
  //   })
  // }

  ngOnInit(): void {
    this.selectedClientId = this.route.snapshot.params.id.split('#')[1];
    //console.log('selected Client Id:', this.selectedClientId);
    this.getSiteInfoByClientId(this.selectedClientId);
    this.selectedUserGroupId = this.route.snapshot.params.groupId;
    //console.log('selectedUserGroupId',this.selectedUserGroupId)
     this.clientService.getClients().subscribe( data => {
      data['clients'].forEach(client => {
        if(client.sortKey == this.route.snapshot.params.id)
          {
            this.clientInfo = client;           
            
          }
      });
    },(httpError:HttpErrorResponse)=>{
     // this.errorString = err.error.message;
     this.authService.updateErrorMessage(httpError['error']['message']);
    })
    // this.clientService.getSites(this.selectedClientId).subscribe((sitesData)=> {
    //   //console.log("sitesData",sitesData);
    //   sitesData['sites'].forEach(site => {
    //     if(site.sortKey == this.route.snapshot.params.siteId)
    //       {
    //         this.siteInfo = site;           
    //       }
    //   });
    // })
    // this.siteId = this.route.snapshot.params.siteId.split('#')[1];
    this.getUsers()    
  }



  getSiteInfoByClientId(clientId){
    this._groupService.getSiteInfoByClient(this.selectedClientId).subscribe((response:any)=> {
        //console.log('getSiteInfoByClientId', response);
        this.newGroupSiteList = response['sites'];
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }


  deleteUser( user:any , usergroup:any , state:string ){

         // //console.log('before delete user List ', usergroup.userList);
          const index = usergroup.userList.indexOf(user);
          if (index > -1) {
            usergroup.userList.splice(index, 1);
          }
        //  //console.log('updated userList ',usergroup.userList); 

          let updatedUsers = {"userList": usergroup.userList};
          const group_Id = usergroup.sortKey.split('#')[1];;
          this.inProcess = true;

          this._groupService.updateGroupUsers(group_Id,updatedUsers,this.selectedClientId).subscribe((res:any)=>{
            this.inProcess = false;
          },(httpError:HttpErrorResponse)=>{
            this.inProcess = false;
           // this.errorString = error.error.message;
            this.authService.updateErrorMessage(httpError['error']['message']);
           // //console.log("error",error);
          })
   }

   editchange(event, selecteddata) {

    // console.log('edit event-------------------------------------------------------------', event.source.selected);
    // console.log('edit selecteddata', selecteddata);
    //console.log('edit this.siteInfoList', this.siteInfoList);

    //console.log('------------this.groupEditApllicationList', this.groupEditApllicationList);
    //console.log('-------------this.groupEditDashboardList', this.groupEditDashboardList);
    
    this.sitePermissonObject = {};

    if (event.source.selected && event.source.value == selecteddata.sortKey) {

      this.siteInfoList.push(selecteddata);

      this.siteInfoList = [...new Set(this.siteInfoList)]

      if(this.groupForEdit.permissions.admin){

        this.getApplicationListadmin(this.siteInfoList);
        this.getDashboardsListadmin(this.siteInfoList);

      }else{

        this.getApplicationList(this.siteInfoList);
        this.getDashboardsList(this.siteInfoList);

      }

      // console.log('siteInfoList add ', this.siteInfoList);
    //  //console.log('siteInfoList add ', this.siteInfoList);

      
    

    } else {

      for (var i = 0; i < this.siteInfoList.length; i++) {
        if (this.siteInfoList[i] === selecteddata) {
          this.siteInfoList.splice(i, 1);
          //console.log('edit siteInfoList remove ---------------------------', this.siteInfoList);
          this.getApplicationList(this.siteInfoList)
          this.getDashboardsList(this.siteInfoList)

        }
      }

      if(this.siteInfoList.length == 0){

        this.groupEditApllicationList = [];
        this.groupEditDashboardList = [];
        this.siteInfoApplicationList = [];
        this.siteInfoDashboardList = [];
    }

    }
    //console.log('edit siteInfoList final', this.siteInfoList);
    this.updateSitePermissinObj();

  }
  
  
  // editchange(event , selecteddata){

  //   //console.log('edit event' , event.source.selected);
  //   //console.log('edit selecteddata' , selecteddata);
  //   //console.log('this.siteInfoList --------------',this.siteInfoList);
  //   if(event.source.selected && event.source.value == selecteddata.sortKey ){
        
  //       this.siteInfoList.push(selecteddata);

  //       this.siteInfoList=[...new Set(this.siteInfoList)]
       
        
  //       //console.log('siteInfoList edit add ------',  this.siteInfoList);
  //       if(this.groupForEdit.permissions.admin){

  //         this.getApplicationListadmin(this.siteInfoList);
  //         this.getDashboardsListadmin(this.siteInfoList);
  
  //       }else{
  
  //         this.getApplicationList(this.siteInfoList);
  //         this.getDashboardsList(this.siteInfoList);
  
  //       }
  

    
  //       //console.log('------ update ', this.updatedashboardInfoList);
  //   }else {
   
  //    for( var i = 0; i < this.siteInfoList.length; i++){ 
  //      if (  this.siteInfoList[i] === selecteddata) { 
  //            this.siteInfoList.splice(i, 1); 
  //            //console.log('edit siteInfoList remove',  this.siteInfoList);
  //           this.getApplicationList(this.siteInfoList)
  //           this.getDashboardsList(this.siteInfoList)
   
  //        }
  //     }

  //     if(this.siteInfoList.length == 0){

  //         this.groupEditApllicationList = [];
  //         this.groupEditDashboardList = [];
  //         this.siteInfoApplicationList = [];
  //         this.siteInfoDashboardList = [];
  //     }
  //   }
  //     //console.log('edit siteInfoList final',  this.siteInfoList);
  //     this.updateSitePermissinObj();

  // }
  

  // change(event , selecteddata){

  //   //console.log('site event' , event.source.selected);
  //   //console.log('site selecteddata' , selecteddata);
  
  //   if((event.source.selected && event.source.value == selecteddata.name) && selecteddata.status=='active'){

  //       this.siteInfoList.push(selecteddata);
  //       this.siteInfoList=[...new Set(this.siteInfoList)]

  //       //console.log('siteInfoList add ',  this.siteInfoList);
  //       this.getApplicationList(this.siteInfoList);
  //       this.getDashboardsList(this.siteInfoList);

  //   }else {
  //         for( var i = 0; i < this.siteInfoList.length; i++){ 
  //           if (  this.siteInfoList[i] === selecteddata) { 
  //                 this.siteInfoList.splice(i, 1); 
  //                 //console.log('siteInfoList remove',  this.siteInfoList);
  //                 this.getApplicationList(this.siteInfoList);
  //                 this.getDashboardsList(this.siteInfoList);
  //             }
  //         }
  //   }
  //      //console.log('siteInfoList final',  this.siteInfoList);
  //      this.createSitePermissinObj();
     
  // }



  change(event, selecteddata) {

    //console.log('site event', event.source.selected);
    //console.log('site selecteddata', selecteddata);
    this.updatesitePermissonObject = {};

    if(this.isAdmin){

      if (event.source.value == selecteddata.name) {

        this.siteInfoList.push(selecteddata);
        this.siteInfoList = [...new Set(this.siteInfoList)]
        //console.log('siteInfoList add ', this.siteInfoList);
        this.getApplicationList(this.siteInfoList);
        this.getDashboardsList(this.siteInfoList);
  
      } else {
        for (var i = 0; i < this.siteInfoList.length; i++) {
          if (this.siteInfoList[i] === selecteddata) {
            this.siteInfoList.splice(i, 1);
            //console.log('siteInfoList remove', this.siteInfoList);
            this.getApplicationList(this.siteInfoList);
            this.getDashboardsList(this.siteInfoList);
            // this.groupEditApllicationList = [];
            // this.groupEditDashboardList = [];
          }
        }
      }

    }else{

      if (event.source.selected && event.source.value == selecteddata.name) {

        this.siteInfoList.push(selecteddata);
        this.siteInfoList = [...new Set(this.siteInfoList)]
        //console.log('siteInfoList add ', this.siteInfoList);
        this.getApplicationList(this.siteInfoList);
        this.getDashboardsList(this.siteInfoList);
  
      } else {
        for (var i = 0; i < this.siteInfoList.length; i++) {
          if (this.siteInfoList[i] === selecteddata) {
            this.siteInfoList.splice(i, 1);
            //console.log('siteInfoList remove', this.siteInfoList);
            this.getApplicationList(this.siteInfoList);
            this.getDashboardsList(this.siteInfoList);
            // this.groupEditApllicationList = [];
            // this.groupEditDashboardList = [];
          }
        }
      }


    }


    //console.log('siteInfoList final', this.siteInfoList);
    this.createSitePermissinObj();

  }




  selectedDashboard(event , selecteddata){

    //console.log('dashboard event' , event.source.selected);
    //console.log('dashboard selecteddata' , selecteddata);

    if(event.source.selected && event.source.value == selecteddata.sitename+'-'+selecteddata.name ){
      this.dashboardInfoList.push(selecteddata);
      this.dashboardInfoList=[...new Set(this.dashboardInfoList)]

      //console.log('dashboardInfoList add ',  this.dashboardInfoList);
        // this.getApplicationList(this.siteInfoList);
        // this.getDashboardsList(this.siteInfoList);
  }else {
        for( var i = 0; i < this.dashboardInfoList.length; i++){ 
          if (  this.dashboardInfoList[i] === selecteddata) { 
                this.dashboardInfoList.splice(i, 1); 
                //console.log('dashboardInfoList remove',  this.dashboardInfoList);
              //  this.getApplicationList(this.siteInfoList);
               // this.getDashboardsList(this.siteInfoList);
            }
        }
  }
     //console.log('dashboardInfoList final',  this.dashboardInfoList);
     this.createSitePermissinObj();


  }

  editdashboard(event , selecteddata){


    //console.log('edit dashboard event------------' , event.source.selected);
    //console.log('edit dashboard selecteddata------------' , selecteddata);

      if(event.source.selected && event.source.value == selecteddata.sortKey ){
           this.updatedashboardInfoList.push( selecteddata );
           this.updatedashboardInfoList=[...new Set(this.updatedashboardInfoList)]
          //console.log(this.updatedashboardInfoList)
        //console.log('edit groupEditDashboardList add ',  this.groupEditDashboardList);
        }else {
                for( var i = 0; i <= this.updatedashboardInfoList.length; i++){ 
                if (  this.updatedashboardInfoList[i] === selecteddata) { 
                      this.updatedashboardInfoList.splice(i, 1); 
                      //console.log('updatedashboardInfoList remove',  this.updatedashboardInfoList);
                  }
              }
        }
        //console.log('updatedashboardInfoList',  this.updatedashboardInfoList);
        this.updateSitePermissinObj();
  }



 


  selectedApplications(event , selecteddata){

   // console.log('application event' , event.source.selected);
  //  console.log('application selecteddata' , selecteddata);  

    if((event.source.selected && event.source.value == selecteddata.sitename+'-'+selecteddata.name)  && selecteddata.status!='deleted' ){

      this.applicationInfoList.push(selecteddata);
      this.applicationInfoList=[...new Set(this.applicationInfoList)]

      //console.log('applicationInfoList add ',  this.applicationInfoList);
     // this.getApplicationList(this.siteInfoList);
     // this.getDashboardsList(this.siteInfoList);

  }else {
        for( var i = 0; i < this.applicationInfoList.length; i++){ 
          if (  this.applicationInfoList[i] === selecteddata) { 
                this.applicationInfoList.splice(i, 1); 
                //console.log('applicationInfoList remove',  this.applicationInfoList);
              //  this.getApplicationList(this.siteInfoList);
               // this.getDashboardsList(this.siteInfoList);
            }
        }
  }
     //console.log('applicationInfoList final',  this.applicationInfoList);

     this.createSitePermissinObj();
  }


  editapplication(event , selecteddata){


    //console.log('edit application event------------' , event.source.selected);
    //console.log('edit application selecteddata------------' , selecteddata);

      if(event.source.selected && event.source.value == selecteddata.sortKey ){
        this.updateApllicationList.push(selecteddata);
        this.updateApllicationList=[...new Set(this.updateApllicationList)]

        //console.log('edit updateApllicationList add ',  this.updateApllicationList);
        }else {
              for( var i = 0; i <= this.updateApllicationList.length; i++){ 
                if (  this.updateApllicationList[i] === selecteddata) { 
                      this.updateApllicationList.splice(i, 1); 
                      //console.log('updateApllicationList remove',  this.updateApllicationList);
                  }
              }
        }

        //console.log('updateApllicationList ',  this.updateApllicationList);

        this.updateSitePermissinObj();

  }


  createSitePermissinObj(){

    this.sitePermissonObject = {};
      
   // console.log('siteInfoList length',this.siteInfoList);
   // console.log('siteInfoDashboardList length',this.siteInfoDashboardList);
    //console.log('dashlist length',this.dashboardInfoList);
   // console.log('applist length',this.applicationInfoList);
    //siteInfoApplicationList


    for(var l = 0 ; l < this.siteInfoList.length; l++){
     let createdashboards =[];

     this.dashboard=[...new Set(this.dashboard)];
     this.application=[...new Set(this.application)];


     if(this.isAdmin){ 

      this.siteInfoDashboardList.forEach(dashboards =>{
        if(dashboards['sitesortkey'] == this.siteInfoList[l].sortKey){

        createdashboards.push(dashboards.sortKey);
        this.dashboard.push(dashboards.sitename+'-'+ dashboards.name);

        }
       // dashboard.sitename +'-'+ dashboard.name

      })




     // console.log("dashboard------",this.dashboard);

     }else{

      this.dashboardInfoList.forEach(dashboards =>{
        if(dashboards['sitesortkey'] == this.siteInfoList[l].sortKey)
        createdashboards.push(dashboards.sortKey)
      })

     }


     let createapplications =[];
     if(this.isAdmin){
          this.siteInfoApplicationList.forEach(applications =>{
            if(applications['sitesortkey'] == this.siteInfoList[l].sortKey)
            createapplications.push(applications.sortKey);
            this.application.push(applications.sitename+'-'+ applications.name);

          })
     }else{

      this.applicationInfoList.forEach(application =>{
        if(application['sitesortkey'] == this.siteInfoList[l].sortKey)
        createapplications.push(application.sortKey)
      })
     }


      this.sitePermissonObject[this.siteInfoList[l].sortKey] = { 
           "dashboards": createdashboards,
           "applications": createapplications
       }


     }
     this.dashboard=[...new Set(this.dashboard)]
     this.application=[...new Set(this.application)]




       //console.log('update siteInfoApplicationList', this.siteInfoApplicationList);
    //   console.log(' sitePermissonObject', this.sitePermissonObject);
  }


  updateSitePermissinObj(){

    this.updatesitePermissonObject = {};
    for(var l = 0 ; l < this.siteInfoList.length; l++){
     let dashboards =[];

     
     this.updatedashboardInfoList.forEach(dashboard =>{
       if(dashboard['sitesortkey'] == this.siteInfoList[l].sortKey)
       dashboards.push(dashboard.sortKey)
     })

     let applications =[];
     this.updateApllicationList.forEach(application =>{
       if(application['sitesortkey'] == this.siteInfoList[l].sortKey)
       applications.push(application.sortKey)
     })

      this.updatesitePermissonObject[this.siteInfoList[l].sortKey] = { 
           "dashboards": dashboards,
           "applications": applications
       }
     }

    //   console.log('update updatedashboardInfoList', this.groupEditDashboardList);
     //  console.log('update updatedashboardInfoList', this.updatesitePermissonObject);

  }


  


  getDashboardsList(dashboardList: any) {
    this.siteInfoDashboardList = [];
    this.groupEditDashboardList = [];

    this.dashboard = [];
    var h = 0;
    for (var i = 0; i < dashboardList.length; i++) {
      for (var j = 0; j < dashboardList[i].dashboards.length; j++) {
        this.siteInfoDashboardList.push(dashboardList[i].dashboards[j]);
        this.siteInfoDashboardList[h]['sitename'] = dashboardList[i].name;
        this.siteInfoDashboardList[h]['sitesortkey'] = dashboardList[i].sortKey;

        h++;
      }
    }
  //  console.log('siteInfoDashboardList', this.siteInfoDashboardList);

    for(var i = 0; i < this.siteInfoDashboardList.length; i++){

      this.dashboard.push(this.siteInfoDashboardList[i].sitename+'-'+this.siteInfoDashboardList[i].name)
      this.groupEditDashboardList.push(this.siteInfoDashboardList[i].sortKey);
  
     }



  }



  getDashboardsListadmin(dashboardList: any) {
    this.siteInfoDashboardList = [];
    this.groupEditDashboardList = [];

    this.dashboard = [];
    var h = 0;
    for (var i = 0; i < dashboardList.length; i++) {
      for (var j = 0; j < dashboardList[i].dashboards.length; j++) {
        this.siteInfoDashboardList.push(dashboardList[i].dashboards[j]);
        this.siteInfoDashboardList[h]['sitename'] = dashboardList[i].name;
        this.siteInfoDashboardList[h]['sitesortkey'] = dashboardList[i].sortKey;

        h++;
      }
    }

   for(var i = 0; i < this.siteInfoDashboardList.length; i++){

    this.dashboard.push(this.siteInfoDashboardList[i].sitename+'-'+this.siteInfoDashboardList[i].name)
    this.groupEditDashboardList.push(this.siteInfoDashboardList[i].sortKey);

   }
  }




  getApplicationList(ApllicationList: any) {
    this.siteInfoApplicationList = [];
    this.application = [];
    this.groupEditApllicationList = [];
    var h = 0;

    for (var i = 0; i < ApllicationList.length; i++) {

      for (var j = 0; j < ApllicationList[i].applications.length; j++) {
        this.siteInfoApplicationList.push(ApllicationList[i].applications[j]);
        this.siteInfoApplicationList[h]['sitename'] = ApllicationList[i].name;
        this.siteInfoApplicationList[h]['sitesortkey'] = ApllicationList[i].sortKey;
        h++;
      }
    }
  
   // console.log('update siteInfoApplicationList', this.siteInfoApplicationList);

    for(var i = 0; i < this.siteInfoApplicationList.length; i++){ 
      this.application.push(this.siteInfoApplicationList[i].sitename+'-'+this.siteInfoApplicationList[i].name);
     // this.groupEditApllicationList.push(this.siteInfoApplicationList[i].sitename+'-'+this.siteInfoApplicationList[i].name);
      this.groupEditApllicationList.push(this.siteInfoApplicationList[i].sortKey);

    }




  }

  getApplicationListadmin(ApllicationList: any) {
    this.siteInfoApplicationList = [];
    this.application = [];
    this.groupEditApllicationList = [];
    var h = 0;

    for (var i = 0; i < ApllicationList.length; i++) {

      for (var j = 0; j < ApllicationList[i].applications.length; j++) {
        this.siteInfoApplicationList.push(ApllicationList[i].applications[j]);
        this.siteInfoApplicationList[h]['sitename'] = ApllicationList[i].name;
        this.siteInfoApplicationList[h]['sitesortkey'] = ApllicationList[i].sortKey;
        h++;
      }
    }

    //console.log('admin siteInfoApplicationList', this.siteInfoApplicationList)
    for(var i = 0; i < this.siteInfoApplicationList.length; i++){ 
      this.application.push(this.siteInfoApplicationList[i].sitename+'-'+this.siteInfoApplicationList[i].name);
     // this.groupEditApllicationList.push(this.siteInfoApplicationList[i].sitename+'-'+this.siteInfoApplicationList[i].name);
      this.groupEditApllicationList.push(this.siteInfoApplicationList[i].sortKey);

    }

    //console.log('admin groupEditApllicationList', this.groupEditApllicationList)

  }


  getSites(data){ 
    const clientId = data.split('#')[1];
    this.clientService.getSites(clientId).subscribe((sitesData)=> {
      //console.log('sites Group setting ',sitesData) 
      this.allsites = sitesData['sites'];
    
    },(httpError:HttpErrorResponse)=>{
     // this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }


  getUsers(){
    
    this._userService.getAllUsers(this.selectedClientId).subscribe((alluserData:any)=> {
      this.allUsers = alluserData.userInfo.users;
      this.allUserGroups = alluserData.userInfo.userGroups;
      this.selectedClientUsers = alluserData['userInfo'];
      this.processUsersData(this.selectedClientUsers);
      //console.log("this.selectedClientUsers",this.selectedClientUsers);
      this.dataLoaded = true;
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
     // this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  processUsersData(userData:any[]){
    let userGroups = userData['userGroups'];
    let users = userData['users'];
    this.userGroupList = userData['userGroups'];
    //console.log('userGroupList', this.userGroupList);
   // let obj = JSON.stringify(this.userGroupList);
   // //console.log('obj', obj);

    let processedUsers = {};
    users.forEach(user => {
      processedUsers[user.sortKey]=user;
    });
    userGroups.forEach(group => {

      group.userList = group.userList;
    //  group.userList = JSON.parse(group.userList);
   //   //console.log('group.userList',group.userList);
    });
    userData['usersObject']=processedUsers;
  }

  closeNewGroup(mep){
    debugger
    this.newGroup={
     
      "display_name":'',
      userList:[],
      permissions:{
        "admin":false,
      'alerts':{'receive':false,'send':false},
      'report':{'generate':false},
      'sitePermissions':{},
      'userGroups':{'add':false,'view':false,'edit':false,'delete':false},
      'dashboard':{'add':false,'view':false,'edit':false,'delete':false,'asHome':false},
      'users':{'add':false,'view':false,'edit':false,'delete':false},
      'applications':{'add':false,'view':false,'edit':false,'delete':false}
     
    }
  }
    mep.expanded = false;
  }

  assignGroup(){

  }
  
  addusertogroup (group){
    const inactiveUsers = [];
    this.selectedClientUsers['users'].forEach(user =>{
      if(user.status =='suspended'){
        inactiveUsers.push(user.sortKey)
      }
    });
     let existingUsers = [];
    if(group!=''){
    existingUsers.push(...group.userList);
    }
    const groupId = group.sortKey.split('#')[1];;
      const dialogRef = this.dialog.open(UsersComponent,{ 
        data: {
          clientId: this.selectedClientId,
          siteId:this.siteId,
          existingUsers,
          inactiveUsers
        },
        position:{top:'5%'}
      ,width:'592px',maxHeight:'max-content', panelClass:'modal-user',disableClose: true,});
  
      dialogRef.afterClosed().subscribe(result => {
        //console.log(result);
        if(result){
          // difference.forEach(element => {
          //   this.selectedClientUsers['usersObject'][element.sortKey]=element;
          // });
          this.inProcess = true;
          this._userService.getAllUsers(this.selectedClientId).subscribe((res:any)=>{
            if(res && res.userInfo){
              res.userInfo.users.forEach(element => {
                this.selectedClientUsers['usersObject'][element.sortKey]=element;
              });
              
              if(group.userList && group.userList.length>0){
                let difference = result.filter(x => !group.userList.includes(x));
              if(difference && difference.length>0)
                group.userList.unshift(...difference);
              }else{
                group.userList.push(...result);
              }
              let updatedUsers = {"userList":group.userList};
              this._groupService.updateGroupUsers(groupId,updatedUsers,this.selectedClientId).subscribe((res:any)=>{
                this.inProcess = false;
              },(httpError:HttpErrorResponse)=>{
                this.inProcess = false;
                //this.errorString = error.error.message;
                this.authService.updateErrorMessage(httpError['error']['message']);
                ////console.log("error",error);
              })
            }
          },(httpError:HttpErrorResponse)=>{
            this.inProcess = false;
            //this.errorString = err.error.message;
            this.authService.updateErrorMessage(httpError['error']['message']);
          })
      }
      });
  }



  cleargroup(){

    this.site = [];
    this.dashboard = [];
    this.application = [];
    this.siteInfoList = [];
    this.sitePermissonObject = {};
    this.isNewGroup = true;

    //console.log('change invoke');

  }

  
  adminChanged(group,e){
    // console.error(group.permissions.admin)
    this.isAdmin = group.permissions.admin;
    if(group.permissions.admin){
      group.permissions.alerts.receive=true;
      group.permissions.alerts.send=true;
      group.permissions.report.generate=true;
      group.permissions.userGroups.add=true;
      group.permissions.userGroups.view=true;
      group.permissions.userGroups.edit=true;
      group.permissions.userGroups.delete=true;
      group.permissions.dashboard.add=true;
      group.permissions.dashboard.view=true;
      group.permissions.dashboard.edit=true;
      group.permissions.dashboard.delete=true;
      group.permissions.dashboard.asHome=true;
      group.permissions.users.add=true;
      group.permissions.users.view=true;
      group.permissions.users.edit=true;
      group.permissions.users.delete=true;
      group.permissions.applications.add=true;
      group.permissions.applications.view=true;
      group.permissions.applications.edit=true;
      group.permissions.applications.delete=true;


      this.newGroupSiteList;
      this.siteInfoList = [];
      this.site = [];
      this.siteList = [];
    
      for(let i=0; i < this.newGroupSiteList.length; i++){

        this.siteInfoList.push(this.newGroupSiteList[i]);
        this.site.push(this.newGroupSiteList[i].name);
        this.siteList.push(this.newGroupSiteList[i].sortKey);

      }


      this.siteInfoList = [...new Set(this.siteInfoList)]

      //console.log('newGroupSiteList add --admin ', this.newGroupSiteList);
      //console.log('siteInfoList add --admin ', this.siteInfoList);
      //console.log('site add --admin ', this.site);

      // this.getApplicationList(this.siteInfoList);
      // this.getDashboardsList(this.siteInfoList);

      
    }else{
      group.permissions.alerts.receive=false;
      group.permissions.alerts.send=false;
      group.permissions.report.generate=false;
      group.permissions.userGroups.add=false;
      group.permissions.userGroups.view=false;
      group.permissions.userGroups.edit=false;
      group.permissions.userGroups.delete=false;
      group.permissions.dashboard.add=false;
      group.permissions.dashboard.view=false;
      group.permissions.dashboard.edit=false;
      group.permissions.dashboard.delete=false;
      group.permissions.dashboard.asHome=false;
      group.permissions.users.add=false;
      group.permissions.users.view=false;
      group.permissions.users.edit=false;
      group.permissions.users.delete=false;
      group.permissions.applications.add=false;
      group.permissions.applications.view=false;
      group.permissions.applications.edit=false;
      group.permissions.applications.delete=false;
    }
  }

  deleteEditedGroup(groupForDelete){
    this.inProcess = true;
    let groupIdForDelete = groupForDelete.split('#')[1];
    this._groupService.deleteGroup(groupIdForDelete,this.selectedClientId).subscribe((res:any)=>{
      this.inProcess = false;
        this.allUserGroups = this.allUserGroups.filter((group)=>{
          return group.sortKey != groupForDelete;
        })
        this.editGroupSaveBtnText = "Save";
        this.isShowDetails = true;
      this.groupForEdit = null;
      this.allApplicationsList = [];
      this.allDashboardsList = [];
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  saveEditedGroup(){

    if(this.editGroupSaveBtnText!='Save')
    return false;
    this.editGroupSaveBtnText = "Updating..."
    if(!this.groupForEdit || this.groupForEdit.display_name.trim().length<=0){
      this.editGroupError = "Please Enter Group Name";
      this.editGroupSaveBtnText = "Save";
      this.inputGroupNameEdit.nativeElement.focus();
      return false;
    }
    
    if(this.groupForEdit.display_name.trim().length>100){
      this.editGroupSaveBtnText = "Save";
      this.editGroupError = "Please Enter Valid Group Name";
      this.inputGroupNameEdit.nativeElement.focus();
      return false;
    }
    
    this.inProcess = true;
    const groupId = this.groupForEdit.sortKey.split('#')[1];;
    this._groupService.updateGroupName(this.groupForEdit.display_name,this.selectedClientId,groupId).subscribe((res:any)=>{
      //console.log("name update",res);
      this.allUserGroups = this.allUserGroups.map((group)=>{
        if(group.sortKey == this.groupForEdit.sortKey){
          group.display_name = res.display_name;
        }
        return group;
      }
      )

     
      
      this.groupForEdit.permissions.sitePermissions = this.updatesitePermissonObject;
    //console.log('update groupForEdit.permissions' , this.groupForEdit.permissions)
      this._groupService.updateGroupPermissions(this.groupForEdit.permissions,this.selectedClientId,groupId).subscribe((res:any)=>{
        this.inProcess = false;
        this.allUserGroups = this.allUserGroups.map((group)=>{
          if(group.sortKey == this.groupForEdit.sortKey){
            group.permissions = res.permissions;
          }
          return group;
        })
        this.editGroupSaveBtnText = "Save";
        this.isShowDetails = true;
      this.groupForEdit = null;
      this.allApplicationsList = [];
      this.allDashboardsList = [];
      },(err)=>{
        this.inProcess = false;
        this.authService.updateErrorMessage(err['error']['message']);
        this.editGroupSaveBtnText = "Save";
      })
    },(httpError:HttpErrorResponse)=>{
      this.inProcess = false;
      //this.errorString = err.error.message;
      this.editGroupSaveBtnText = "Save";
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
   
    
  }

  getMessage(groupName: string, displayName: string) {

    //console.log('value', groupName);
    //console.log('displayName', displayName);
    const pattern = /[a-zA-Z0-9 ]/;

    if(pattern.test(groupName)){

      //console.log(' pattern alphanumeric value' );

    }
    if(groupName.match(pattern)){

      //console.log('alphanumeric value' );
      return true;
    }else{

      //console.log('Not alphanumeric value ' );

      return false;
    }


  //   let val = this.sitesForm.get(formControlName).value.trim();
  //   if (this.sitesForm.get(formControlName).status == "VALID") return;
  //  // this.isFormSubmitted = true;
  
  //   if (this.sitesForm.get(formControlName).touched && val.length == 0) {
  //     return displayName + " cannot be empty";
  //   }
  //   if (
  //     !this.sitesForm.get(formControlName).pristine &&
  //     this.sitesForm.get(formControlName).invalid
  //   )
  //     return "Entered " + displayName + " is invalid";
    //  this.isFormSubmitted = false;
  }



  // getMessage(formControlName: string, displayName: string) {
  //   let val = this.sitesForm.get(formControlName).value.trim();
  //   if (this.sitesForm.get(formControlName).status == "VALID") return;
  //  // this.isFormSubmitted = true;
  
  //   if (this.sitesForm.get(formControlName).touched && val.length == 0) {
  //     return displayName + " cannot be empty";
  //   }
  //   if (
  //     !this.sitesForm.get(formControlName).pristine &&
  //     this.sitesForm.get(formControlName).invalid
  //   )
  //     return "Entered " + displayName + " is invalid";
  //   //  this.isFormSubmitted = false;
  // }


  validationCheck(){

    if(this.newGroup.display_name.trim().length >= 0){
      this.isempty = false;
      this.inputGroupName.nativeElement.focus();


    }else{
      this.isempty = true;

    }

    

  }

  saveNewGroup(mep){
    
    if(this.newGroupSaveBtnText!='Save')
    return false;
    this.newGroupSaveBtnText = "Saving...";
    if(!this.newGroup || this.newGroup.display_name.trim().length<=0){
      this.newGroupSaveBtnText = "Save";
      this.newGroupError = "Please Enter Group Name";
      this.isempty = true;

      this.inputGroupName.nativeElement.focus();

      return false;
    }
    if(this.newGroup.display_name.trim().length>100 ){
      this.newGroupSaveBtnText = "Save";
      this.newGroupError = "Please Enter Valid Group Name";
      this.inputGroupName.nativeElement.focus();
      this.isempty = true;

      return false;
    }
   

this.inProcess = true;    
//console.log('Group',this.newGroup);
    this.newGroup.permissions.sitePermissions = this.sitePermissonObject;
    //console.log('created group:',  this.newGroup);
    this._groupService.addNewGroup(this.newGroup,this.selectedClientId).subscribe((res:any)=>{
      this.inProcess = false;
      this.application = [];
      this.dashboard = [];
      this.site = [];
      if(res){
        this.allUserGroups.push(res);
        this.closeNewGroup(mep);
      }
      this.newGroupSaveBtnText = "Save";
    },(httpError:HttpErrorResponse)=>{
      this.inProcess = false;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
      this.newGroupSaveBtnText = "Save";
    })
  }





  goBack(){

    this.router.navigate(['clients','view', 'client#'+this.selectedClientId]);
   }
 
 
  closeSetting(){

    this.isShowDetails = true;
    this.groupForEdit = null;
    this.allApplicationsList = [];
    this.allDashboardsList = [];
  }

  changeGroupSetting(group) {

    this.isNewGroup = false;
    this.groupForEdit = JSON.parse(JSON.stringify(group));
   // console.log('edit groupForEdit', this.groupForEdit);
    this.getSites(this.groupForEdit.primaryKey);

  

  if(this.groupForEdit.permissions.admin){

 //   createdashboards.push(dashboards.sortKey);

setTimeout(() => {
  this.siteList = [];

  this.allsites.forEach(site =>{
    this.siteList.push(site.sortKey);
  })

 // console.log('this.allsites',this.allsites);
 // console.log('this.siteList',this.siteList);

  
}, 2000);
 

    

  } else{


   this.siteList = [];

    let siteListNames = [];
    try{
      siteListNames = Object.keys(this.groupForEdit.permissions.sitePermissions);
    }
    catch(e){}
    this.siteList = siteListNames;


      setTimeout(() => { 

        this.groupEditApllicationList = [];
        this.groupEditDashboardList = [];

        for(var i = 0; i < this.siteList.length; i++){

         if(this.groupForEdit.permissions.sitePermissions[this.siteList[i]].applications.length > 0){
          for(var j=0 ; j < this.groupForEdit.permissions.sitePermissions[this.siteList[i]].applications.length; j++){
            this.groupEditApllicationList.push(this.groupForEdit.permissions.sitePermissions[this.siteList[i]].applications[j]);
          }
      }
    }

    for(var k = 0; k < this.siteList.length; k++){

          if(this.groupForEdit.permissions.sitePermissions[this.siteList[k]].dashboards.length > 0){
            for(var m=0 ; m < this.groupForEdit.permissions.sitePermissions[this.siteList[k]].dashboards.length; m++){
              this.groupEditDashboardList.push(this.groupForEdit.permissions.sitePermissions[this.siteList[k]].dashboards[m]);

            }
          }
    }

      },1000);

}

     //console.log("siteList",this.siteList);
     this.isShowDetails = false;    
  

    
  }

 


  

  getPhoto(url: string){
    return typeof(url) !== 'undefined' && url ? url : 'assets/sample-site-image.png';
  }

  getUserSites(user){
    return this.selectedClientSites.filter((site)=>{
     
     if(site.emergencyContacts.includes(user)){
       return site;
     }
   })
 }

 getGroupDetails(groupId){
  return this.allUserGroups.find(group => group.sortKey==groupId);
  }

}
