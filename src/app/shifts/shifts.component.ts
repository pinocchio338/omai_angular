import {  Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersComponent } from '../users/users.component';
import { NewshiftComponent } from './newshift/newshift.component';
import { ShiftService } from './shifts.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../users/user.service';
import { ClientsService } from '../clients/clients.service';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
@Component({
  selector: 'app-shifts',
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.scss']
})

export class ShiftsComponent implements OnInit {
  clientInfo: any = null;
  siteInfo: any = null;
  showDraft:boolean = true;
  allShifts: Array<any> = [];
  newShift : any = null;
  newShiftError : string ='';
  editShiftError : string = '';
  shiftForEdit : any = null;
  clientId: any = null;
  siteId: any =null;
  allUsers : Array<any> =  [];
  dataloaded : boolean = false;
  shiftDays : Array<any> = [{'day':'Mo','selected':false,'val':'monday'},{'day':'Tu','selected':false,'val':'tuesday'},{'day':'We','selected':false,'val':'wednesday'},{'day':'Th','selected':false,'val':'thursday'},{'day':'Fr','selected':false,'val':'friday'},{'day':'Sa','selected':false,'val':'saturday'},{'day':'Su','selected':false,'val':'sunday'}];
  shiftTimings : Array<any> =['12:00 AM','1:00 AM','2:00 AM','3:00 AM','4:00 AM','5:00 AM','6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM','11:00 PM'];
  tiles: Tile[] = [
    {text: 'One', cols: 2, rows: 1, color: 'lightblue'},
    {text: 'Two', cols: 2, rows: 1, color: 'lightgreen'}
  ];
  errorString="";
  constructor(public dialog: MatDialog,private clientService:ClientsService, private _userService:UserService, private _shiftService:ShiftService, private router: Router, private route: ActivatedRoute,private authService:AuthService) { }
  format24Hours(time){
var hours = Number(time.match(/^(\d+)/)[1]);
var minutes = Number(time.match(/:(\d+)/)[1]);
var AMPM = time.match(/\s(.*)$/)[1];
if(AMPM == "PM" && hours<12) hours = hours+12;
if(AMPM == "AM" && hours==12) hours = hours-12;
var sHours = hours.toString();
var sMinutes = minutes.toString();
if(hours<10) sHours = "0" + sHours;
if(minutes<10) sMinutes = "0" + sMinutes;
return sHours + ":" + sMinutes;
  }
  format12Hours (time) {
    // Check correct time format and split into components
    time = time.trim();
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
  getUserData(shiftuser){
    return this.allUsers.find(user=>user.sortKey==shiftuser);
    
  }
  drop(event: CdkDragDrop<string[]>,shift) {
 //console.log("event",event, shift);
    
    if (event.previousContainer === event.container) {
      
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
        let currentContainerData = event.container.data;
        let prevContainerData = event.previousContainer.data;
        let currentIndex = event.currentIndex;
        let prevIndex = event.previousIndex;
        shift.operators.lead = currentContainerData;
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex)
      transferArrayItem(currentContainerData, prevContainerData, 1,event.previousIndex);
      
    }
  }

