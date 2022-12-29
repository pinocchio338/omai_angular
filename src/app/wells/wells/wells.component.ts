import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { WellsService } from '../wells.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientsService } from 'src/app/clients/clients.service';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-wells',
  templateUrl: './wells.component.html',
  styleUrls: ['./wells.component.scss']
})
export class WellsComponent implements OnInit {
  allWells: Array<any> = [];
  wells: Array<any> = [];
  activeWells : Array<any> = [];
  inActiveWells : Array<any> = [];
  wellTypeSelected : string ='All';
  currentPage : number = 1;
  recordsPerPage : number =5;
  allPages : Array<number> = [];
  addNewCell : boolean = false;
  editWell:any=null;
  newWell : any = {'wellid':'','status':'inactive','name':'','wellCordinates':''};
  wellStatuses : Array<any> = [{'key':'Active','value':'active'},{'key':'InActive','value':'inactive'}];
  selectedClientId: string = null;
  selectedSiteId: string = null;
  clientId:string=null;
  dataLoaded:boolean = false;
  clientInfo:any=null;
  siteInfo:any=null;
  errorString="";
  newWellError:any={'wellid':false,'status':false,'name':false,'coordinates':false,'response':''};
  editWellError:any={'wellid':false,'status':false,'name':false,'coordinates':false,'response':''};
  constructor(private dialog: MatDialog ,private _clientService:ClientsService, private _wellsService:WellsService, private router: Router, private route: ActivatedRoute,public alertDialog: MatDialog,private authService:AuthService) { 
  
  }
  
