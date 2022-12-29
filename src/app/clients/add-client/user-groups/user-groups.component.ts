import { Component, EventEmitter, Input, OnInit, Output , ElementRef} from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import { ClientsService } from '../../clients.service';
import { MatDialog } from '@angular/material/dialog';
 import { DraftModalBoxComponent } from '../draft-modal-box/draft-modal-box.component';
 import { GroupsService } from '../../../groups/groups.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';



@Component({
  selector: 'app-user-groups',
  templateUrl: './user-groups.component.html',
  styleUrls: ['./user-groups.component.scss']
})
export class UserGroupsComponent implements OnInit {
  errorString="";
  @Input() stepperData: any;
  @Output() loadUserGroupformEvent = new EventEmitter<any>();


  usergroupList = [];
  newGroupSiteList  = [];
  isShowAddsection = false;
  isShowUpdateAddsection = false;
  isShowAddbtn = true;
  formObject : any;
  checked = false;
  dataLoaded : boolean = false;
 clientId = localStorage.getItem('client_Id');

 
 isFormSubmitted : boolean = false;
 isupdateFormSubmitted : boolean = false;
 usergroupsForm : UntypedFormGroup;
 updatesitesForm: UntypedFormGroup;
 updateusergroupForm: UntypedFormGroup;
 usergroupLength: number = 0;
 editformObject: any;
 group_id: any;
  siteInfoList = [];
  siteInfoApplicationList: any[];
  siteInfoDashboardList: any[];
  sitePermissonObject: {};
  groupForEdit: any;
  siteList: string[];
  site = [];
  updatesitePermissonObject: any;
  updateclient_id: any;
  disbleSitedropdown = false;
  newdisbleSitedropdown: boolean;
  constructor(private el: ElementRef , private _groupService:GroupsService, private fb: UntypedFormBuilder, private clientsService : ClientsService , public dialog: MatDialog,private authService:AuthService  ) { }

  ngOnInit(): void {

    this.newObject();
    this.getAllUserGroupByClient();
    this.getSiteInfoByClientId(this.clientId);
   
  }


  showVal() {
    //console.log(this.usergroupsForm.controls);
  }
  
  getMessage(formControlName: string, displayName: string) {
    let val = this.usergroupsForm.get(formControlName).value.trim();
    if (this.usergroupsForm.get(formControlName).status == "VALID") return;
   // this.isFormSubmitted = true;
  
    if (this.usergroupsForm.get(formControlName).touched && val.length == 0) {
      return displayName + " cannot be empty";
    }
    if (
      !this.usergroupsForm.get(formControlName).pristine &&
      this.usergroupsForm.get(formControlName).invalid
    )
      return "Entered " + displayName + " is invalid";
    //  this.isFormSubmitted = false;
  }


  getUpdateMessage(formControlName: string, displayName: string) {
    let val = this.updateusergroupForm.get(formControlName).value.trim();
    if (this.updateusergroupForm.get(formControlName).status == "VALID") return;
   // this.isFormSubmitted = true;
  
    if (this.updateusergroupForm.get(formControlName).touched && val.length == 0) {
      return displayName + " cannot be empty";
    }
    if (
      !this.updateusergroupForm.get(formControlName).pristine &&
      this.updateusergroupForm.get(formControlName).invalid
    )
      return "Entered " + displayName + " is invalid";
    //  this.isFormSubmitted = false;
  }