  ngOnInit(): void {
    this.dataloaded=true;
    
    this.clientId = this.route.snapshot.params.clientId.split('#')[1];
    this.siteId = this.route.snapshot.params.siteId.split('#')[1];

        this.clientService.getClients().subscribe( data => {
      data['clients'].forEach(client => {
        if(client.sortKey == this.route.snapshot.params.clientId)
          {
            this.clientInfo = client;           
            //console.log("this.clientInfo",this.clientInfo)
            
          }
      });
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
    this.clientService.getSites(this.clientId).subscribe((sitesData)=> {
      //console.log("sitesData",sitesData);
      sitesData['sites'].forEach(site => {
        if(site.sortKey == this.route.snapshot.params.siteId)
          {
            this.siteInfo = site;           
            
          }
      });
      
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
   
  




    this._userService.getSitesAllUsers(this.clientId,this.siteId).subscribe((usersResponse:any)=>{
      
      if(usersResponse && usersResponse.users){
        this.allUsers = usersResponse.users;
        this._shiftService.getShifts(this.clientId, this.siteId).subscribe((res:any)=>{
          if(res){
            this.allShifts = res.shifts;
            this.allShifts.map((shift)=>{
              shift['shiftDays'] = this.shiftDays;
              Array.isArray(shift.operators.lead)?shift.operators.lead = shift.operators.lead[0] : null;
              for(let i=0; i< shift.operators.users.length; i++){
                let user  = shift.operators.users[i];
                shift.operators.users[i] = Array.isArray(user) ? user[0] : user;
              };
              shift.operators.opened=false;
            });
           //console.log("this.allShifts",this.allShifts);
          }
          this.dataloaded = true;
          this.dataloaded = false;
        },(httpError:HttpErrorResponse)=>{
          this.dataloaded = false;
         // this.errorString = err.error.message;
         this.authService.updateErrorMessage(httpError['error']['message']);
        })
      }
    },(httpError:HttpErrorResponse)=>{
      this.dataloaded = true;
          this.dataloaded = false;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
    
    // let shiftsData = this._shiftService.getAllShifts();
    // if(shiftsData){
    //   this.allShifts = JSON.parse(shiftsData);
    // }
    setTimeout(() => {
     this.dataloaded = false;
    }, 5000);
    
  }

  addusertoeditshift(shift:any='') {
    const inactiveUsers = [];    
    this.allUsers.forEach(user =>{
      if(user.status =='suspended'){
        inactiveUsers.push(user.sortKey)
      }
    });
    let existingUsers = [];
    existingUsers.push(shift.operators.lead);
    existingUsers.push(...shift.operators.users);
    console.error(existingUsers);
    const dialogRef = this.dialog.open(UsersComponent,{ 
      data: {
        clientId: this.clientId,
        siteId:this.siteId,
        existingUsers:existingUsers,
        forSite:true,
      },
      position:{top:'5%'}
    ,width:'592px',maxHeight:'max-content', panelClass:'modal-user',disableClose: true,});

    dialogRef.afterClosed().subscribe(result => {
 
      if(result && result!=''){
        this._userService.getSitesAllUsers(this.clientId,this.siteId).subscribe((usersResponse:any)=>{
          if(usersResponse && usersResponse.users){
            this.allUsers = usersResponse.users;
          }
        },(httpError:HttpErrorResponse)=>{
         // this.errorString = err.error.message;
          this.authService.updateErrorMessage(httpError['error']['message']);
        })
      if(this.shiftForEdit){
        if(!this.shiftForEdit.operators.lead){
          this.shiftForEdit.operators['lead'] = result[0];
          result.shift();
       }
       if(result.length>0){
       if(this.shiftForEdit.operators && this.shiftForEdit.operators.users.length>0){
        let differenceLead = result.filter(x => !this.shiftForEdit.operators.lead.includes(x));
        let difference = differenceLead.filter(x => !this.shiftForEdit.operators.users.includes(x));
        if(difference && difference.length>0)
        this.shiftForEdit.operators.users.unshift(...difference);
       }else{
        this.shiftForEdit.operators['users'] = result;
       }
      }
       }
     }
    });
  }
  
  addusertoshift(shift:any='') {
    const inactiveUsers = [];
    console.error(this.allUsers)
    this.allUsers.forEach(user =>{
      if(user.status =='suspended'){
        inactiveUsers.push(user.sortKey)
      }
    });
    let existingUsers = [];
    if(shift!=''){
    existingUsers.push(shift.operators.lead);
    existingUsers.push(...shift.operators.users);
    }
    console.error(existingUsers)
    const dialogRef = this.dialog.open(UsersComponent,{ 
      data: {
        clientId: this.clientId,
        siteId:this.siteId,
        existingUsers:existingUsers,
        forSite:true,
        inactiveUsers
      },
      position:{top:'5%'}
    ,width:'592px',maxHeight:'max-content', panelClass:'modal-user',disableClose: true,});

    dialogRef.afterClosed().subscribe(result => {
 
      if(result && result!=''){
        this._userService.getSitesAllUsers(this.clientId,this.siteId).subscribe((usersResponse:any)=>{
          if(usersResponse && usersResponse.users){
            this.allUsers = usersResponse.users;
          }
        },(httpError:HttpErrorResponse)=>{
          //this.errorString = err.error.message;
          this.authService.updateErrorMessage(httpError['error']['message']);
        })
       if(shift!=''){
         this.dataloaded = true;
         if(!shift.operators.lead){
            shift.operators['lead'] = result[0];
            result.shift();
         }
         if(result.length>0){
         if(shift.operators && shift.operators.users.length>0){
           Array.isArray(shift.operators.lead) ? shift.operators.lead = shift.operators.lead[0] : null;
           for(let i=0; i<shift.operators.users.length; i++){
            let user  = shift.operators.users[i];
            shift.operators.users[i] = Array.isArray(user) ? user[0] : user;
          };
          let differenceLead = result.filter(x => !shift.operators.lead.includes(x));
          let difference = differenceLead.filter(x => !shift.operators.users.includes(x));
          console.error(difference)
          if(difference && difference.length>0)
          shift.operators.users.unshift(...difference);
         }else{
          shift.operators['users'] = result;
         }
        }
         let shiftId =  shift.sortKey.split('#')[1];
         let shiftForSave = Object.assign({},shift);
         delete shiftForSave.operators['opened'];
         
         this._shiftService.editShift(shiftForSave,this.clientId, this.siteId,shiftId).subscribe((res)=>{
          this.dataloaded = false;
          if(res){
            res['shiftDays'] = this.shiftDays;
           
            this.allShifts.map((shiftm)=>{
              if(shiftm.sortKey == shift.sortKey){
                shiftm = res;
              }
            })
            
          }
        },(httpError:HttpErrorResponse)=>{
          this.dataloaded = false;
          //this.errorString = err.error.message;
          this.authService.updateErrorMessage(httpError['error']['message']);
        })
       }else if(this.newShift){
       
        if(!this.newShift.operators.lead){
          this.newShift.operators['lead'] = result[0];
          result.shift();
       }
       if(result.length>0){
         
        if(this.newShift.operators && this.newShift.operators.users.length>0){
          let differenceLead = result.filter(x => !this.newShift.operators.lead.includes(x));
          let difference = differenceLead.filter(x => !this.newShift.operators.users.includes(x));
          if(difference && difference.length>0)
          this.newShift.operators.users.unshift(...difference);
         }else{
           
          this.newShift.operators['users'] = result;
                   
         }
       }
       
       }
     }
    });
  }
  goBack(){

    this.router.navigate(['clients','client#'+this.clientId,'site#'+this.siteId]);
   }
   deleteShift(shiftforDelete){
     let shiftIdForDelete = shiftforDelete.sortKey.split('#')[1];
     this.dataloaded = true;
      this._shiftService.deleteShift(this.clientId,this.siteId,shiftIdForDelete).subscribe((res:any)=>{
        this.dataloaded = false;
        this.allShifts = this.allShifts.filter(shift=>shift.sortKey!=shiftforDelete.sortKey);
      },(err)=>{
        this.dataloaded = false;
      })
   }
   editShift(shift){
    
    this.shiftForEdit = JSON.parse(JSON.stringify(shift));
    let newshiftDays = JSON.parse(JSON.stringify(this.shiftDays));
    this.shiftForEdit.shiftDays = newshiftDays.map((shiftday)=>{
      if(this.shiftForEdit.daysOfWeek.includes(shiftday.val)){
        shiftday.selected = true;
      }
      return shiftday;
    })
    this.shiftForEdit.timing.startTime = this.format12Hours(this.shiftForEdit.timing.startTime);
    this.shiftForEdit.timing.endTime = this.format12Hours(this.shiftForEdit.timing.endTime);
  }
  selectDay(day){
  
    if(this.newShift && this.newShift.shiftDays){
      this.newShift.shiftDays.forEach(shiftday => {
        if(shiftday.day == day){
          shiftday.selected = !shiftday.selected;
          if(shiftday.selected){
            this.newShift.daysOfWeek.push(shiftday.val)
          }else{
            this.newShift.daysOfWeek = this.newShift.daysOfWeek.filter((dow)=>{
              if(dow!=shiftday.val){
                return dow;
              }
            })
          }
          
          
        }
      });
    }else if(this.shiftForEdit && this.shiftForEdit.shiftDays){
      this.shiftForEdit.shiftDays.forEach(shiftday => {
        if(shiftday.day == day){
          shiftday.selected = !shiftday.selected;
          if(shiftday.selected){
            this.shiftForEdit.daysOfWeek.push(shiftday.val)
          }else{
            this.shiftForEdit.daysOfWeek = this.shiftForEdit.daysOfWeek.filter((dow)=>{
              if(dow!=shiftday.val){
                return dow;
              }
            })
          }
          
          
        }
      });
    }
    
    
  }
  saveEditShift(){
   
    if(this.shiftForEdit){
      let shiftId =  this.shiftForEdit.sortKey.split('#')[1];
      this.dataloaded = true;
      const daysOfWeek = this.shiftForEdit.daysOfWeek;
      if(!this.shiftForEdit.name || this.shiftForEdit.name.trim().length<=0){
        this.editShiftError = "Please Enter Shift Name";
        this.dataloaded = false;
        return false;
      }
      let shiftnameexists = this.allShifts.find((shift)=>{
        return shift.name.toLowerCase().trim()==this.shiftForEdit.name.toLowerCase().trim() && shift.sortKey!=this.shiftForEdit.sortKey ;
      })
      if(shiftnameexists){
        this.editShiftError = "Shift With Name '"+ this.shiftForEdit.name +"' Is Already Exists";
        this.dataloaded = false;
        return false;
      }
      if(daysOfWeek.length<=0){
        this.editShiftError = "Please select shift days";
        this.dataloaded = false;
        return false;
      }
     
      this.editShiftError = "";
      const editShiftData={
        "name":this.shiftForEdit.name,
        "daysOfWeek":daysOfWeek,
        "timing":{
          "startTime":this.format24Hours(this.shiftForEdit.timing.startTime),
          "endTime":this.format24Hours(this.shiftForEdit.timing.endTime)
        },  
        "operators":this.shiftForEdit.operators
      }
      delete editShiftData.operators['opened']; 
      this._shiftService.editShift(editShiftData,this.clientId, this.siteId,shiftId).subscribe((res)=>{
       
        if(res){
          res['shiftDays'] = this.shiftDays;
         
          this.allShifts =  this.allShifts.map((shift)=>{
            if(shift.sortKey == this.shiftForEdit.sortKey){
              shift = res;
            }
            return shift;
          })
          this.shiftForEdit = null;
          this.dataloaded = false;
        }
      },(httpError:HttpErrorResponse)=>{
       this.dataloaded = false;
      // this.errorString = err.error.message;
       this.authService.updateErrorMessage(httpError['error']['message']);
      })
    }
    return false;
  }
  deleteUser(user,shift,usertype){

    let shiftId =  shift.sortKey.split('#')[1];
    const editShiftData= JSON.parse(JSON.stringify(shift))
    if(usertype=='u'){
    editShiftData.operators.users = editShiftData.operators.users.filter((suser)=>{
      return suser!=user;
    })
  }else if(usertype=='l'){
    editShiftData.operators.lead = ""
  }
    delete editShiftData.operators['opened'];
    delete editShiftData['shiftDays'];
    delete editShiftData['sortKey'];
    delete editShiftData['primaryKey'];
    //console.log("editShiftData",editShiftData);
    this.dataloaded = true ;
    this._shiftService.editShift(editShiftData,this.clientId, this.siteId,shiftId).subscribe((res)=>{
     
      if(res){
        res['shiftDays'] = this.shiftDays;
       
        this.allShifts =  this.allShifts.map((shiftm)=>{
          if(shiftm.sortKey == shift.sortKey){
            shiftm = res;
          }
          return shiftm;
        })
      
        this.dataloaded = false;
      }
    },(httpError:HttpErrorResponse)=>{
      this.dataloaded = false;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    
    })
  }
  saveNewShift(){
    if(this.newShift){
      
      this.dataloaded = true;
      if(!this.newShift.name || this.newShift.name.trim().length<=0){
        this.newShiftError = "Please Enter Shift Name";
        this.dataloaded = false;
        return false;
      }
      
      let shiftnameexists = this.allShifts.find((shift)=>{
        return shift.name.toLowerCase().trim()==this.newShift.name.toLowerCase().trim();
      })
      if(shiftnameexists){
        this.newShiftError = "Shift With Name '"+ this.newShift.name +"' Is Already Exists";
        this.dataloaded = false;
        return false;
      }
      const daysOfWeek = [];
      this.newShift.shiftDays.forEach(day => {
        if(day.selected){
          daysOfWeek.push(day.val);
        }
      });
      if(daysOfWeek.length<=0){
        this.newShiftError = "Please Select Shift Days";
        this.dataloaded = false;
        return false;
      }
      this.newShiftError = "";
      const newShiftData={
        "name":this.newShift.name,
        "daysOfWeek":daysOfWeek,
        "timing":{
          "startTime":this.format24Hours(this.newShift.timing.startTime),
          "endTime":this.format24Hours(this.newShift.timing.endTime)
        },  
        "operators":this.newShift.operators
      }
      delete newShiftData.operators['opened']; 
      this._shiftService.addNewShift(newShiftData,this.clientId, this.siteId).subscribe((res)=>{
        this.dataloaded = false;
        if(res){
          res['shiftDays'] = this.shiftDays;
          this.newShift = null;
          if(this.allShifts && this.allShifts.length>0){
            this.allShifts.unshift(res);
          }else{
            this.allShifts.push(res);
          }
          
        }
      },(httpError:HttpErrorResponse)=>{
       // this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
        this.dataloaded = false;
      })
    }
    return false;
  }
  cancelNewShift(){
    this.newShift = null;
    this.newShiftError = '';
  }
  cancelEditShift(){
    this.allShifts.map((shift)=>{
      shift.operators.opened=false;
    })
    this.shiftForEdit = null;
    this.editShiftError = '';
  }
  addNewShift() {
     const dialogRef = this.dialog.open(NewshiftComponent,{ 
      data: {
        clientId: this.clientId,
        siteId:this.siteId,
        shifts:this.allShifts,
     
      },
      position:{top:'5%'}
    ,width:'592px', panelClass:'modal-user',disableClose: true,});
    dialogRef.afterClosed().subscribe(result => {

      if(result){
        let newShiftx= {
          "daysOfWeek":[],
          "timing":
          {"startTime":"8:00 AM","endTime":"5:00 PM"},
          "primaryKey":this.siteId,
          "operators":{
          "lead":null,
          "users":[]},
          "sortKey":"",
          "name":result.shiftName,
        "shiftDays":result.shiftDays};
        this.newShift = newShiftx;
      }else{
        this.newShift = null;
      }
    });
  }
}


