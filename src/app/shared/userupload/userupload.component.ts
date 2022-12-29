import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../auth.service'

import { UserService } from 'src/app/users/user.service';
export class CSVRecord {  
  public user_name: any;  
  public email: any;  
  public emailtotext: any; 
  public phone_no: any;  
  public image: any;  
  public address_line_1: any;  
  public address_line_2: any;     
  public zip_code: any;  
  public city: any;  
  public state: any;  
  public country: any; 
  public dut_user: any;
  public alert_level: any;     
}  
@Component({
  selector: 'app-userupload',
  templateUrl: './userupload.component.html',
  styleUrls: ['./userupload.component.scss']
})
export class UseruploadComponent implements OnInit {
  selectedClient:number;
  isCompleteProcess:boolean=false;
  public records: any[] = [];  
  csvError:string = '';
  csvMsg:string = '';
  totalRecords:number = 0;
  failedRecords:number = 0;
  successRecords:number = 0;
  uploadStarted:boolean = false;
  constructor(private http:HttpClient,
    private _userService:UserService,@Inject(MAT_DIALOG_DATA) private dialogdata:any,
    public userUploadDialogRef: MatDialogRef<UseruploadComponent> ,
    private authService: AuthService) {
    this.selectedClient = dialogdata.clientId;
   }

  ngOnInit(): void {
    // if(this.csvReader)
    // //console.log(this.csvReader);
    let text = [];  
    let files = this.dialogdata.files;
    this.processFileUpload(files);
    
  }
  ngAfterViewInit(){
    // if(this.csvReader)
    // this.csvReader.nativeElement.click();
    //let files = this.dialogdata.files;
  }
  