  editadminChanged(groupform){

    this.disbleSitedropdown = groupform.controls.editaccessAdmin.value;
    //console.log(this.disbleSitedropdown);
    let isAdmin = groupform.controls.editaccessAdmin.value;
    if(isAdmin){
      groupform.controls['editaccessView'].setValue(true);
      groupform.controls['editaccessHome'].setValue(true);
      groupform.controls['editaccessAdd'].setValue(true);
      groupform.controls['editaccessEdit'].setValue(true);
      groupform.controls['editaccessDelete'].setValue(true);

      groupform.controls['edituserGroupView'].setValue(true);
      groupform.controls['edituserGroupAdd'].setValue(true);
      groupform.controls['edituserGroupEdit'].setValue(true);
      groupform.controls['edituserGroupDelete'].setValue(true);
      
      groupform.controls['edituserView'].setValue(true);
      groupform.controls['edituserAdd'].setValue(true);
      groupform.controls['edituserEdit'].setValue(true);
      groupform.controls['edituserDelete'].setValue(true);

      groupform.controls['editalertSend'].setValue(true);
      groupform.controls['editalertReceive'].setValue(true);
      groupform.controls['editalertGenerate'].setValue(true);

      
    groupform.controls['editApplicationView'].setValue(true);
    groupform.controls['editApplicationAdd'].setValue(true);
    groupform.controls['editApplicationEdit'].setValue(true);
    groupform.controls['editApplicationDelete'].setValue(true);

    this.newGroupSiteList;
    this.siteInfoList = [];
    this.site = [];
    this.siteList = [];


  // setTimeout(() => {

      for(let i=0; i < this.newGroupSiteList.length; i++){

        this.siteInfoList.push(this.newGroupSiteList[i]);
        this.siteList.push(this.newGroupSiteList[i].sortKey);
  
      }
  
  
      this.siteInfoList = [...new Set(this.siteInfoList)]
  
      //console.log('newGroupSiteList add --admin ', this.newGroupSiteList);
      //console.log('siteInfoList add --admin ', this.siteInfoList);
      //console.log('site add --admin ', this.site);
      //console.log('site add --admin ', this.siteList);
      
   // }, 1000);
  
  

     
    }else{
      groupform.controls['editaccessView'].setValue(false);
      groupform.controls['editaccessHome'].setValue(false);
      groupform.controls['editaccessAdd'].setValue(false);
      groupform.controls['editaccessEdit'].setValue(false);
      groupform.controls['editaccessDelete'].setValue(false);

      groupform.controls['edituserGroupView'].setValue(false);
      groupform.controls['edituserGroupAdd'].setValue(false);
      groupform.controls['edituserGroupEdit'].setValue(false);
      groupform.controls['edituserGroupDelete'].setValue(false);
      
      groupform.controls['edituserView'].setValue(false);
      groupform.controls['edituserAdd'].setValue(false);
      groupform.controls['edituserEdit'].setValue(false);
      groupform.controls['edituserDelete'].setValue(false);

      groupform.controls['editalertSend'].setValue(false);
      groupform.controls['editalertReceive'].setValue(false);
      groupform.controls['editalertGenerate'].setValue(false);

      groupform.controls['editApplicationView'].setValue(false);
      groupform.controls['editApplicationAdd'].setValue(false);
      groupform.controls['editApplicationEdit'].setValue(false);
      groupform.controls['editApplicationDelete'].setValue(false);

     
    }
  }
  adminChanged(groupform){

    let isAdmin =groupform.controls.accessAdmin.value;
    if(isAdmin){    
      
      
      this.newdisbleSitedropdown = true;



      groupform.controls['accessView'].setValue(true);
      groupform.controls['accessHome'].setValue(true);
      groupform.controls['accessAdd'].setValue(true);
      groupform.controls['accessEdit'].setValue(true);
      groupform.controls['accessDelete'].setValue(true);

      groupform.controls['userGroupView'].setValue(true);
      groupform.controls['userGroupAdd'].setValue(true);
      groupform.controls['userGroupEdit'].setValue(true);
      groupform.controls['userGroupDelete'].setValue(true);
      
      groupform.controls['userView'].setValue(true);
      groupform.controls['userAdd'].setValue(true);
      groupform.controls['userEdit'].setValue(true);
      groupform.controls['userDelete'].setValue(true);


      groupform.controls['applicationView'].setValue(true);
      groupform.controls['applicationAdd'].setValue(true);
      groupform.controls['applicationEdit'].setValue(true);
      groupform.controls['applicationDelete'].setValue(true);

      groupform.controls['alertSend'].setValue(true);
      groupform.controls['alertReceive'].setValue(true);
      groupform.controls['alertGenerate'].setValue(true);

      this.newGroupSiteList;
      this.siteInfoList = [];
      this.site = [];
      this.siteList = [];
    
      for(let i=0; i < this.newGroupSiteList.length; i++){

        this.siteInfoList.push(this.newGroupSiteList[i]);
        this.site.push(this.newGroupSiteList[i].name);

      }


      this.siteInfoList = [...new Set(this.siteInfoList)]

      //console.log('newGroupSiteList add --admin ', this.newGroupSiteList);
      //console.log('siteInfoList add --admin ', this.siteInfoList);
      //console.log('site add --admin ', this.site);
     
    }else{
      
      this.newdisbleSitedropdown = false;
      this.siteInfoList = [];


      groupform.controls['accessView'].setValue(false);
      groupform.controls['accessHome'].setValue(false);
      groupform.controls['accessAdd'].setValue(false);
      groupform.controls['accessEdit'].setValue(false);
      groupform.controls['accessDelete'].setValue(false);

      groupform.controls['userGroupView'].setValue(false);
      groupform.controls['userGroupAdd'].setValue(false);
      groupform.controls['userGroupEdit'].setValue(false);
      groupform.controls['userGroupDelete'].setValue(false);
      
      groupform.controls['userView'].setValue(false);
      groupform.controls['userAdd'].setValue(false);
      groupform.controls['userEdit'].setValue(false);
      groupform.controls['userDelete'].setValue(false);

      groupform.controls['applicationView'].setValue(false);
      groupform.controls['applicationAdd'].setValue(false);
      groupform.controls['applicationEdit'].setValue(false);
      groupform.controls['applicationDelete'].setValue(false);

      groupform.controls['alertSend'].setValue(false);
      groupform.controls['alertReceive'].setValue(false);
      groupform.controls['alertGenerate'].setValue(false);
     
    }
  }
  newObject(){

    this.formObject = {
      'accessAdmin': [false],
      'groupName': ['', Validators.required],
      'dashboardlist': [''],

      'accessView': [false],
      'accessHome': [false],
      'accessAdd': [false],
      'accessEdit': [false],
      'accessDelete': [false],

      'userGroupView': [false],
      'userGroupAdd': [false],
      'userGroupEdit': [false],
      'userGroupDelete': [false],

      'userView': [false],
      'userAdd': [false],
      'userEdit': [false],
      'userDelete': [false],


      'applicationView': [false],
      'applicationAdd': [false],
      'applicationEdit': [false],
      'applicationDelete': [false],

      'alertSend': [false],
      'alertReceive': [false],
      'applicationlist': [''],
      'alertGenerate': [''],    
      
    };
    this.usergroupsForm = this.fb.group(this.formObject);
  }

