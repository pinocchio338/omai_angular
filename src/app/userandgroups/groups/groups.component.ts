import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from 'src/app/clients/clients.service';
import { UseruploadComponent } from 'src/app/shared/userupload/userupload.component';
import { NewuserComponent } from 'src/app/users/newuser/newuser.component';
import { UserService } from 'src/app/users/user.service';
import { ClientgroupsService } from '../clientgroup.service';
import { GroupsService } from '../../groups/groups.service';
import { AuthService } from '../../auth.service'
import { GroupsNewUserComponent } from '../groups-new-user/groups-new-user.component';
import { HttpErrorResponse } from '@angular/common/http';
import * as xml2js from 'xml2js';
import { ImagecropperComponent } from 'src/app/shared/imagecropper/imagecropper.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  @ViewChild('inputGroupName') inputGroupName: ElementRef;
  @ViewChild('inputGroupNameEdit') inputGroupNameEdit: ElementRef;
  @ViewChild("userImage") userImage: ElementRef;

  dataLoaded: boolean = false;
  isFormSubmitted = false;
  allUsers: Array<any> = [];
  allUsersData: Array<any> = [];
  allUserGroups: Array<any> = [];
  isShowDetails = true;
  groupList = [];
  selectedClientSites: any[];
  selectedClientUsers: any[];
  clientInfo: any = null;
  userGroupList: any;
  clientId: any = 63550;
  clientData: object = null;
  newUserSelected: boolean = false;
  selectedUser: any = null;
  editedUser: any = null;
  editInProcess: boolean = false;
  selectUsersToAddGroup: Array<any> = [];
  allApplicationsList: Array<any> = [];
  allDashboardsList: Array<any> = [];
  siteId: any = null;
  groupForEdit: any = null;
  newGroupError: string = '';
  editGroupError: string = '';
  siteList: any;
  siteInfoList = [];
  siteInfoDashboardList = [];
  siteInfoApplicationList = [];
  groupPermissions: object = null;
  userPermissions: object = null;
  isvalidStatus: boolean = false;
  userForm: UntypedFormGroup;
  application = [];
  dashboard = [];
  site  = [];

  newGroup: any = {
    "name": '',
    userList: [],
    permissions: {

      "admin": false,
      'alerts': { 'receive': false, 'send': false },
      'report': { 'generate': false },
      'sitePermissions': {},
      'userGroups': { 'add': false, 'view': false, 'edit': false, 'delete': false },
      'dashboard': { 'add': false, 'view': false, 'edit': false, 'delete': false, 'asHome': false },
      'users': { 'add': false, 'view': false, 'edit': false, 'delete': false },
      'applications': { 'add': false, 'view': false, 'edit': false, 'delete': false }

    }
  }

  file: File;
  imageUrl: string | ArrayBuffer = '';
  fileName: string = "No file selected";
  selectedUserGroupId: any;
  newGroupSiteList: any;
  groupEditApllicationList: any[];
  groupEditDashboardList: any[];
  SitePermissions: {};
  sitePermissonObject: {};
  dashlist: any[];
  applist: any[];
  dashboardInfoList = [];
  applicationInfoList = [];
  updatedashboardInfoList = [];
  updateApllicationList = [];
  updatesitePermissonObject: {};
  userRole: string;
  selectedUserPhoto: any;
  user_id: any;
  client_id: any;
  formObject: any;
  userDetailInfo: any;
  errorString="";
  addressJsonRes: any;
  selectedSite: string = '';
  @ViewChild('csvReader') csvReader: any; 
  allsites: any;
  constructor(private _groupService: GroupsService,
    private _userService: UserService,
    private clientService: ClientsService, 
    private _clientGroupService: ClientgroupsService, 
    private fb: UntypedFormBuilder, private router: Router, 
    private route: ActivatedRoute, 
    private authService: AuthService,
    private userService: UserService,
    public dialog: MatDialog) {


  }
  importUsersListener($event: any): void {  
    let files = $event.srcElement.files;  
    if(files && files.length>0){
      const dialogNewUserRef = this.dialog.open(UseruploadComponent, {
        data: {
          clientId: this.clientId,
          files:files
        },
        hasBackdrop: false
        , width: '592px', disableClose: true , panelClass: 'modal-user-upload'
      });
      dialogNewUserRef.afterClosed().subscribe(result => {
       if (result > 0) {
        this.getUsers(this.clientId)
        this.getSites(this.clientId);
        }else{
          this.csvReader.nativeElement.value = ""; 
        }
      });
    }
  }  
  fileReset() {  
    this.csvReader.nativeElement.value = "";
  }  
