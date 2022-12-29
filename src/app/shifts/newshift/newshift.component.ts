import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShiftService } from '../shifts.service';
@Component({
  selector: 'app-newshift',
  templateUrl: './newshift.component.html',
  styleUrls: ['./newshift.component.scss']
})
export class NewshiftComponent implements OnInit {
  frmShift: UntypedFormGroup;
  allShifts:any=[];
  newShiftError:any='';
  shiftDays : Array<any> = [{'day':'Mo','selected':false,'val':'monday'},{'day':'Tu','selected':false,'val':'tuesday'},{'day':'We','selected':false,'val':'wednesday'},{'day':'Th','selected':false,'val':'thursday'},{'day':'Fr','selected':false,'val':'friday'},{'day':'Sa','selected':false,'val':'saturday'},{'day':'Su','selected':false,'val':'sunday'}];
  errorString="";
  constructor(private fb: UntypedFormBuilder,@Inject(MAT_DIALOG_DATA) public data:any, private _shiftService :ShiftService , public dialogRef: MatDialogRef<NewshiftComponent>) {
    this.frmShift = this.fb.group({
      shiftName: ['', Validators.compose([Validators.required,Validators.maxLength(50)])],
      shiftDays: [this.shiftDays, Validators.compose([Validators.required])],
      shiftStartTime: ['8:00 AM', Validators.compose([Validators.required,Validators.maxLength(20)])],
      shiftEndTime: ['5:00 PM', Validators.compose([Validators.required,Validators.maxLength(20)])]
    })
   }
   get shiftName(){
    return this.frmShift.controls.shiftName;
  }
  set shiftName(val){
    this.frmShift['controls'].shiftName.setValue(val);
  }
  
  saveShift(){
    if(!this.shiftName.value || this.shiftName.value.trim().length<=0){
      this.newShiftError = "Please Enter Shift Name ";
    return false;
    }
    this.newShiftError = "";
    // this._shiftService.addNewShift(this.frmShift.value).then((res)=>{
      
    // })
    let shiftnameexists = this.allShifts.find((shift)=>{
      return shift.name.toLowerCase().trim()==this.shiftName.value.toLowerCase().trim();
    })
    if(shiftnameexists){
      this.newShiftError = "Shift With Name '"+ this.shiftName.value +"' Is Already Exists";
 
      return false;
    }
    this.dialogRef.close(this.frmShift.value);
    
  }
  ngOnInit(): void {
    this.newShiftError = '';
    this.allShifts = this.data.shifts;
  }

}
