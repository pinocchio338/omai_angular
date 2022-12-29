import { Component, Inject, Input, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";

import { NewuserComponent } from './newuser/newuser.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from './user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @Input() public shift;
  users:Array<any> = [];
  forSite: boolean = false;
  allUsers :Array<any> = [];
  searchStr= '';
  error : boolean = false;
  loadingUsers : boolean = false;
  newUser : boolean = false;
  modalTitile : string = "Users";
  selectedUsers = [];
  btnChoose = 'Choose';
  userLoaded : boolean = false;
  existingUsers:[];
  presentUsers: any[] = [];
  inactiveUsers: any[] = [];
  errorString="";
  constructor(public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data:any, private _userService:UserService,public dialogRef: MatDialogRef<UsersComponent>,private authService:AuthService) { }


  ngOnInit(): void {
    //console.log("data",this.data);
    if(this.data.forSite){
      this.forSite = this.data.forSite;
    }
    
    if(this.data.existingUsers && this.data.existingUsers.length>0){
    this.existingUsers = this.data.existingUsers;
    }
    if(this.data.inactiveUsers && this.data.inactiveUsers.length>0){
      this.inactiveUsers = this.data.inactiveUsers;
    }
    this.loadingUsers = true ;
    if(this.data['presentContacts']){
      this.presentUsers = this.data['presentContacts'];
    }
    
    if(this.forSite){
      this._userService.getSitesAllUsers(this.data.clientId,this.data.siteId).subscribe((res:any)=>{
        if(res && res.users){
          this.allUsers = res.users;
          //console.log(this.allUsers);
          this.users = this.allUsers;
          this.userLoaded =  true;
        }    
      },(httpError:HttpErrorResponse)=>{
        this.userLoaded =  true;
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })
    }else{
      this._userService.getAllUsers(this.data.clientId).subscribe((res:any)=>{
        if(res && res.userInfo.users){
          this.allUsers = res.userInfo.users;
          //console.log(this.allUsers);
          this.users = this.allUsers;
          this.userLoaded =  true;
        }    
      },(httpError:HttpErrorResponse)=>{
        this.userLoaded =  true;
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })
    }
    
  }
  chooseUsers(){
    
    let selectedUsers = [];
    this.users.forEach((user)=>{
      if(user.selected){
        selectedUsers.push(user.sortKey);
      }
    })
    // "operators":{"lead":"user#21446","users":["user#99873","user#90477","user#78088","user#48021","user#43155"]},
    // this.users.forEach(element => {
      
    // });
    // let newuser = {"photo":"https://s3-us-west-2.amazonaws.com/resources-bucket-projectx-be-dev/clients/client%2366333/user/photos/user%2321446.jpg","userGroups":["usergroup#36333","usergroup#19530"],"sortKey":"user#21446","status":"deleted","primaryKey":"client#66333","address":{"zipCode":"41701","country":"United States Of America Of America","state":"Hazard","line2":" 7937 Woodland Ave","city":"Kentucky ","line1":"EcoStay"},"alertLevel":"low","email":"Zack.Brooks@acucomm.net","name":"Zack Brooks","phone":"662-517-2601","dutUser":false};
    //console.log("selectedUsers",selectedUsers);
    this.dialogRef.close(selectedUsers);
  }
  selectUser(event,selected){
    if(event.target.checked){
      this.allUsers.map((user)=>{
        if(selected === user)
        user['selected'] = true;
        
      })
      
    }else{
      this.allUsers.map((user)=>{
        if(selected === user)
        user['selected'] = false;
       
      })
    }
  }
  addNewUser(){
    
    const dialogRef = this.dialog.open(NewuserComponent,{data:{
      clientId:this.data.clientId
    },
    position:{top:'5%'}
    ,width:'592px',maxHeight:'max-content', disableClose: true, panelClass:'modal-user'});
    
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        result['newUser']=true;
        this.allUsers.unshift(result);
        this.users = this.allUsers;
        // let users = this._userService.getAllUsers(this.data.clientId).subscribe((res:any)=>{
        //   if(res && res.userInfo.users){
        //     this.allUsers = res.userInfo.users
        //     this.users = this.allUsers;
        //   }
        // })
      }
    });
  }
  searchUsers(){
  
   if(this.searchStr && this.searchStr.trim().length>0){
     this.users = this.allUsers.filter((user)=>{
       if(user.name.toLowerCase().includes(this.searchStr.toLowerCase())){
         return user;
       }
     })
   }
   else {
     this.users = this.allUsers;
   }
   //console.log(this.users);
  }

  isUserAdded(userId: string){   
    return this.presentUsers.includes(userId)
  }

  isUserInactive(userId: string){
    return this.inactiveUsers.includes(userId)
  }
}