uploadUsers() {
  this.csvReader.nativeElement.click();
}
  
  ngOnInit(): void {
    this.clientId = this.route.snapshot.params.clientId.split('#')[1];
    this.selectedSite = sessionStorage.getItem('selectedSite');
    // console.error(this.clientId);
    this.groupPermissions = this.authService.getPermission('userGroups')
    this.userPermissions = this.authService.getPermission('users');
    this.userRole = this.authService.getRole();
    this.getSiteInfoByClientId(this.clientId);
    this.dataLoaded = false;
    this.getUsers(this.clientId)
    this.getSites(this.clientId);
    this.newObject();
  }


  userFields = {
    // 'email': "user2@gmail.com"
    // 'name': { fieldName: 'name', mode: 'view', oldValue: null },
    'phone': { fieldName: 'phone', mode: 'view', oldValue: null }
    // 'address': { fieldName: 'address', mode: 'view', oldValue: null },
    // 'photo': { fieldName: 'photo', mode: 'view', oldValue: null },


    //  'phone': "147852369"
  }

  newObject() {


    this.formObject = {

      'selectedUserPhone': ['', [Validators.required, Validators.minLength(10), Validators.maxLength(17)]],

    };
    this.userForm = this.fb.group(this.formObject);
  }


  get f() { return this.userForm.controls; }


  cleargroup(){

    this.site = [];
    this.dashboard = [];
    this.application = [];
    this.siteInfoList = [];
    this.sitePermissonObject = {};

    //console.log('change invoke');

  }




  getSiteInfoByClientId(clientId) {
    this._groupService.getSiteInfoByClient(clientId).subscribe((response: any) => {
      //console.log('getSiteInfoByClientId', response);
      this.newGroupSiteList = response['sites'];
    },(httpError:HttpErrorResponse)=>{
     
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  isAllowed(key: string, type: string) {
    return this.authService.isAllowed(key, type);
  }

updateUserAfterAddRemove(){
  let seluser = this.selectedUser;
     
  this.selectedUser = null;
  //this.userDetailInfo = user;
  this._userService.getAllUsers(this.clientId).subscribe((userData: any) => {
    //console.log(userData);
    this.allUsers = userData.userInfo.users;
    this.allUsersData = this.allUsers;
    this.allUserGroups = userData.userInfo.userGroups;
    this.selectedClientUsers = userData['userInfo'];
    this.processUsersData(this.selectedClientUsers);
    if(seluser){
    let Updatedselecteduser = this.allUsers.find(aluser=>aluser.sortKey == seluser.sortKey);
    //console.log("Updatedselecteduser",Updatedselecteduser);
    this.selectUsersToAddGroup = this.selectUsersToAddGroup.map((selutg)=>{
      let upuser=this.allUsers.find(usr=>usr.sortKey==selutg.sortKey);
      if(upuser){
        return upuser;
      }else{
        selutg;
      }
    })
    this.selectUser(Updatedselecteduser);
  }
    this.dataLoaded = true;
 
  },(httpError:HttpErrorResponse)=>{
    this.dataLoaded =  true;
    //this.errorString = err.error.message;
    this.authService.updateErrorMessage(httpError['error']['message']);
  })
}
  
  deleteUserFromGroup( user:any , usergroup:any  ){

    // //console.log('before delete user List ', usergroup.userList);
     const index = usergroup.userList.indexOf(user);
     if (index > -1) {
       usergroup.userList.splice(index, 1);
     }
   //  //console.log('updated userList ',usergroup.userList); 

     let updatedUsers = {"userList": usergroup.userList};
     const group_Id = usergroup.sortKey.split('#')[1];;
     this.dataLoaded = false;
    //  console.error(group_Id,updatedUsers,this.clientId)
     this._groupService.updateGroupUsers(group_Id,updatedUsers,this.clientId).subscribe((res:any)=>{
     
      this.updateUserAfterAddRemove();

     },(httpError:HttpErrorResponse)=>{
       this.dataLoaded = true;
       //this.errorString = err.error.message;
       this.authService.updateErrorMessage(httpError['error']['message']);
     })
}



  editchange(event, selecteddata) {

    //console.log('edit event', event.source.selected);
    //console.log('edit selecteddata', selecteddata);
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

      //console.log('siteInfoList add ', this.siteInfoList);
    //  //console.log('siteInfoList add ', this.siteInfoList);

      
    

      //console.log('------------this.groupEditApllicationList', this.groupEditApllicationList);
      //console.log('-------------this.groupEditDashboardList', this.groupEditDashboardList);
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



  change(event, selecteddata) {

    //console.log('site event', event.source.selected);
    //console.log('site selecteddata', selecteddata);
    this.updatesitePermissonObject = {};

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
    //console.log('siteInfoList final', this.siteInfoList);
    this.createSitePermissinObj();

  }



  selectedDashboard(event, selecteddata) {

    //console.log('create dashboard event', event.source.selected);
    //console.log('create dashboard selecteddata', selecteddata);

    if (event.source.selected && event.source.value == selecteddata.sitename + '-' + selecteddata.name) {
      this.dashboardInfoList.push(selecteddata);
      //console.log('dashboardInfoList add ', this.dashboardInfoList);
      // this.getApplicationList(this.siteInfoList);
      // this.getDashboardsList(this.siteInfoList);
    } else {
      for (var i = 0; i < this.dashboardInfoList.length; i++) {
        if (this.dashboardInfoList[i] === selecteddata) {
          this.dashboardInfoList.splice(i, 1);
          //console.log('dashboardInfoList remove', this.dashboardInfoList);
          //  this.getApplicationList(this.siteInfoList);
          // this.getDashboardsList(this.siteInfoList);
        }
      }
    }
    //console.log('dashboardInfoList final', this.dashboardInfoList);
    this.createSitePermissinObj();


  }

  editdashboard(event, selecteddata) {


    //console.log('edit dashboard event------------', event.source.selected);
    //console.log('edit dashboard selecteddata------------', selecteddata);

    if (event.source.selected && event.source.value == selecteddata.sortKey) {
      this.updatedashboardInfoList.push(selecteddata);
      this.updatedashboardInfoList = [...new Set(this.updatedashboardInfoList)]
      //console.log(this.updatedashboardInfoList)
      //console.log('edit groupEditDashboardList add ', this.groupEditDashboardList);
    } else {
      for (var i = 0; i <= this.updatedashboardInfoList.length; i++) {
        if (this.updatedashboardInfoList[i] === selecteddata) {
          this.updatedashboardInfoList.splice(i, 1);
          //console.log('updatedashboardInfoList remove', this.updatedashboardInfoList);
        }
      }
    }
    //console.log('updatedashboardInfoList', this.updatedashboardInfoList);
    this.updateSitePermissinObj();
  }






  selectedApplications(event, selecteddata) {

    //console.log('application event', event.source.selected);
    //console.log('application selecteddata', selecteddata);

    if (event.source.selected && event.source.value == selecteddata.sitename + '-' + selecteddata.name) {

      this.applicationInfoList.push(selecteddata);
      this.applicationInfoList = [...new Set(this.applicationInfoList)]

      //console.log('applicationInfoList add ', this.applicationInfoList);
      // this.getApplicationList(this.siteInfoList);
      // this.getDashboardsList(this.siteInfoList);

    } else {
      for (var i = 0; i < this.applicationInfoList.length; i++) {
        if (this.applicationInfoList[i] === selecteddata) {
          this.applicationInfoList.splice(i, 1);
          //console.log('applicationInfoList remove', this.applicationInfoList);
          //  this.getApplicationList(this.siteInfoList);
          // this.getDashboardsList(this.siteInfoList);
        }
      }
    }
    //console.log('applicationInfoList final', this.applicationInfoList);

    this.createSitePermissinObj();
  }


  editapplication(event, selecteddata) {


    //console.log('edit application event------------', event.source.selected);
    //console.log('edit application selecteddata------------', selecteddata);

    if (event.source.selected && event.source.value == selecteddata.sortKey) {
      this.updateApllicationList.push(selecteddata);
      this.updateApllicationList = [...new Set(this.updateApllicationList)]

      
      //console.log('edit updateApllicationList add ', this.updateApllicationList);
    } else {
      for (var i = 0; i <= this.updateApllicationList.length; i++) {
        if (this.updateApllicationList[i] === selecteddata) {
          this.updateApllicationList.splice(i, 1);
          //console.log('updateApllicationList remove', this.updateApllicationList);
        }
      }
    }

    //console.log('updateApllicationList ', this.updateApllicationList);

    this.updateSitePermissinObj();

  }


  createSitePermissinObj() {

    this.sitePermissonObject = {};

    //console.log('siteInfoList length', this.siteInfoList);
    //console.log('siteInfoDashboardList length', this.siteInfoDashboardList);
    //console.log('dashlist length', this.dashboardInfoList);
    //console.log('applist length', this.applicationInfoList);


    for (var l = 0; l < this.siteInfoList.length; l++) {
      let dashboards = [];
      this.dashboardInfoList.forEach(dashboard => {
        if (dashboard['sitesortkey'] == this.siteInfoList[l].sortKey)
          dashboards.push(dashboard.sortKey)
      })

      let applications = [];
      this.applicationInfoList.forEach(application => {
        if (application['sitesortkey'] == this.siteInfoList[l].sortKey)
          applications.push(application.sortKey)
      })

      this.sitePermissonObject[this.siteInfoList[l].sortKey] = {
        "dashboards": dashboards,
        "applications": applications
      }
    }
    //console.log('siteInfoApplicationList', this.siteInfoApplicationList);
    //console.log('sitePermissonObject', this.sitePermissonObject);
  }


  updateSitePermissinObj() {

    this.updatesitePermissonObject = {};

    //console.log('update siteInfoList length', this.siteInfoList);
    //console.log('update dashlist length', this.updatedashboardInfoList);
    //console.log('update application length', this.updateApllicationList);

    if(this.siteInfoList.length > 0){

      for (var l = 0; l < this.siteInfoList.length; l++) {
        let dashboards = [];
        this.updatedashboardInfoList.forEach(dashboard => {
          if (dashboard['sitesortkey'] == this.siteInfoList[l].sortKey)
            dashboards.push(dashboard.sortKey)
        })
  
        let applications = [];
        this.updateApllicationList.forEach(application => {
          if (application['sitesortkey'] == this.siteInfoList[l].sortKey)
            applications.push(application.sortKey)
        })
  
        this.updatesitePermissonObject[this.siteInfoList[l].sortKey] = {
          "dashboards": dashboards,
          "applications": applications
        }
      }
  
      //console.log('update updatedashboardInfoList', this.updatedashboardInfoList);
      //console.log('update siteInfoApplicationList', this.updateApllicationList);
      //console.log(' update sitePermissonObject', this.updatesitePermissonObject);
    
    }else{


    }
  
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
    //console.log('siteInfoDashboardList', this.siteInfoDashboardList);



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
    //console.log('admin siteInfoDashboardList', this.siteInfoDashboardList);

   // this.dashboard.push()

   for(var i = 0; i < this.siteInfoDashboardList.length; i++){

    this.dashboard.push(this.siteInfoDashboardList[i].sitename+'-'+this.siteInfoDashboardList[i].name)
    this.groupEditDashboardList.push(this.siteInfoDashboardList[i].sortKey);

   }
   //console.log('admin groupEditDashboardList', this.groupEditDashboardList)


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

    //console.log('siteInfoApplicationList', this.siteInfoApplicationList);

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

  getUserSitesDataInfo(){
    let selectedUser_Sites = [];
    this.allUserGroups.forEach((agrp)=>{
      if(this.selectedUser.userGroups.includes(agrp.sortKey) && agrp.permissions.sitePermissions){
      selectedUser_Sites.push(...Object.keys(agrp.permissions.sitePermissions));
      }
    });
    return selectedUser_Sites;
  }
  getUserSites(user) {
    let selectedUser_Sites = this.getUserSitesDataInfo();

    return this.selectedClientSites.filter((site) => {
      if(selectedUser_Sites.includes(site.sortKey)){
        return site;
      }
    
      
      
      // if (site.emergencyContacts.includes(user)) {
      //   //console.log('users site', site);
      //   //console.log('users user', user);
      //   return site;
      // }
    })
  }
  getSites(clientId) {
    // console.error('client id---', this.clientId)
    this.clientService.getSites(clientId).subscribe((sitesData) => {

      this.selectedClientSites = sitesData['sites'];
      this.allsites = sitesData['sites'];

      // this.selectedClientSites.forEach(site => {
      // //  site['siteLayouts'] = JSON.parse(site['siteLayouts'])
      //   site['siteLayouts'] = site['siteLayouts']
      // //  site['emergencyContacts'] = JSON.parse(site['emergencyContacts'])
      // site['emergencyContacts'] = site['emergencyContacts']
      // })
    },(httpError:HttpErrorResponse)=>{
      
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  deleteEditedGroup(groupForDelete) {
    this.dataLoaded = false;
    let groupIdForDelete = groupForDelete.split('#')[1];
    // console.error(groupIdForDelete, this.clientId)
    this._clientGroupService.deleteGroup(groupIdForDelete, this.clientId).subscribe((res: any) => {
      this.dataLoaded = true;
      this.allUserGroups = this.allUserGroups.filter((group) => {
        return group.sortKey != groupForDelete;
      })

      this.isShowDetails = true;
      this.groupForEdit = null;
      this.allApplicationsList = [];
      this.allDashboardsList = [];
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  saveEditedGroup() {

    if (!this.groupForEdit || this.groupForEdit.name.trim().length <= 0) {
      this.editGroupError = "Please Enter Group Name";
      this.inputGroupNameEdit.nativeElement.focus();
      return false;
    }

    if (this.groupForEdit.name.trim().length > 100) {
      this.editGroupError = "Please Enter Valid Group Name";
      this.inputGroupNameEdit.nativeElement.focus();
      return false;
    }

    this.dataLoaded = false;
    const groupId = this.groupForEdit.sortKey.split('#')[1];
    // console.error(this.groupForEdit.name, this.clientId, groupId)
    this._clientGroupService.updateGroupName(this.groupForEdit.display_name, this.clientId, groupId).subscribe((res: any) => {
      this.allUserGroups = this.allUserGroups.map((group) => {
        if (group.sortKey == this.groupForEdit.sortKey) {
          group.display_name = res.display_name;
        }
        return group;
      }, (error:HttpErrorResponse)=>{
        this.dataLoaded = true;
        this.authService.updateErrorMessage(error['error']['message']);
      })
      // console.error(this.groupForEdit.permissions, this.clientId, groupId)
      this.groupForEdit.permissions.sitePermissions = this.updatesitePermissonObject;

      this._clientGroupService.updateGroupPermissions(this.groupForEdit.permissions, this.clientId, groupId).subscribe((res: any) => {
        this.dataLoaded = true;
        this.allUserGroups = this.allUserGroups.map((group) => {
          if (group.sortKey == this.groupForEdit.sortKey) {
            group.permissions = res.permissions;
          }
          return group;
        })
        this.isShowDetails = true;
        this.groupForEdit = null;
        this.allApplicationsList = [];
        this.allDashboardsList = [];
        this.site = [];
        this.dashboard = [];
        this.application = [];
        this.siteInfoList = [];

      }, (httpError:HttpErrorResponse) => {
        this.dataLoaded = true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
      })
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })


  }
  deleteUser(userForDelete) {
    let userIdForDelete = userForDelete.sortKey.split('#')[1];
    this.dataLoaded = false;
    this.selectedUser = null;
    this._userService.userDelete(this.clientId, userIdForDelete).subscribe((res) => {
      this.getUsers(this.clientId);

    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded =  true;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  activeUser(userForActive) {
    let userIdForActive = userForActive.sortKey.split('#')[1];
    this.dataLoaded = false;
    //this.selectedUser = null;
    this._userService.userActivate(this.clientId, userIdForActive).subscribe((res) => {
      this.selectedUser.status = 'active';
      this.getUsers(this.clientId);

    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded =  true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  



  inlineFieldChangeMode(fieldName: string, mode: string, data: any) {
    if (mode == 'edit') {
   
      if (fieldName == 'phone') {


        const phoneNo = {
          'selectedUserPhone': data.phone,
        }

        //console.log('user seleected', phoneNo);
        this.userForm.patchValue(phoneNo);

        // this.userForm.controls.selectedUserPhone.value = data.phone;
        // this.selectedUserPhone = data.phone;
        this.userFields[fieldName]['mode'] = mode
      }

      if (fieldName == 'emailtotext') {


        const phoneNo = {
          'selectedUserPhone': data.phone,
        }

        //console.log('user seleected', phoneNo);
        this.userForm.patchValue(phoneNo);

        // this.userForm.controls.selectedUserPhone.value = data.phone;
        // this.selectedUserPhone = data.phone;
        this.userFields[fieldName]['mode'] = mode
      }
     

    }

  }

 

  selectedUserName(arg0: string, selectedUserName: any) {
    throw new Error('Method not implemented.');
  }

  

  inlineFieldCancel(fieldName: string) {

    // this.selectedUserName =  this.userFields[fieldName]['oldValue'];
    this.userFields[fieldName]['mode'] = 'view'
  }


  suspendUser(userForSuspend) {
    let userIdForSuspend = userForSuspend.sortKey.split('#')[1];
    this.dataLoaded = false;
    //this.selectedUser = null;
    this._userService.userSuspend(this.clientId, userIdForSuspend).subscribe((res) => {
      this.selectedUser.status = 'suspended';
      this.getUsers(this.clientId);

    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded =  true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  saveNewGroup(mep) {

    if (!this.newGroup || this.newGroup.display_name.trim().length <= 0) {

      this.newGroupError = "Please Enter Group Name";
      this.inputGroupName.nativeElement.focus();
      return false;
    }
    if (this.newGroup.display_name.trim().length > 100) {
      this.newGroupError = "Please Enter Valid Group Name";
      this.inputGroupName.nativeElement.focus();
      return false;
    }
    this.dataLoaded = false;
    this.newGroup.permissions.sitePermissions = this.sitePermissonObject;
    //console.log('usergroup created group:', this.newGroup);
    this.checkbrowser();
    this._clientGroupService.addNewGroup(this.newGroup, this.clientId).subscribe((res: any) => {
      this.getUsers(this.clientId)

      this.dataLoaded = true;
      this.application = [];
      this.dashboard = [];
      this.site = [];
      if (res) {
        this.allUserGroups.push(res);
        this.closeNewGroup(mep);
      }
    }, (httpError:HttpErrorResponse) => {
      this.dataLoaded = true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }


  adminChanged(group, e) {
    if (group.permissions.admin) {


      group.permissions.alerts.receive = true;
      group.permissions.alerts.send = true;
      group.permissions.report.generate = true;
      group.permissions.userGroups.add = true;
      group.permissions.userGroups.view = true;
      group.permissions.userGroups.edit = true;
      group.permissions.userGroups.delete = true;
      group.permissions.dashboard.add = true;
      group.permissions.dashboard.view = true;
      group.permissions.dashboard.edit = true;
      group.permissions.dashboard.delete = true;
      group.permissions.dashboard.asHome = true;
      group.permissions.users.add = true;
      group.permissions.users.view = true;
      group.permissions.users.edit = true;
      group.permissions.users.delete = true;
      group.permissions.applications.add = true;
      group.permissions.applications.view = true;
      group.permissions.applications.edit = true;
      group.permissions.applications.delete = true;

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

 
      
    } else {

      group.permissions.alerts.receive = false;
      group.permissions.alerts.send = false;
      group.permissions.report.generate = false;
      group.permissions.userGroups.add = false;
      group.permissions.userGroups.view = false;
      group.permissions.userGroups.edit = false;
      group.permissions.userGroups.delete = false;
      group.permissions.dashboard.add = false;
      group.permissions.dashboard.view = false;
      group.permissions.dashboard.edit = false;
      group.permissions.dashboard.delete = false;
      group.permissions.dashboard.asHome = false;
      group.permissions.users.add = false;
      group.permissions.users.view = false;
      group.permissions.users.edit = false;
      group.permissions.users.delete = false;
      group.permissions.applications.add = false;
      group.permissions.applications.view = false;
      group.permissions.applications.edit = false;
      group.permissions.applications.delete = false;

    }
  }

  closeNewGroup(mep) {
    this.newGroup = {
      "display_name": '',
      userList: [],
      permissions: {
        "admin": false,
        'alerts': { 'receive': false, 'send': false },
        'report': { 'generate': false },
        'sitePermissions': {},
        'userGroups': { 'add': false, 'view': false, 'edit': false, 'delete': false },
        'dashboard': { 'add': false, 'view': false, 'edit': false, 'delete': false, 'asHome': false },
        'users': { 'add': false, 'view': false, 'edit': false, 'delete': false },
        'applications': { 'add': false, 'view': false, 'edit': false, 'delete': false }
      }
    }
    mep.expanded = false;
    this.site = [];
    this.dashboard = [];
    this.application = [];
  }

  addNewUser() {

    const dialogNewUserRef = this.dialog.open(NewuserComponent, {
      data: {
        clientId: this.clientId
      }
      , width: '592px', panelClass: 'modal-user', disableClose: true,
    });
    dialogNewUserRef.afterClosed().subscribe(result => {

      //console.log('Result',result);
      if (result) {
        this.getUsers(this.clientId);
      }
    });
  }
  clearSelectUsers() {
    this.selectUsersToAddGroup = [];
  }
  searchUser(searchStr) {
    if (searchStr && searchStr.trim().length > 0) {
      this.allUsers = this.allUsers.filter(u => u.name.toLowerCase().includes(searchStr.toLowerCase()));
    } else {
      this.allUsers = this.allUsersData;
    }
  }
  addUsersToGroup(group) {
    if (this.selectUsersToAddGroup.length <= 0) {
      return false;
    }

    let usersToAddToGroup = this.selectUsersToAddGroup.filter((x) => { if (!group.userList.includes(x.sortKey)) { return x.sortKey; } });

    if (usersToAddToGroup.length > 0) {
      this.dataLoaded = false;
      if (group.userList.length > 0) {
        usersToAddToGroup.forEach((grpuser) => {
          group.userList.unshift(grpuser.sortKey);
        })

      } else {
        usersToAddToGroup.forEach((grpuser) => {
          group.userList.push(grpuser.sortKey);
        })
      }
      let groupId = group.sortKey.split('#')[1];
      let updatedUsers = { "userList": group.userList };
      this._clientGroupService.updateGroupUsers(groupId, updatedUsers, this.clientId).subscribe((res: any) => {
        //console.log("res", res);
      
        this.updateUserAfterAddRemove();




       
      },(httpError:HttpErrorResponse)=>{
        this.dataLoaded = true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
      })
    }
  }
  getUsers(clientId) {

    this._userService.getAllUsers(clientId).subscribe((userData: any) => {
      //console.log(userData);
      this.allUsers = userData.userInfo.users;
      this.allUsersData = this.allUsers;
      this.allUserGroups = userData.userInfo.userGroups;
      this.selectedClientUsers = userData['userInfo'];
      this.processUsersData(this.selectedClientUsers);
      this.dataLoaded = true;


    setTimeout(() => {
    
     // this.checkbrowser();

     const ua1 = navigator.userAgent.toLowerCase(); 
     if (ua1.indexOf('safari') != -1) { 
       if (ua1.indexOf('chrome') > -1) {
        // alert("1 chrom") // Chrome
        //console.log('chrome');
 
         let shand4 = document.getElementsByClassName('userlist-height') as HTMLCollectionOf<HTMLElement>;
 
           if (shand4.length != 0) {
            // shand[0].style.minHeight = "calc(90vh)";
             shand4[0].style.height = "calc(100vh - 300px)";
           }
 
       } else {
         //alert("2 safari") // Safari
         //console.log('safari');
         let shand4 = document.getElementsByClassName('userlist-height') as HTMLCollectionOf<HTMLElement>;
 
         if (shand4.length != 0) {
          // shand[0].style.minHeight = "calc(70vh)";
           shand4[0].style.height = "calc(100vh - 400px)";
         }


         let shand2 = document.getElementsByClassName('groups-container') as HTMLCollectionOf<HTMLElement>;

         if (shand2.length != 0) {
          // shand[0].style.minHeight = "calc(70vh)";
          shand2[0].style.height = "calc(100vh - 250px)";
         }
         if(window.innerWidth <= 1197 ){
          shand2[0].style.height = "calc(100vh - 250px)";
          }else{
            shand2[0].style.height = "calc(100vh - 120px)";
          }

       }
     }


    }, 200);

    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded =  true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  selectUserToAddGroup(e, user) {
    if (e.target.checked) {
      this.selectUsersToAddGroup.push(user);
    } else {
      this.selectUsersToAddGroup = this.selectUsersToAddGroup.filter(suser => suser.sortKey != user.sortKey);
    }
  }
  uploadPhoto(event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      this.fileName = file.name;
      this.file = file;
      const dialogRef = this.dialog.open(ImagecropperComponent,{data:{
        file:event,
        ratio:1/1       
      }
    ,width:'592px',maxHeight:'max-content', panelClass:'modal-user',disableClose: true,hasBackdrop: false});
  
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.imageUrl = result;
        this.editedUser.photo = result;
        }else{
          event.target.value='';
        }
      });




      // const reader = new FileReader();
      // reader.readAsDataURL(file);
      // reader.onload = event => {
      //   this.imageUrl = reader.result;
      //   this.editedUser.photo = reader.result;
      // };

    }
  }
  changeImage() {
    this.userImage.nativeElement.click();
    this.selectedUser['edit']['photo'] = true
  }
  selectUser(user) {



    if (this.editInProcess)
      return false;
    this.selectedUser = user;
    this.userDetailInfo = user;

    this.editedUser = JSON.parse(JSON.stringify(this.selectedUser));
    if(this.editedUser['photo']){

    }else{
      this.editedUser['photo'] = 'assets/sample-site-image.png';
    }
    this.selectedUser['edit'] = {};


    setTimeout(() => {
    
     this.checkbrowser();

    }, 200);


  }


  checkbrowser(){


    const ua = navigator.userAgent.toLowerCase(); 
    if (ua.indexOf('safari') != -1) { 
      if (ua.indexOf('chrome') > -1) {
       // alert("1 chrom") // Chrome
       //console.log('chrome');

        let shand = document.getElementsByClassName('new-user-select-container') as HTMLCollectionOf<HTMLElement>;

          if (shand.length != 0) {
           // shand[0].style.minHeight = "calc(90vh)";
            shand[0].style.height = "calc(100vh - 50px)";
          }

          let shand2 = document.getElementsByClassName('groups-container') as HTMLCollectionOf<HTMLElement>;

          if (shand2.length != 0) {
           // shand[0].style.minHeight = "calc(70vh)";
           shand2[0].style.height = "calc(100vh - 50px)";
          }

      } else {
        //alert("2 safari") // Safari
        //console.log('safari');
        let shand = document.getElementsByClassName('new-user-select-container') as HTMLCollectionOf<HTMLElement>;

        if (shand.length != 0) {
         // shand[0].style.minHeight = "calc(70vh)";
          shand[0].style.height = "calc(100vh - 190px)";
        }


        let shand2 = document.getElementsByClassName('groups-container') as HTMLCollectionOf<HTMLElement>;

        if (shand2.length != 0) {
         // shand[0].style.minHeight = "calc(70vh)";
          shand2[0].style.height = "calc(100vh - 160px)";
        }

      }
    }

  



  }


  getGroupDetails(groupId) {
    return this.allUserGroups.find(group => group.sortKey == groupId);
  }
  cancelInlineEdit(editedUser, field) {

    editedUser[field] = this.selectedUser[field];
    this.selectedUser['edit'][field] = false;
    if (field == 'photo') {
      this.userImage.nativeElement.value = "";
    }

  }

  inlineFieldPhoneUpdate(fieldName: string, data: any) {
    let name = this.userFields[fieldName]['fieldName']


    //console.log('updated field value Name of USer', this.selectedUserName);
    //console.log('previous user deatils:', data);
    this.user_id = data['sortKey'].split('#')[1];
    this.client_id = data['primaryKey'].split('#')[1];

    if (fieldName == 'phone') {


      //console.log('phone length', this.userForm.controls.selectedUserPhone.value.length);

      if (this.userForm.controls.selectedUserPhone.status === "INVALID") {

        this.isFormSubmitted = true;
      } else {

        this.dataLoaded = false;
        const updatedUserData = {
            'phone': this.userForm.controls.selectedUserPhone.value
        }
        this.userService.userUpdate(this.client_id, this.user_id, updatedUserData).subscribe(response => {
          this.userFields[fieldName]['mode'] = 'view';
          let userInfo = this.authService.getUserInfo();
          if(userInfo['userId'] == response['sortKey']){
            userInfo['email'] = response['email'];
            userInfo['name'] = response['name'];
            userInfo['photo'] = response['photo'];
            userInfo['phone'] = response['phone'];
            this.authService.setUserInfo(userInfo);
          }
          this.dataLoaded = true;
            //console.log('update phone,', response['phone']);

         this.getUsers(this.clientId);
         this.selectUser(response);
        },(httpError:HttpErrorResponse)=>{
          this.dataLoaded = true;
          //this.errorString = err.error.message;
          this.authService.updateErrorMessage(httpError['error']['message']);
        })


      }



    }

    // if (fieldName == 'phone') {
    //   //console.log('phone length', this.userForm.controls.selectedUserPhone.value.length);
    //   if (this.userForm.controls.selectedUserPhone.status === "INVALID") {
    //     this.isFormSubmitted = true;
    //   } 
    // }
    }

    // getUsers(clientId) {
    // //  const clientId = this.selectedClientId.split('#')[1];
    //   this.clientService.getUsers(clientId).subscribe((userData) => {
  
    //     this.selectedClientUsers = userData['userInfo'];
    //     this.processUsersData(this.selectedClientUsers);
    //     // if (this.UserList.length == 0) {
    //     //   this.isShowUserInfo = false;
    //     // }
    //     // this.dataLoaded = true;
    //   })
    // }


    isAddressValid(editedUser: any , field){


      this.dataLoaded = false;
      //console.log('data-------', editedUser);
      if(editedUser.address.line1.trim()!='' &&  this.editedUser.address.zipCode.trim()!=''){
  
  
        let addressDetails = '<AddressValidateRequest USERID="325HUSHT1273">'+
      '<Revision>1</Revision>'+
      '<Address ID="0">'+
      '<Address1>'+ editedUser.address.line1  + '</Address1>'+
      '<Address2>'+ editedUser.address.line2 + '</Address2>'+
      '<City/>'+
      '<State>'+ editedUser.address.state  + '</State>'+
      '<Zip5>'+  editedUser.address.zipCode + '</Zip5>'+
      '<Zip4/>'+
      '</Address>'+
      '</AddressValidateRequest>';
  
      //console.log('addressDetails', addressDetails);
      this.clientService.verifyAddress(addressDetails).subscribe((response) => {
        //console.log('address validation  Response:', response);
  
      },(err:any)=>{
  
    this.dataLoaded = true;
    if(err.error.text.includes('Error')){
  
      //console.log('if',err.error.text.includes('Error'));
      ////console.log(err.error.text.getElementsByTagName('Description')[0]);
     // var x = xmlDoc.getElementsByTagName("title")[0];
  
      // this.errorString = 'Address Not Found.';
      this.authService.updateErrorMessage(this.errorString);
      // for (const key of Object.keys(this.subscriptionForm.controls)) {
      //   if (this.subscriptionForm.controls[key].invalid) {
      //     const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
      //     invalidControl.focus();
      //     break;
      //  }
      // }
  
    }else{
  
      const parser = new xml2js.Parser({ strict: false, trim: true });
      parser.parseString(err.error.text, (err, result) => {
        this.addressJsonRes = result;
  
        //console.log('verified address Response', this.addressJsonRes);
        //console.log('verified address Response', this.addressJsonRes);
        if(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1){
          editedUser.address.line2 = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1[0];
       
        }
  
        editedUser.address.line1 = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS2[0];
        editedUser.address.zipcode = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ZIP5[0];
        editedUser.address.city = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].CITY[0];
        editedUser.address.state = this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].STATE[0];
  
      });
  
      this.inlineFieldUpdate(editedUser , field);
      //console.log('else',err.error.text.includes('Error'));
  
    }
  
  });
  
  
      }else {
  
  
        this.inlineFieldUpdate( editedUser, field );
  
      }
  
      
    }
  



  inlineFieldUpdate(editedUser, field) {
    this.dataLoaded = false;
    this.editInProcess = true;
    const userId = editedUser.sortKey.split('#')[1];
    if(field == 'photo'){

      const updatedUserInfo = {
        'photo': editedUser.photo,
        'name': editedUser.name,
        'phone': editedUser.phone,
        'alertLevel': editedUser.alertLevel,
        'address': JSON.parse(JSON.stringify(editedUser.address)),
        'dutUser': editedUser.dutUser
      }
      this._userService.userUpdate(this.clientId, userId, updatedUserInfo).subscribe(response => {
        this.selectedUser['edit'][field] = false;
        this.selectedUser.photo = updatedUserInfo.photo;
        this.selectedUser.name = updatedUserInfo.name;
        this.selectedUser.phone = updatedUserInfo.phone;
        this.selectedUser.address = updatedUserInfo.address;
        this.editInProcess = false;
        let userInfo = this.authService.getUserInfo();
        if(userInfo['userId'] == response['sortKey']){
          userInfo['email'] = response['email'];
          userInfo['name'] = response['name'];
          userInfo['photo'] = response['photo'];
          userInfo['phone'] = response['phone'];
          this.authService.setUserInfo(userInfo);
        }
        this.getUsers(this.clientId);
      }, (httpError:HttpErrorResponse) => {
        this.editInProcess = false;
        this.dataLoaded = true;
       // this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })

    }else{


      const updatedUserInfo = {
        'name': editedUser.name,
        'phone': editedUser.phone,
        'alertLevel': editedUser.alertLevel,
        'address': JSON.parse(JSON.stringify(editedUser.address)),
        'dutUser': editedUser.dutUser,
        'emailtotext' : editedUser.emailtotext
      }
      this._userService.userUpdate(this.clientId, userId, updatedUserInfo).subscribe(response => {
        this.selectedUser['edit'][field] = false;
        let userInfo = this.authService.getUserInfo();
        if(userInfo['userId'] == response['sortKey']){
          userInfo['email'] = response['email'];
          userInfo['emailtotext'] = response['emailtotext'];
          userInfo['name'] = response['name'];
          userInfo['photo'] = response['photo'];
          userInfo['phone'] = response['phone'];
          this.authService.setUserInfo(userInfo);
        }
       // this.selectedUser.photo = updatedUserInfo.photo;
        this.selectedUser.name = updatedUserInfo.name;
        this.selectedUser.phone = updatedUserInfo.phone;
        this.selectedUser.address = updatedUserInfo.address;
        this.selectedUser.emailtotext = updatedUserInfo.emailtotext;
        this.editInProcess = false;
        this.dataLoaded = true;
        this.getUsers(this.clientId);
      }, (httpError:HttpErrorResponse) => {
        this.editInProcess = false;
        this.dataLoaded = true;
       // this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })

    }
  
  }


  processUsersData(userData: any[]) {

    let users = userData['users'];
    let processedUsers = {};
    users.forEach(user => {
      processedUsers[user.sortKey] = user;
    });

    userData['usersObject'] = processedUsers;
    //console.log(this.selectedClientUsers);

   // //console.log(this.selectedClientUsers['usersObject'][user]['photo']);
  }
  goBack() {
    this.router.navigate(['clients', 'view', this.clientId]);
  }


  closeSetting() {

    this.isShowDetails = true;
    this.groupForEdit = null;
    this.allApplicationsList = [];
    this.allDashboardsList = [];
    this.groupEditApllicationList = [];
    this.groupEditDashboardList = [];
  }


  changeGroupSetting(group) {

  

    this.groupForEdit = JSON.parse(JSON.stringify(group));
    this.allApplicationsList = this.groupForEdit.permissions.applications;
    this.allDashboardsList = this.groupForEdit.permissions.dashboard.dashboards;
    //console.log("groupForEdit", this.groupForEdit);

   

    this.isShowDetails = false;
    this.selectedUserGroupId = this.groupForEdit.sortKey;
   // const siteListNames = Object.keys(this.groupForEdit.permissions.sitePermissions);
    //console.log('siteListNames', siteListNames);
    //console.log('edit groupForEdit', this.groupForEdit);
    this.clientId =  this.groupForEdit.primaryKey.split('#')[1];
    // console.error(this.groupForEdit.primaryKey, this.clientId)    
    this.getSites(this.clientId);
    //this.siteList = siteListNames;


      

  if(this.groupForEdit.permissions.admin){


    setTimeout(() => {
      this.siteList = [];
    
      this.allsites.forEach(site =>{
        this.siteList.push(site.sortKey);
      })
    
    //  console.log('this.allsites',this.allsites);
     // console.log('this.siteList',this.siteList);
    
      
    }, 2000);
     
    
        
    
      } else{
    
    
       this.siteList = [];
    
        const siteListNames = Object.keys(this.groupForEdit.permissions.sitePermissions);
        this.siteList = siteListNames;
      //  console.log('edit sitekist', this.siteList);
    
    
          setTimeout(() => { 
    
            this.groupEditApllicationList = [];
            this.groupEditDashboardList = [];
    
            for(var i = 0; i < this.siteList.length; i++){
    
          //    console.log('SitePermission$$$$$$$$$$$', this.groupForEdit.permissions.sitePermissions[this.siteList[i]]); 
              if(this.groupForEdit.permissions.sitePermissions[this.siteList[i]].applications.length > 0){
              for(var j=0 ; j < this.groupForEdit.permissions.sitePermissions[this.siteList[i]].applications.length; j++){
                this.groupEditApllicationList.push(this.groupForEdit.permissions.sitePermissions[this.siteList[i]].applications[j]);
              }
          }
        }
    
        for(var k = 0; k < this.siteList.length; k++){
    
         //   console.log('SitePermission', this.groupForEdit.permissions.sitePermissions[this.siteList[k]]); 
              if(this.groupForEdit.permissions.sitePermissions[this.siteList[k]].dashboards.length > 0){
                for(var m=0 ; m < this.groupForEdit.permissions.sitePermissions[this.siteList[k]].dashboards.length; m++){
                  this.groupEditDashboardList.push(this.groupForEdit.permissions.sitePermissions[this.siteList[k]].dashboards[m]);
    
                }
              }
        }
    
          },1000);
    
    }
  






    this.isShowDetails = false;
  }

  loginAs(userMail: string){
    // console.error(userMail)
    sessionStorage.setItem('impersonateAs',userMail);
    this.router.navigateByUrl('/login');
  }


}
