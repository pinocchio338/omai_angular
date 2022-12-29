import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-groups-new-user',
  templateUrl: './groups-new-user.component.html',
  styleUrls: ['./groups-new-user.component.scss']
})
export class GroupsNewUserComponent implements OnInit {
  name:string = '';
  inProcess : boolean = false;
  errorString="";
  constructor(public dialogRef: MatDialogRef<GroupsNewUserComponent>) { }

  ngOnInit(): void {
  }
createUser(){
  if(!this.name)
  return false;
  this.dialogRef.close(this.name);
}
}
