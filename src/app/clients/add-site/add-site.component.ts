import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit ,ElementRef} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA,MatDialog } from '@angular/material/dialog';
import { ClientsService } from '../clients.service';
import * as xml2js from 'xml2js';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.scss']
})
export class AddSiteComponent implements OnInit {
  errorString="";
  addressJsonRes: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data:any, private el: ElementRef ,private fb: UntypedFormBuilder, public dialogRef: MatDialogRef<AddSiteComponent>, private clientService: ClientsService,private authService:AuthService ) { }
  siteForm: UntypedFormGroup;
  clientId: string = null;
  isFormSubmitted = false;
  dataLoaded: boolean = true;
  ngOnInit(): void {

    this.siteForm  = this.fb.group({
      name: ['', Validators.compose([Validators.required,Validators.maxLength(100)])],
      id: ['', Validators.compose([Validators.required,Validators.minLength(4), Validators.maxLength(15)])],
      siteemail: ['',Validators.required],
      addressLine1: ['', Validators.compose([Validators.required,Validators.maxLength(100)])],
      addressLine2: ['', Validators.compose([Validators.maxLength(100)])],
      city: ['', Validators.compose([Validators.required,Validators.maxLength(25)])],
      state: ['', Validators.compose([Validators.required,Validators.maxLength(25)])],
      zipCode: ['', Validators.compose([Validators.required,Validators.maxLength(5)])],
      country: ['United States Of America', Validators.required]
    });
    // //console.log(this.data.clientId)
    this.clientId = this.data.clientId;
  }

  get f() { return this.siteForm.controls; }


  getMessage(formControlName: string, displayName: string) {
    let val = this.siteForm.get(formControlName).value.trim();
    if (this.siteForm.get(formControlName).status == "VALID") return;
   // this.isFormSubmitted = true;
  
    if (this.siteForm.get(formControlName).touched && val.length == 0) {
      return displayName + " cannot be empty";
    }
    if (
      !this.siteForm.get(formControlName).pristine &&
      this.siteForm.get(formControlName).invalid
    )
      return "Entered " + displayName + " is invalid";
    //  this.isFormSubmitted = false;
  }


  isAddressValid(){

    if(this.siteForm.status =='VALID'){

      this.isFormSubmitted = false;
        

    let addressDetails = '<AddressValidateRequest USERID="325HUSHT1273">'+
    '<Revision>1</Revision>'+
    '<Address ID="0">'+
    '<Address1>'+ this.siteForm.controls.addressLine1.value + '</Address1>'+
    '<Address2>'+ this.siteForm.controls.addressLine2.value + '</Address2>'+
    '<City/>'+
    '<State>'+ this.siteForm.controls.state.value  + '</State>'+
    '<Zip5>'+  this.siteForm.controls.zipCode.value + '</Zip5>'+
    '<Zip4/>'+
    '</Address>'+
    '</AddressValidateRequest>';

    this.dataLoaded = false;
    //console.log('addressDetails', addressDetails);
    this.clientService.verifyAddress(addressDetails).subscribe((response) => {
      //console.log('address validation  Response:', response);

    },(err:any)=>{

  this.dataLoaded = true;
  if(err.error.text.includes('Error')){

    //console.log('if',err.error.text.includes('Error'));
    ////console.log(err.error.text.getElementsByTagName('Description')[0]);
   // var x = xmlDoc.getElementsByTagName("title")[0];
    //this.errorString = 'Address Not Found.';
    this.authService.updateErrorMessage('Address Not Found.');
    for (const key of Object.keys(this.siteForm.controls)) {
      if (this.siteForm.controls[key].invalid) {
        const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
     }
    }

  }else{

    const parser = new xml2js.Parser({ strict: false, trim: true });
    parser.parseString(err.error.text, (err, result) => {
      this.addressJsonRes = result;

      //console.log('verified address Response', this.addressJsonRes);
      if(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1){
        this.siteForm.controls['addressLine2'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS1[0]);
      }

      this.siteForm.controls['addressLine1'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ADDRESS2[0]);
      this.siteForm.controls['zipCode'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].ZIP5[0]);
      this.siteForm.controls['city'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].CITY[0]);
      this.siteForm.controls['state'].setValue(this.addressJsonRes.ADDRESSVALIDATERESPONSE.ADDRESS[0].STATE[0]);

    });

    //console.log('else',err.error.text.includes('Error'));

    this.submitForm();
  }
});

    }else {

      this.isFormSubmitted = true;

      for (const key of Object.keys(this.siteForm.controls)) {
        if (this.siteForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
       }
      }


    }
  }

  

  submitForm(){
    //console.log(this.siteForm)
    if(this.siteForm.status =='VALID'){

      this.isFormSubmitted = false;


        //console.log('valid',this.siteForm.value)
        let siteData = this.siteForm.value;
        let siteObject = {
          address:{
            line1: siteData['addressLine1'],
            line2: siteData['addressLine2'],
            city: siteData['city'],
            country: siteData['country'],
            state: siteData['state'],
            zipCode: siteData['zipCode']
          },
          customSiteId: siteData['id'],
          email: siteData['siteemail'],
          name: siteData['name']
        }
        this.dataLoaded=false;
       // //console.log('--------',siteObject);
        this.clientService.addSiteByClient(siteObject,this.clientId,).subscribe(response => {
          this.dialogRef.close({data:response});
         // this.dataLoaded = true;
        },
        (httpError:HttpErrorResponse)=>{
          this.dataLoaded = true;
          //this.errorString = error.error.message;
          this.authService.updateErrorMessage(httpError['error']['message']);
        })
      }
    else {

      this.isFormSubmitted = true;

      for (const key of Object.keys(this.siteForm.controls)) {
        if (this.siteForm.controls[key].invalid) {
          const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
          invalidControl.focus();
          break;
       }
      }
      //console.log('invalid');
    }


  }

  close(){
    this.dialogRef.close();
  }
}
