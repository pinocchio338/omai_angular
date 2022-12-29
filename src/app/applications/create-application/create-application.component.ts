import { HttpErrorResponse } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';
import { ApplicationsService } from '../applications.service'

@Component({
  selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss']
})
export class CreateApplicationComponent implements OnInit {
  errorString="";
  constructor(public dialogRef: MatDialogRef<any>,
    private authService:AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any, private applicationsService: ApplicationsService) { }
   
    appName: string ='';
    nameError: string = '';
    isDataLoaded: boolean = true;
  ngOnInit(): void {
  }

  createApplication(){
    if(this.appName.trim().length>0){
      // save api call
      //console.log(this.data)
      this.isDataLoaded = false;
      this.applicationsService.createApplication(this.data.clientId,this.data.siteId,this.appName).subscribe(response =>{
        this.dialogRef.close(response['sortKey']);
        this.isDataLoaded = true;
      },(httpError:HttpErrorResponse)=>{
        this.isDataLoaded = true;
        //this.errorString = err.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })
    }
    else{
      this.nameError="Please Enter Valid Application Name"
      console.error('name error');
    }
  }

  close(){
    this.dialogRef.close();
  }
}