  processFileUpload(files): void {  
  
    let text = []; 
  
    if (this.isValidCSVFile(files[0])) {  
      if(files[0].size / 1000000 >4){
        this.authService.updateErrorMessage('File size cannot exceed 4MB');
        return;
      }
      
      let reader = new FileReader();  
      reader.readAsText(files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/); 
        let headersRow = this.getHeaderArray(csvRecordsArray);  
          if(this.isValidHeader(headersRow)){
            this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
         
            if(this.records.length>0){
              this.totalRecords = this.records.length;
              if(this.totalRecords>25){
                this.csvError = "Total Number Of Users Should Not Exceed 25";
                this.isCompleteProcess=true;
              }else{
                
                let isvalid = this.validateRecords(this.records);
                if(isvalid){
                  this.uploadUsers( this.records);
                }else{
                  //console.log(this.csvError);
                  this.fileReset();
                  this.isCompleteProcess=true;
                  return false;
                }
               
              }
            
            }else{
              this.csvError = "Invalid Data Format";
              this.isCompleteProcess = true;
            }
          }else{
            this.csvError = "Invalid Data Format";    
            this.isCompleteProcess = true;   
          }
         
      };  
  
      reader.onerror = function () {  
        //console.log('error is occured while reading file!');  
      };  
  
    } else {  
      //console.log("invalid .csv file.");  
      this.fileReset();  
     // this.userUploadDialogRef.close()
    }  
  }  
  validateRecords(userRecords){
   
    let validData = true;
    userRecords.forEach(user => {
      if(!user.user_name || user.user_name.trim().length<=0){
        this.csvError = "Record Have Invalid Name";
        validData = false;
        return validData;
      }
      if(!user.email || !this.validateEmail(user.email)){
        this.csvError = "Record Having Name "+user.user_name+" Has Invalid Email";
        validData = false;
        return validData;
      }
      if(user.emailtotext && !this.validateEmail(user.emailtotext)){
        this.csvError = "Record Having Name "+user.user_name+" Has Invalid Email To Text";
        validData = false;
        return validData;
      }
      if(!user.phone_no || !this.validatePhone(user.phone_no)){
        this.csvError = "Record Having Name "+ user.user_name+" Has Invalid Phone";
        validData = false;
        return validData;
      }
      if(!user.address_line_1  || !user.zip_code || !user.city || !user.state || !user.country){
        this.csvError = "Record Having Name "+user.user_name+" Has Invalid Address";
        validData = false;
        return validData;
      }
      if(!user.dut_user || (user.dut_user!='Yes' && user.dut_user!='No')){
        this.csvError = "Record Having Name "+user.user_name+" Has Invalid Dut User";
        validData = false;
        return validData;
      }
      if(!user.alert_level  || (user.alert_level.toLowerCase()!='high' && user.alert_level.toLowerCase()!='medium' && user.alert_level.toLowerCase()!='low')){
        this.csvError = "Record Having Name "+user.user_name+" Has Invalid Alert Level";
        validData = false;
        return validData;
      }
    });
    return validData;
  }
  uploadUsers(userRecords){
    this.uploadStarted = true;
    userRecords.forEach((user,index) => {
        let userData={
          "name": user.user_name,
          "email": user.email,
          "emailtotext":user.emailtotext,
          "phone": this.addPhoneMask(user.phone_no,false),
          "photo": null,
          "address": {
            "line1": user.address_line_1,
            "line2":  user.address_line_2,
            "city": user.city,
            "state": user.state,
            "country": user.country,
            "zipCode": user.zip_code
          },
          "alertLevel": user.alert_level.toLowerCase(),
          "dutUser": user.dut_user=='Yes'?true:false
        }
        this._userService.addNewUser(userData,this.selectedClient).subscribe((res:any)=>{
          this.successRecords++;
        },(err)=>{
           this.csvError += " <span class='error'>'"+userData.email+"' "+err.error.message+"</span>";
         
          this.failedRecords++;
        })
        if(this.totalRecords == index+1){
          setTimeout(() => {
           
            this.isCompleteProcess = true;
            this.uploadStarted = false;
          }, 3000);
          
        }
    });
    
    
  }
  closeUserUpload(){
    
    this.userUploadDialogRef.close(this.successRecords);
  }
  addPhoneMask(event, backspace) {
    let newVal = event.replace(/\D/g, '');
    if (backspace && newVal.length <= 6) {
      newVal = newVal.substring(0, newVal.length - 1);
    }
    if (newVal.length === 0) {
      newVal = '';
    } else if (newVal.length <= 3) {
      newVal = newVal.replace(/^(\d{0,3})/, '($1)');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1) -$2');
    } else if (newVal.length <= 10) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1)-$2-$3');
    } else {
      newVal = newVal.substring(0, 10);
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) -$2-$3');
    }
    return newVal;
  }
  isValidHeader(headerRow){
    let isValid = true;
    if(headerRow[0]!='user_name'){
      isValid = false;
      return isValid;
    }
    if(headerRow[1]!='email'){
      isValid = false;
      return isValid;
    }
    if(headerRow[2]!='emailtotext'){
      isValid = false;
      return isValid;
    }
    if(headerRow[3]!='phone_no'){
      isValid = false;
      return isValid;
    }
    // if(headerRow[3]!='image'){
    //   isValid = false;
    //   return isValid;
    // }
    if(headerRow[4]!='address_line_1'){
      isValid = false;
      return isValid;
    }
    if(headerRow[5]!='address_line_2'){
      isValid = false;
      return isValid;
    }
    if(headerRow[6]!='zip_code'){
      isValid = false;
      return isValid;
    }
    if(headerRow[7]!='city'){
      isValid = false;
      return isValid;
    }
    if(headerRow[8]!='state'){
      isValid = false;
      return isValid;
    }
    if(headerRow[9]!='country'){
      isValid = false;
      return isValid;
    }
    if(headerRow[10]!='dut_user'){
      isValid = false;
      return isValid;
    }
    if(headerRow[11]!='alert_level'){
      isValid = false;
      return isValid;
    }
    return isValid;
  }
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');  
      if (curruntRecord.length == headerLength) {  
        let csvRecord: CSVRecord = new CSVRecord();  
        csvRecord.user_name = curruntRecord[0].trim();  
        csvRecord.email = curruntRecord[1].trim();
        csvRecord.emailtotext = curruntRecord[2].trim();    
        csvRecord.phone_no = curruntRecord[3].trim();  
        //csvRecord.image = curruntRecord[3].trim();  
        csvRecord.address_line_1 = curruntRecord[4].trim();  
        csvRecord.address_line_2 = curruntRecord[5].trim();
        csvRecord.zip_code = curruntRecord[6].trim();
        csvRecord.city = curruntRecord[7].trim();
        csvRecord.state = curruntRecord[8].trim(); 
        csvRecord.country = curruntRecord[9].trim();
        csvRecord.dut_user = curruntRecord[10].trim();
        csvRecord.alert_level = curruntRecord[11].trim();  
        csvArr.push(csvRecord);  
      }  
    }  
    return csvArr;  
  }  
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  
  fileReset() {  
    //this.csvReader.nativeElement.value = "";  
    this.records = [];  
  }  
  validateEmail(email) {
    var chrbeforAt = email.substr(0, email.indexOf('@'));
    if (!(email.trim().length > 127)) {
        if (chrbeforAt.length >= 1) {
            var re = /^(([^<>()[\]{}'^?\\.,!|//#%*-+=&;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            return re.test(email);
        } else {
            return false;
        }
    } else {
        return false;
    }
}
validatePhone(phone){
  if(phone.trim().length<10 || phone.trim().length>17){
    return false;
  }
  return true;
}

}
