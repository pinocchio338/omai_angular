import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-component-name-popup',
  templateUrl: './component-name-popup.component.html',
  styleUrls: ['./component-name-popup.component.scss']
})
export class ComponentNamePopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<any>) { }
  errorString="";
  dashboardName: string = '';
  errorText='';
  ngOnInit(): void {
  }
  cancel(): void {
    this.dialogRef.close(null);
  }
  send(): void {
    if(this.dashboardName.trim().length==0){
      this.errorText = "Dashboard Name Cannot be Empty"
      return;
    }
    this.dialogRef.close(this.dashboardName.trim());
  }
}
