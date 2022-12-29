import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ClientsService } from '../../clients/clients.service';
import { JointableService } from '../jointable.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-jointable',
  templateUrl: './jointable.component.html',
  styleUrls: ['./jointable.component.scss']
})
export class JointableComponent implements OnInit {
  selectedClientId: string = null;
  selectedSiteId: string = null;
  clientId:string=null;
  dataLoaded:boolean = false;
  clientInfo:any=null;
  siteInfo:any=null;
  errorString="";
  validToPreviewData:boolean=false;
  joinType:any="";
 tablesData:any=[];
 selectedTable:any=[];
 viewPreviewData:any=[];
 viewPreviewDataKeys:any=[];
 previewDataCalled:boolean=false;
 viewName:string="";
 viewNameError:boolean=false;
 selectedTable1:any;
 selectedTable2:any;
 selectedTable1Val:any="";
 selectedTable2Val:any="";
 token:string = null;
 role: string = null;

  constructor(private _clientService:ClientsService, private snackBar: MatSnackBar, private _joinTablesService:JointableService, private router: Router, private route: ActivatedRoute,private authService:AuthService) { 
  
  }
  table1Changed(event){
    let selTbl= event.target.value;
    this.selectedTable1 =  this.selectedTable.find(st=>st.name==selTbl);
  }
  table2Changed(event){
    let selTbl= event.target.value;
    this.selectedTable2 =  this.selectedTable.find(st=>st.name==selTbl);
  }
  joinFieldChanged(evnt,tbl){
    this[tbl].joinField=evnt.target.value;
    this.checkValidToPreview();
  }
  createDataset(){
    if(!this.viewName){
      this.viewNameError = true;
      return false;
    }
    this.viewNameError = false;
    let baseTableName = this.selectedTable1.name;
    let joinedTableName = this.selectedTable2.name;
    if(this.selectedTable1['parentname']=='applications'){
      baseTableName=this.selectedTable1['fields']['applicationId']
    }else if(this.selectedTable1['parentname']=='duts'){
      baseTableName=this.selectedTable1['fields']['dutId']
    }
    if(this.selectedTable2['parentname']=='applications'){
      joinedTableName=this.selectedTable2['fields']['applicationId']
    }else if(this.selectedTable2['parentname']=='duts'){
      joinedTableName=this.selectedTable2['fields']['dutId']
    }
   



    let baseTableFields =[];
    this.selectedTable1['fields']['schema'].forEach((sc)=>{
      if(sc.checked)
      baseTableFields.push(sc.Name);
    });
    let joinedTableFields =[];
    this.selectedTable2['fields']['schema'].forEach((sc)=>{
      if(sc.checked)
      joinedTableFields.push(sc.Name);
    });
    const baseTableJoinfield = this.selectedTable1['joinField'];
    const joinedTableJoinfield = this.selectedTable2['joinField'];
    const previewCreateData={
      "name":this.viewName,
      "tables": [
          {
          "name": baseTableName,
          "fields":baseTableFields,
          "joinField": baseTableJoinfield,
          "baseTable": true
          },
          {
          "name": joinedTableName,
          "fields":joinedTableFields,
          "joinField": joinedTableJoinfield,
          "baseTable": false
        }
      ],
      "joinType": this.joinType
  }
  this.dataLoaded= false;
  this._joinTablesService.createDataSet(this.clientId,this.selectedSiteId.split('#')[1],previewCreateData).subscribe((res:any)=>{
    this.dataLoaded= true;
   this.viewName ="";
    this.showMessage('View created successfully');
  },(httpError:HttpErrorResponse)=>{
    this.dataLoaded= true;
    //this.errorString = err.error.message;
    this.authService.updateErrorMessage(httpError['error']['message']);
  })
  }
  removeSpaces(val) {
    this.viewName = this.viewName.split(' ').join('');
 }
  previewData(){
    this.previewDataCalled = true;
    let baseTableName = this.selectedTable1['name'];
    let joinedTableName = this.selectedTable2['name'];
    if(this.selectedTable1['parentname']=='applications'){
      baseTableName=this.selectedTable1['fields']['applicationId']
    }else if(this.selectedTable1['parentname']=='duts'){
      baseTableName=this.selectedTable1['fields']['dutId']
    }
    if(this.selectedTable2['parentname']=='applications'){
      joinedTableName=this.selectedTable2['fields']['applicationId']
    }else if(this.selectedTable2['parentname']=='duts'){
      joinedTableName=this.selectedTable2['fields']['dutId']
    }
   



    let baseTableFields =[];
    this.selectedTable1['fields']['schema'].forEach((sc)=>{
      if(sc.checked)
      baseTableFields.push(sc.Name);
    });
    let joinedTableFields =[];
    this.selectedTable2['fields']['schema'].forEach((sc)=>{
      if(sc.checked)
      joinedTableFields.push(sc.Name);
    });
    const baseTableJoinfield = this.selectedTable1['joinField'];
    const joinedTableJoinfield = this.selectedTable2['joinField'];
    const previewData={   
      "tables": [
          {
          "name": baseTableName,
          "fields":baseTableFields,
          "joinField": baseTableJoinfield,
          "baseTable": true
          },
          {
          "name": joinedTableName,
          "fields":joinedTableFields,
          "joinField": joinedTableJoinfield,
          "baseTable": false
        }
      ],
      "joinType": this.joinType
  }
  this.dataLoaded= false;
  this._joinTablesService.previewData(this.clientId,this.selectedSiteId.split('#')[1],previewData).subscribe((res:any)=>{
    this.dataLoaded= true;
    //console.log("preview response",res);
    this.viewPreviewData = res.items;
    this.viewPreviewDataKeys = Object.keys(this.viewPreviewData[0]);
  },(httpError:HttpErrorResponse)=>{
    this.dataLoaded= true;
    //this.errorString = err.error.message;
    this.authService.updateErrorMessage(httpError['error']['message']);
  })
  }
  checkValidToPreview(){
    // //console.log("jointype",this.joinType);
    // //console.log("selectedTable",this.selectedTable);
    // //console.log("alltables",this.tablesData);
     debugger;
    this.viewPreviewData = [];
    this.previewDataCalled = false;
    if(this.joinType && this.selectedTable1 && this.selectedTable2 && this.selectedTable1.joinField && this.selectedTable2.joinField){
      let selectedTable1FieldChecked = this.selectedTable1['fields']['schema'].find(sc=>sc.checked);
      let selectedTable2FieldChecked = this.selectedTable2['fields']['schema'].find(sc=>sc.checked);
      if(selectedTable1FieldChecked && selectedTable2FieldChecked){
        this.validToPreviewData = true;
      }else{
        this.validToPreviewData = false;
      }
      
    }else{
      this.validToPreviewData = false;
    }
  }
  joinTypeChanged(selectedType){
    this.joinType = selectedType;
    this.checkValidToPreview();
  }
  tableFieldChanged(){
    this.previewDataCalled = false;
    this.viewPreviewData = [];
    this.checkValidToPreview();
  }
  tableChanged(event,tblData){
    this.joinType = "";
    this.selectedTable1Val="";
    this.selectedTable2Val="";
    this.selectedTable1=null;
    this.selectedTable2=null;
    
    if(event.checked){
      if(this.selectedTable.length>1){
        const prevtbl = this.selectedTable[0];
        this.tablesData = this.tablesData.map((el)=>{
          if(el.name==prevtbl.name){
            el.checked =false;
            el.fields.schema.forEach(f => {
              f['checked']=false;
            });
          }
          if(el.name==tblData.name){
            el.checked =true;
          }
          return el;
        })
        this.selectedTable[0]=tblData;
      }else{
        this.tablesData = this.tablesData.map((el)=>{
          
          if(el.name==tblData.name){
            el.checked =true;
          }
          return el;
        })
        this.selectedTable.push(tblData);
      }
      
    }else{
      this.tablesData = this.tablesData.map((el)=>{
        if(el.name==tblData.name){
          el.checked =false;
          el.fields.schema.forEach(f => {
            f['checked']=false;
          });
        }
        return el;
      })
      this.selectedTable = this.selectedTable.filter(el=>el.name!=tblData.name);
    }
    //console.log(this.selectedTable);
    this.checkValidToPreview();
  }
  ngOnInit(): void {
    
    this.selectedClientId =this.route.snapshot.params.clientId;
    this.clientId = this.selectedClientId.split('#')[1];
    this.selectedSiteId = this.route.snapshot.params.siteId;
    this.token = this.route.snapshot.params.token;
    if(this.token){
      this.authService.setAuthToken(this.token)
    }
    this.role = sessionStorage.getItem('role');

    this.getClients();
    this.getSites();
    this._joinTablesService.getTablesNfields(this.clientId,this.selectedSiteId.split('#')[1]).subscribe((res:any)=>{
     debugger;
      if(res){
       Object.keys(res).forEach(element => {
        res[element].forEach(subelement => {
          let objTable={'parentname':element,'name':subelement.name,'fields':subelement};      
         this.tablesData.push(objTable);
        });
         
       });
      }
      this.dataLoaded = true;
      //console.log("this.tablesData",this.tablesData);
     },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
      //this.errorString =  err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
     })
  }
  titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }
 
  getClients(){
    this._clientService.getClients().subscribe( data => {
      data['clients'].forEach(client => {
        if(client.sortKey == this.route.snapshot.params.clientId)
          {
            this.clientInfo = client;           
            
          }
      });
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  getSites(){
    this._clientService.getSites(this.clientId).subscribe((sitesData)=> {
      sitesData['sites'].forEach(site => {
        if(site.sortKey == this.route.snapshot.params.siteId)
          {
            this.siteInfo = site;           
            
          }
      });
      
    },(httpError:HttpErrorResponse)=>{
     // this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  
  showMessage(message){
    this.snackBar.open(message, 'OK', {
      duration: 5000,
    });
  }

    goBack(){
      this.router.navigate(['clients',this.selectedClientId]);
    }

}