  changeWellTypeTo(wellType){
    this.wellTypeSelected = wellType;
    if(wellType=='All'){
      this.wells = this.allWells;
    } else if(wellType=='Active'){
      this.wells = this.activeWells;
    } else if(wellType=='InActive'){
      this.wells = this.inActiveWells;
    }
  }
  editInlineWell(wellForEdit){
  
    this.editWell = JSON.parse(JSON.stringify(wellForEdit));
    this.editWell.wellCordinates = this.editWell.latitude+','+this.editWell.longitude;
    this.wells = this.wells.map((well)=>{ well.edit=false; if(well.wellid==wellForEdit.wellid){well.edit=true} return well;})
  }
  cancelInlineEdit(wellForEdit){
    wellForEdit.edit=false;
    this.editWell = null;
    
  }
  cancelNewWell(){
    this.addNewCell=false;
    this.newWell  = {'wellid':'','status':'inactive','name':'','wellCordinates':''};
    this.newWellError = {'wellid':false,'status':false,'name':false,'coordinates':false,'response':''};
 
  }
  saveNewWell(){
let newWellValid=true;
    this.newWellError = {'wellid':false,'status':false,'name':false,'coordinates':false,'response':''};
    let newWellLat=this.newWell.wellCordinates.split(',')[0];
    let newWellLong=this.newWell.wellCordinates.split(',')[1];
    const wellForSave={
      'name':this.newWell.name,
      'status':this.newWell.status,
      'wellid':this.newWell.wellid,
      'coordinates':{'latitude':newWellLat,'longitude':newWellLong}
    }
    if(!wellForSave.wellid || wellForSave.wellid.trim().length<=0){
      this.newWellError['wellid']=true;
      newWellValid=false;
      ///this.showAlert('','error','Please enter valid well id.');
    }
    if(!wellForSave.status){
      this.newWellError['status']=true;
      newWellValid=false;
      //this.showAlert('','error','Please select well status.');
    }
    if(!wellForSave.name || wellForSave.name.trim().length<=0){
      this.newWellError['name']=true;
      newWellValid=false;
      //this.showAlert('','error','Please enter valid well name.');
    }
    if(!newWellLat || !newWellLong){
      this.newWellError['coordinates']=true;
      newWellValid=false;
      //this.showAlert('','error','Please enter valid coordinates.');
    }
    if(!newWellValid){
      //this.showAlert('','error','Please Check All Required Fields Are Valid.');
      return false;
    }
    //'wellid':false,'status':false,'cordinates':false,'name':false
    this.dataLoaded = false;
    this._wellsService.createNewWell(this.clientId,this.selectedSiteId.split('#')[1],wellForSave).subscribe((res:any)=>{
      this.newWell  = {'wellid':'','status':'inactive','name':'','wellCordinates':''};
      
      this.addNewCell = false;
      this.getWells();
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
     // this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
     // this.showAlert('','error',err.error.message);
    })
    // this._wellsService.addNewWell(wellForSave).then((res)=>{
    //   this.allWells.unshift(this.newWell);
    //   this.wells.unshift(this.newWell);
    //   this.activeWells = this.allWells.filter((well)=>well.status=='active');
    //   this.inActiveWells = this.allWells.filter((well)=>well.status=='inactive');
    //   localStorage.setItem('wells',JSON.stringify(this.wells));
    //   for(let p=1;p<=this.allWells.length/this.recordsPerPage;p++){
    //     this.allPages.push(p);
    //   }
    //   this.addNewCell = false;
    // })
    
  }
  saveEditedWell(editWell){
    debugger;
    let editWellValid=true;
        this.editWellError = {'wellid':false,'status':false,'name':false,'coordinates':false,'response':''};
        let editWellLat=editWell.wellCordinates.split(',')[0];
        let editWellLong=editWell.wellCordinates.split(',')[1];
        const wellForSave={
          'name':editWell.name,
          'status':editWell.status,
          'wellid':editWell.wellid,
          'coordinates':{'latitude':editWellLat,'longitude':editWellLong}
        }
        if(!wellForSave.wellid || wellForSave.wellid.trim().length<=0){
          this.editWellError['wellid']=true;
          
          editWellValid=false;
          //this.showAlert('','error','Please enter valid well id.');
        }
        if(!wellForSave.status){
          this.editWellError['status']=true;
         
          editWellValid=false;
          //this.showAlert('','error','Please select well status.');
        }
        if(!wellForSave.name || wellForSave.name.trim().length<=0){
          this.editWellError['name']=true;
          editWellValid=false;
          //this.showAlert('','error','Please enter valid well name.');
         
        }
        if(!editWellLat || !editWellLong){
          this.editWellError['coordinates']=true;
          editWellValid=false;
          //this.showAlert('','error','Please enter valid coordinates.');
        }
        if(!editWellValid){
         // this.showAlert('','error','Please Check All Required Fields Are Valid.');
          return false;
        }
        //'wellid':false,'status':false,'cordinates':false,'name':false
        this.dataLoaded = false;
        this._wellsService.updateWell(this.clientId,this.selectedSiteId.split('#')[1],wellForSave).subscribe((res:any)=>{
          this.editWell =null;
          this.getWells();
        },(httpError:HttpErrorResponse)=>{
          this.dataLoaded = true;
         // this.errorString = err.error.message;
          this.authService.updateErrorMessage(httpError['error']['message']);
         //this.showAlert('','error',err.error.message);
          
        })
        // this._wellsService.addNewWell(wellForSave).then((res)=>{
        //   this.allWells.unshift(this.newWell);
        //   this.wells.unshift(this.newWell);
        //   this.activeWells = this.allWells.filter((well)=>well.status=='active');
        //   this.inActiveWells = this.allWells.filter((well)=>well.status=='inactive');
        //   localStorage.setItem('wells',JSON.stringify(this.wells));
        //   for(let p=1;p<=this.allWells.length/this.recordsPerPage;p++){
        //     this.allPages.push(p);
        //   }
        //   this.addNewCell = false;
        // })
        
      }
      showAlert(alertMsg='',alertType='success',alertTitle='') {
        const dialogRef = this.alertDialog.open(AlertComponent,{data:{
          alertMsg:alertMsg,
          alertType:alertType,
          alertTitle:alertTitle
        },panelClass:'modal-alert'});
    
        // dialogRef.afterClosed().subscribe(result => {
        //   this.dataLoaded = true;
        // });
      }
  deleteWell(wellForDelete){
   
    this.dataLoaded = false;
    let wellIdForDelete = wellForDelete.wellid;
    this._wellsService.deleteWell(this.clientId,this.selectedSiteId.split('#')[1],wellIdForDelete).subscribe((res)=>{
      this.getWells();
    },(httpError:HttpErrorResponse)=>{
      
      this.dataLoaded = true;
     // this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }
  addNewWell() {
    this.addNewCell = true;
    // const dialogRef = this.dialog.open(NewwellComponent,{width:'592px',panelClass:'modal-well'});

    // dialogRef.afterClosed().subscribe(result => {
    //   if(result){
    //     let wellsData = this._wellsService.getAllWells();
    //     if(wellsData){
    //       this.wellTypeSelected = 'All';
    //       this.allWells = JSON.parse(wellsData);
    //       this.wells = this.allWells;
    //       this.activeWells = this.allWells.filter((well)=>well.wellStatus=='Active');
    //       this.inActiveWells = this.allWells.filter((well)=>well.wellStatus=='InActive');
    //     }    
    //   }
    // });
  }
  searchWell(event){

    let searchQ= event.target.value;
    if(searchQ.trim().length>0){
      if(this.wellTypeSelected=='All'){
        this.wells = this.allWells.filter((well:any)=>well.name.toLowerCase().includes(searchQ.toLowerCase()) || well.wellid.toLowerCase().includes(searchQ.toLowerCase()) || well.latitude.toString().toLowerCase().includes(searchQ.toLowerCase()) || well.longitude.toString().toLowerCase().includes(searchQ.toLowerCase()));
      } else if(this.wellTypeSelected=='Active'){
        this.wells = this.activeWells.filter((well:any)=>well.name.toLowerCase().includes(searchQ.toLowerCase()) || well.wellid.toLowerCase().includes(searchQ.toLowerCase()) || well.latitude.toString().toLowerCase().includes(searchQ.toLowerCase()) || well.longitude.toString().toLowerCase().includes(searchQ.toLowerCase()));
      } else if(this.wellTypeSelected=='InActive'){
        this.wells = this.inActiveWells.filter((well:any)=>well.name.toLowerCase().includes(searchQ.toLowerCase()) || well.wellid.toLowerCase().includes(searchQ.toLowerCase()) || well.latitude.toString().toLowerCase().includes(searchQ.toLowerCase()) || well.longitude.toString().toLowerCase().includes(searchQ.toLowerCase()));
      }
    }else{
    
    if(this.wellTypeSelected=='All'){
      this.wells = this.allWells;
    } else if(this.wellTypeSelected=='Active'){
      this.wells = this.activeWells;
    } else if(this.wellTypeSelected=='InActive'){
      this.wells = this.inActiveWells;
    }
    }
  }
  ngOnInit(): void {
    
    this.selectedClientId =this.route.snapshot.params.clientId;
    this.clientId = this.selectedClientId.split('#')[1];
    this.selectedSiteId = this.route.snapshot.params.siteId;
    this.dataLoaded = false;
    this.getClients();
    this.getSites();
    this.getWells();
    
  }
  titleCase(str) {
    return str.toLowerCase().split(' ').map(function(word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }
  getWells(){
    this.allPages = [];
    this.currentPage = 1;
    let wellsData = this._wellsService.getAllWells(this.clientId,this.selectedSiteId.split('#')[1]).subscribe((res:any)=>{
      if(res && res.wells){
        this.allWells = res.wells;
        //console.log("this.allWells",this.allWells);
        this.wells = this.allWells.filter((well,index)=>index<this.recordsPerPage*this.currentPage);
        this.activeWells = this.allWells.filter((well)=>well.status=='active');
        this.inActiveWells = this.allWells.filter((well)=>well.status=='inactive');
        for(let p=1;p<=Math.ceil(this.allWells.length/this.recordsPerPage);p++){
          this.allPages.push(p);
        }
        
        this.dataLoaded = true;
      }
    },(httpError:HttpErrorResponse)=>{
      //this.errorString = err.error.message;
      this.dataLoaded = true;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
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
  gotoPage(page){
    this.currentPage = page;
    let stratPos= this.recordsPerPage*this.currentPage;
    this.wells = this.allWells.filter((well,index)=>index>=stratPos-this.recordsPerPage && index<this.recordsPerPage*this.currentPage);
  }
  pagePrev(){
    if(this.currentPage==1)
    return false;
    
    let lastPos = this.recordsPerPage*this.currentPage;
let startPos = lastPos-this.recordsPerPage;
    this.currentPage--;
    this.wells = this.allWells.filter((well,index)=>index>=startPos-this.recordsPerPage && index<startPos);
     }
  pageNext(){
    
    if(this.currentPage>=this.allPages.length)
    return false;
    let lastPos = this.recordsPerPage*this.currentPage;
    this.currentPage++;
    this.wells = this.allWells.filter((well,index)=>index>=lastPos && index<this.recordsPerPage*this.currentPage);
    }

    goBack(){
      this.router.navigate(['clients',this.selectedClientId]);
    }

}
