import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';
import { RcaService } from './rca.service';

@Component({
  selector: 'app-rca',
  templateUrl: './rca.component.html',
  styleUrls: ['./rca.component.scss']
})
export class RcaComponent implements OnInit {
  frmRca: UntypedFormGroup;
  rcaSubmitted:boolean = false;
  dataloaded:boolean=true;
  rcaQuestions:[{"question": "Was the complete system shutdown in excess of 1 hour?","answer": "Yes"},{"question": "did the actual steps taken vary from the procedure specified in the SSM Plan?","answer": ""},{"question": "Did this event result in an exceedance of any applicable emission limitation?","answer": ""}]
  errorString="";
  loggedInUserId: any = null;
  constructor(public dialogRcaRef: MatDialogRef<RcaComponent>,private fb: UntypedFormBuilder,private _rcaService:RcaService,@Inject(MAT_DIALOG_DATA) public alertData:any,private authService:AuthService) {
    this.frmRca = this.fb.group({
      eventType: ['', Validators.compose([Validators.required])],
      durationFrom: ['', Validators.compose([Validators.required])],
      durationTo: ['', [Validators.required]],
      flareNo: ['',Validators.compose([Validators.required])],
      causeDescription:['',Validators.compose([Validators.required])],
      questions:[[{"question": "Was the complete system shutdown in excess of 1 hour?","answer": ""},{"question": "Did the actual steps taken vary from the procedure specified in the SSM Plan?","answer": ""},{"question": "Did this event result in an exceedance of any applicable emission limitation?","answer": ""}],Validators.compose([Validators.required])],
      description:['',Validators.compose([Validators.required])]
    });
   //console.log("alertData",alertData);
   }
   get description(){
    return this.frmRca.controls.description;
   }
   get eventType(){
    return this.frmRca.controls.eventType;
   }
   get durationFrom(){
    return this.frmRca.controls.durationFrom;
   }
   get durationTo(){
    return this.frmRca.controls.durationTo;
   }
   get flareNo(){
    return this.frmRca.controls.flareNo;
   }
   get causeDescription(){
    return this.frmRca.controls.causeDescription;
   }
   get questions(){
    return this.frmRca.controls.questions;
   }
   disableAnimation = true;
  ngAfterViewInit(): void {
    // timeout required to avoid the dreaded 'ExpressionChangedAfterItHasBeenCheckedError'
    setTimeout(() => this.disableAnimation = false);
  }
  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    if (userInfo && userInfo['userId']) {
      this.loggedInUserId = userInfo['userId'].split('#')[1];
    }
   // this.frmRca.patchValue({'questions':this.rcaQuestions});
    //console.log('rca init');
    setTimeout(() => {

      const ua = navigator.userAgent.toLowerCase(); 
      if (ua.indexOf('safari') != -1) { 
        if (ua.indexOf('chrome') > -1) {
         // alert("1 chrom") // Chrome
         //console.log('chrome');
   
          let shand = document.getElementsByClassName('datarca') as HTMLCollectionOf<HTMLElement>;
   
            if (shand.length != 0) {
             // shand[0].style.minHeight = "calc(90vh)";
              shand[0].style.maxHeight = "95vh";
            }
   
   
        } else {
          //alert("2 safari") // Safari
          //console.log('safari');
          let shand = document.getElementsByClassName('datarca') as HTMLCollectionOf<HTMLElement>;
   
          if (shand.length != 0) {
           // shand[0].style.minHeight = "calc(70vh)";
            shand[0].style.maxHeight = "80vh";
          }
         // document.getElementById("myDIV").className = "mystyle";
   
        }
      }


}, 0);
  }

  dFromValueChange(val){
    this.frmRca.controls.durationTo.setValue('');
  }
  eventTypeChange(event,value){
   if(event.checked){
      this.frmRca.controls['eventType'].setValue(value);
    }else{
      this.frmRca.controls['eventType'].setValue('');
    }
  }
  questionAnsChanged(event,q,a){
    if(event.checked){
    q.answer = a;
    }else{
      q.answer="";
    }
  }
  saveRca(){
    //console.log("save",this.frmRca.value);
    this.rcaSubmitted = true;
    let notAnswered = this.frmRca.controls.questions.value.find(element => {
      return !element.answer;
    });
    if(notAnswered){
      return false;
    }
    if(this.frmRca.valid){
      this.dataloaded = false;
      let clientId = this.alertData.clientId;
      let from = this.alertData.from.toLowerCase();
      let siteId = this.alertData.siteId.split('#')[1];
      let errorId = this.alertData.errorId.split('#')[1];    
      let fromId =   this.alertData.fromId.split('#')[1]; 
      let primaryKey =   this.alertData.fromId; 
      this._rcaService.saveRca(clientId,from,fromId,primaryKey,siteId,errorId,this.loggedInUserId,this.frmRca.value).subscribe((res:any)=>{
        //console.log(res);
        this.dataloaded = true;
        this.dialogRcaRef.close(true);
      },(httpError:HttpErrorResponse)=>{
        this.dataloaded = true;
        //this.errorString = err.error.mesaage;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })
    }else{
      return false;
    }
  }
}
