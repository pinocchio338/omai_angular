import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  alertMsg:string = "";
  alertTitle:string = "Alert";
  alertType:string = "success";
  showCancel:boolean = false;
  
  constructor(@Inject(MAT_DIALOG_DATA) public alertdata:any,public dialogRef: MatDialogRef<AlertComponent> ) { }

  ngOnInit(): void {
   this.alertMsg = this.alertdata.alertMsg;
   this.alertType = this.alertdata.alertType;
   this.alertTitle = this.alertdata.alertTitle;
   this.showCancel = this.alertdata.showCancel;
  }

}