  get f() { return this.usergroupsForm.controls; }

  get f1() { return this.updateusergroupForm.controls; }


  getAllUserGroupByClient(){

    this.dataLoaded = true;

      this.clientsService.getAllUserandUserGroupByClient(this.clientId).subscribe((userGroupData)=> {
        //console.log('getAllUserGroupByClient',userGroupData);
        this.usergroupList = userGroupData['userInfo']['userGroups'];
        this.usergroupLength = this.usergroupList.length;
        this.dataLoaded = false;
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = false;
     // this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    });
  }

  deleteEditedGroup(groupId , clientid){
    this.dataLoaded = true;
   // let groupIdForDelete = groupForDelete.split('#')[1];
    //console.log('groupId',groupId);
    //console.log('clientid',clientid);

    this._groupService.deleteGroup(groupId,clientid).subscribe((res:any)=>{
      //console.log(res);
      this.dataLoaded = false;
      

      this.getAllUserGroupByClient();

      this.editObjGroup();
      this.isShowAddbtn = true;
      this.site = [];
      this.isShowUpdateAddsection = false;
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }


  getSiteInfoByClientId(clientId){
  //  this.dataLoaded = true;
    this._groupService.getSiteInfoByClient(clientId).subscribe((response:any)=> {
        //console.log('getSiteInfoByClientId', response);
        this.newGroupSiteList = response['sites'];
      //  this.dataLoaded = false;
        //console.log('newGroupSiteList', this.newGroupSiteList);
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }


  goForward(){

    if(this.usergroupList.length > 0){
      //console.log('user group html'); 
      this.loadUserGroupformEvent.emit(this.usergroupList);
        this.stepperData.next();
    }

  }

  change(event , selecteddata){

    //console.log('site event' , event.source.selected);
    //console.log('site selecteddata' , selecteddata);
  
    if((event.source.selected && event.source.value == selecteddata.name) && selecteddata.status=='active'){

        this.siteInfoList.push(selecteddata);
        //console.log('siteInfoList add ',  this.siteInfoList);
        this.getApplicationList(this.siteInfoList);
        this.getDashboardsList(this.siteInfoList);

    } else {
          for( var i = 0; i < this.siteInfoList.length; i++){ 
            if (  this.siteInfoList[i] === selecteddata) { 
                  this.siteInfoList.splice(i, 1); 
                  //console.log('siteInfoList remove',  this.siteInfoList);
                  this.getApplicationList(this.siteInfoList);
                  this.getDashboardsList(this.siteInfoList);
              }
          }
    }
       //console.log('siteInfoList final',  this.siteInfoList);

       this.createSitePermissinObj();
     
  }

    
  editchange(event , selecteddata){

    //console.log('edit event' , event.source.selected);
    //console.log('edit selecteddata' , selecteddata);
    if(event.source.selected && event.source.value == selecteddata.sortKey ){
        
        this.siteInfoList.push(selecteddata);
        this.siteInfoList=[...new Set(this.siteInfoList)]
        //console.log('siteInfoList add ',  this.siteInfoList);
        this.getApplicationList(this.siteInfoList);
        this.getDashboardsList(this.siteInfoList);

    }else {
   
     for( var i = 0; i < this.siteInfoList.length; i++){ 
       if (  this.siteInfoList[i] === selecteddata) { 
             this.siteInfoList.splice(i, 1); 
             //console.log('edit siteInfoList reove',  this.siteInfoList);
             this.getApplicationList(this.siteInfoList)
             this.getDashboardsList(this.siteInfoList)
   
         }
      }
    }
      //console.log('edit siteInfoList final',  this.siteInfoList);
      this.updateSitePermissinObj();

  }

  getDashboardsList(dashboardList: any){
    this.siteInfoDashboardList = [];
   var h= 0 ;
    for(var i = 0 ; i < dashboardList.length; i++){
      for(var j = 0 ; j <  dashboardList[i].dashboards.length; j++){

         // selecteddata.status=='active'
        if(dashboardList[i].dashboards[j].status!='deleted'){

          this.siteInfoDashboardList.push(dashboardList[i].dashboards[j]);
          this.siteInfoDashboardList[h]['sitename'] = dashboardList[i].name;
          this.siteInfoDashboardList[h]['sitesortkey'] = dashboardList[i].sortKey;
          h++;

        }
       
      }
    }
      //console.log('siteInfoDashboardList', this.siteInfoDashboardList);
  }

  getApplicationList(ApllicationList: any){
    this.siteInfoApplicationList = [];

    var h= 0 ;

    for(var i = 0 ; i < ApllicationList.length; i++){

      for(var j = 0 ; j <  ApllicationList[i].applications.length; j++){

        if(ApllicationList[i].applications[j].status!='deleted'){ 
          this.siteInfoApplicationList.push(ApllicationList[i].applications[j]);
          this.siteInfoApplicationList[h]['sitename'] = ApllicationList[i].name;
          this.siteInfoApplicationList[h]['sitesortkey'] = ApllicationList[i].sortKey;
          h++;
        }

    
      }
    }
    //console.log('siteInfoApplicationList', this.siteInfoApplicationList);

  }

  createSitePermissinObj(){

    this.sitePermissonObject = {};
      
    //console.log('siteInfoList length',this.siteInfoList);
    //console.log('siteInfoDashboardList length',this.siteInfoDashboardList);
    //console.log('siteInfoApplicationList', this.siteInfoApplicationList);

    
    for(var l = 0 ; l < this.siteInfoList.length; l++){
      this.sitePermissonObject[this.siteInfoList[l].sortKey] = { 
           "dashboards": this.siteInfoDashboardList,
           "applications": this.siteInfoApplicationList
       }
     }
       //console.log('sitePermissonObject', this.sitePermissonObject);
  }

  updateSitePermissinObj(){

    this.updatesitePermissonObject = {};
      
    //console.log('update siteInfoList length',this.siteInfoList);
    for(var l = 0 ; l < this.siteInfoList.length; l++){
     let dashboards =[];
     let applications =[];

      this.updatesitePermissonObject[this.siteInfoList[l].sortKey] = { 
           "dashboards": dashboards,
           "applications": applications
       }
     }
       //console.log(' update sitePermissonObject', this.updatesitePermissonObject);
  }


editObjGroup(){


  this.editformObject = {
    'editaccessAdmin':false,
    'editgroupName': ['', Validators.required],
    'editdashboardlist': [''],

    'editaccessView': [false],
    'editaccessHome': [false],
    'editaccessAdd': [false],
    'editaccessEdit': [false],
    'editaccessDelete': [false],

    'edituserGroupView': [false],
    'edituserGroupAdd': [false],
    'edituserGroupEdit': [false],
    'edituserGroupDelete': [false],

    'edituserView': [false],
    'edituserAdd': [false],
    'edituserEdit': [false],
    'edituserDelete': [false],

    'editApplicationView': [false],
    'editApplicationAdd': [false],
    'editApplicationEdit': [false],
    'editApplicationDelete': [false],

    'editalertSend': [false],
    'editalertReceive': [false],
    'editapplicationlist': [false],
    'editalertGenerate': [false]  
    
  };



  this.updateusergroupForm = this.fb.group(this.editformObject);

  this.isShowUpdateAddsection = true;
  this.isShowAddbtn = false;
  this.isShowAddsection = false;



}


  updateUserGroup(groupdata){


    //console.log(' groupdata',groupdata);
    this.group_id = groupdata['sortKey'].split('#')[1];
    this.updateclient_id = groupdata['primaryKey'].split('#')[1];


    this.editObjGroup();


    this.groupForEdit = JSON.parse(JSON.stringify(groupdata));

    if(this.groupForEdit.permissions.sitePermissions){

      const siteListNames = Object.keys(this.groupForEdit.permissions.sitePermissions);
      //console.log('siteListNames', siteListNames);
      this.siteList = siteListNames;

    }

  
    //console.log('edit groupForEdit', this.groupForEdit);


    if(groupdata.permissions.admin){

      this.disbleSitedropdown = true;

    }else{

      this.disbleSitedropdown = false;
    }
    
    // this.getSites(this.groupForEdit.primaryKey);

    

    const updateData = {
      'editaccessAdmin':groupdata.permissions.admin,
      'editgroupName': groupdata.display_name,
      'editdashboardlist':groupdata.permissions.dashboard.dashboards,

      'editaccessView': groupdata.permissions.dashboard.view,
      // 'editaccessHome': groupdata.permissions.dashboard.asHome,
      'editaccessAdd': groupdata.permissions.dashboard.add,
      'editaccessEdit': groupdata.permissions.dashboard.edit,
      'editaccessDelete': groupdata.permissions.dashboard.delete,

      'edituserGroupView':  groupdata.permissions.userGroups.view,
      'edituserGroupAdd':  groupdata.permissions.userGroups.add,
      'edituserGroupEdit':  groupdata.permissions.userGroups.edit,
      'edituserGroupDelete':  groupdata.permissions.userGroups.delete,

      'edituserView':   groupdata.permissions.users.view,
      'edituserAdd':    groupdata.permissions.users.add,
      'edituserEdit':   groupdata.permissions.users.edit,
      'edituserDelete': groupdata.permissions.users.delete,

      'editalertSend': groupdata.permissions.alerts.send,
      'editalertReceive': groupdata.permissions.alerts.receive,
      'editapplicationlist': '', 
      'editalertGenerate':    groupdata.permissions.report.generate, 

      'editApplicationView' :    groupdata.permissions.applications.view, 
      'editApplicationAdd' :    groupdata.permissions.applications.add, 
      'editApplicationEdit'  :    groupdata.permissions.applications.edit, 
      'editApplicationDelete':    groupdata.permissions.applications.delete, 


      
      
    }

    //console.log(' updateData groupdata',updateData);
    this.updateusergroupForm.patchValue(updateData);

  }

  updatecloseForm(){
    this.isShowUpdateAddsection = false;
    this.isShowAddbtn = true;
    this.isShowAddsection = false;
  }


  checkCheckBoxvalue(event){
    //console.log(event.checked)
  }

  onSubmitUsergroupsForm(event){ }


  goBack() {
   

    const dialogRef = this.dialog.open(DraftModalBoxComponent,{ 
     
      disableClose: true,
      position:{top:'2%'}
    ,width:'592px'});
    dialogRef.afterClosed().subscribe(result => {
      
      if(result){
       // this.getAlerts();
      }
    });    
  }



  closeForm(){
    this.newObject();
    this.isShowAddsection = false;
    this.isShowAddbtn = true;

  }

 addUserGroup(){

  this.newdisbleSitedropdown = false;
  this.isFormSubmitted = false;
  this.site = [];
  this.newGroupSiteList = [];
  this.siteInfoList = [];
  this.getSiteInfoByClientId(this.clientId);
  this.newObject();
  this.isShowAddsection = true;
  this.isShowAddbtn = false;
  this.updatesitePermissonObject = {};
  this.sitePermissonObject = {};

  


 }

 saveUserGroupDetails(){

    if(this.usergroupsForm.valid){
      this.dataLoaded = true;

      const userGroupData = {

        "display_name": this.usergroupsForm.controls.groupName.value,
        "permissions": {
          "admin":this.usergroupsForm.controls.accessAdmin.value,
          "alerts": {
            "receive": this.usergroupsForm.controls.alertReceive.value,
            "send": this.usergroupsForm.controls.alertSend.value,
          },
          "sitePermissions": this.sitePermissonObject,
          "dashboard": {
            "add": this.usergroupsForm.controls.accessAdd.value,            
            "delete": this.usergroupsForm.controls.accessDelete.value,
            "edit": this.usergroupsForm.controls.accessEdit.value,
            "view": this.usergroupsForm.controls.accessView.value,
          },
          "report": {
            "generate": this.usergroupsForm.controls.alertGenerate.value,
          },
          "userGroups": {
            "add": this.usergroupsForm.controls.userGroupAdd.value,
            "delete": this.usergroupsForm.controls.userGroupDelete.value,
            "edit": this.usergroupsForm.controls.userGroupEdit.value,
            "view": this.usergroupsForm.controls.userGroupView.value,
          },
          "users": {
            "add": this.usergroupsForm.controls.userAdd.value,
            "delete": this.usergroupsForm.controls.userDelete.value,
            "edit": this.usergroupsForm.controls.userEdit.value,
            "view": this.usergroupsForm.controls.userView.value
          },
          "applications": {
            "add": this.usergroupsForm.controls.applicationAdd.value,
            "delete": this.usergroupsForm.controls.applicationDelete.value,
            "edit": this.usergroupsForm.controls.applicationEdit.value,
            "view": this.usergroupsForm.controls.applicationView.value
           }
        }
      }
  
         //console.log('userGroupData', userGroupData);
      this.clientsService.createGroup(userGroupData , this.clientId ).subscribe((response)=> {
       //console.log(response);
       this.getAllUserGroupByClient();
       this.closeForm();
       this.site = [];
       this.siteInfoList = [];
     
       this.dataLoaded = false;
  
      },(httpError:HttpErrorResponse)=>{
        this.dataLoaded = false;
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      });

    }else{

      for (const key of Object.keys(this.usergroupsForm.controls)) {
        if (this.usergroupsForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
       }
      }

      this.isFormSubmitted = true;
    }
  }


  updateUserGroupDetails(){

    // isupdateFormSubmitted
    if(this.updateusergroupForm.valid){

      this.dataLoaded = true;

    this.isupdateFormSubmitted = false;
    const updateUserGroupData = {
      "display_name": this.updateusergroupForm.controls.editgroupName.value,
    };

    const permissionData = {

      "permissions": {
        "admin":this.updateusergroupForm.controls.editaccessAdmin.value,
        "alerts": {
          "receive": this.updateusergroupForm.controls.editalertReceive.value,
          "send": this.updateusergroupForm.controls.editalertSend.value,
        },
        "dashboard": {
          "add": this.updateusergroupForm.controls.editaccessAdd.value,
          "delete": this.updateusergroupForm.controls.editaccessDelete.value,
          "edit": this.updateusergroupForm.controls.editaccessEdit.value,
          "view": this.updateusergroupForm.controls.editaccessView.value,
        },
        "sitePermissions" : this.updatesitePermissonObject,
        "report": {
          "generate": this.updateusergroupForm.controls.editalertGenerate.value,
        },
        "userGroups": {
          "add": this.updateusergroupForm.controls.edituserGroupAdd.value,
          "delete": this.updateusergroupForm.controls.edituserGroupDelete.value,
          "edit": this.updateusergroupForm.controls.edituserGroupEdit.value,
          "view": this.updateusergroupForm.controls.edituserGroupView.value,
        },
        "users": {
          "add": this.updateusergroupForm.controls.edituserAdd.value,
          "delete": this.updateusergroupForm.controls.edituserDelete.value,
          "edit": this.updateusergroupForm.controls.edituserEdit.value,
          "view": this.updateusergroupForm.controls.edituserView.value
        },
        "applications": {
          "add": this.updateusergroupForm.controls.editApplicationAdd.value,
          "delete": this.updateusergroupForm.controls.editApplicationDelete.value,
          "edit": this.updateusergroupForm.controls.editApplicationEdit.value,
          "view": this.updateusergroupForm.controls.editApplicationView.value
         }
      }
    }

  
    //console.log('upate userGroupData', updateUserGroupData);
    //console.log('this.group_id', this.group_id);
    //console.log('this.clientId', this.clientId); 
    //console.log('update permission', permissionData);
    this.clientsService.updateUsergroup(updateUserGroupData , this.clientId , this.group_id).subscribe((response)=> {
     //console.log(response);
     this.getAllUserGroupByClient();
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    });
    this.updateUserGroupPermission(permissionData, this.clientId ,this.group_id);
   }
   else{

    this.isupdateFormSubmitted = true;

   }
}

    updateUserGroupPermission(permissinData, clientId , groupId){

      this.clientsService.updateUsergroupPermission(permissinData , clientId , groupId).subscribe((response)=> {
        //console.log(response);
        this.updatecloseForm();
        this.getAllUserGroupByClient();
        this.dataLoaded = false;
       },(httpError:HttpErrorResponse)=>{
        this.dataLoaded = false;
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
       });
    
    }

}



