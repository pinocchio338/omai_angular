import { HttpErrorResponse } from '@angular/common/http';
import { ElementRef,ChangeDetectorRef, SimpleChange  } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { ApplicationsService } from '../applications.service';
import { forkJoin } from 'rxjs';

// const this.applicationData: any[] = [
//   {SRNO: '1',A: '8 Sep, 2020', B: '7', C: '651535', D: 'Great Falls, Maryland', E: '0914640416', F: '35.7', G: '3571.94.19252' },
//   {SRNO: '2',A: '9 Sep, 2020', B: '8', C: '151535', D: 'Coppell, Vergenia', E: '9860731823', F: '21.7', G: '1644.94.19252' },
//   {SRNO: '3',A: '10 Sep, 2020', B: '9', C: '181514', D: 'Kent, Utah', E: '9075628922', F: '77.2', G: '3571.94.12883' },
//   {SRNO: '4',A: '12 Oct, 2020', B: '1', C: '411522', D: 'Corona, Michigan', E: '9075628923', F: '13.3', G: '2548.94.22354' },
//   {SRNO: '5',A: '24 Sep, 2020', B: '2', C: '458745', D: 'Coppell Falls, Vergenia', E: '0914640416', F: '35.7', G: '3571.94.19252' },
//   {SRNO: '6',A: '7 Sep, 2020', B: '3', C: '652356', D: 'Kent , Utah', E: '0914640416', F: '35.7', G: '3571.94.19252' },
//   {SRNO: '2',A: '9 Sep, 2020', B: '8', C: '151535', D: 'Coppell, Vergenia', E: '9860731823', F: '21.7', G: '1644.94.19252' },
//   {SRNO: '3',A: '10 Sep, 2020', B: '9', C: '181514', D: 'Kent, Utah', E: '9075628922', F: '77.2', G: '3571.94.12883' },
//   {SRNO: '4',A: '12 Oct, 2020', B: '1', C: '411522', D: 'Corona, Michigan', E: '9075628923', F: '13.3', G: '2548.94.22354' },
//   {SRNO: '5',A: '24 Sep, 2020', B: '2', C: '458745', D: 'Coppell Falls, Vergenia', E: '0914640416', F: '35.7', G: '3571.94.19252' },
//   {SRNO: '6',A: '7 Sep, 2020', B: '3', C: '652356', D: 'Kent , Utah', E: '0914640416', F: '35.7', G: '3571.94.19252' },
// ];
@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {
  // @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  errorString="";
  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
@ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild('dataFileInput', { static: false }) dataFileInput: ElementRef;
  @ViewChild('exporter') exporter;
  displayedColumns: string[]; // = ['SRNO','A', 'B', 'C', 'D','E', 'F','G'];
  dataSource: any;
  searchRow: any; // = {SRNO: '',A: '', B: '', C: '', D: '', E: '', F: '', G: '' }; 
  searchFilters : Array<any> = [];
  search : Array<any> = [];
  selectedClientId: string = '';
  selectedSiteId: string = '';
  selectedApplicationId: string = '';
  applicationName:string = '';
  applicationData: any = null;
  dataLoaded: boolean = false;
  fileToUpload: string;
  currentPage:number=0;
  clientInfo = null;
  selectedPageSize:any=10;
  pageList: number[] = [5,10,15,20,50,100];
  paginated:boolean = false;
  filtered:boolean = false;
  selectedSite: string = '';
  constructor(private _applicationsService:ApplicationsService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private authService:AuthService) { 
      
      this.dataLoaded = false;
    // this.dataSource.unshift(this.searchRow);
  }
  selectPage(page){
    this.paginated = true;
    if(page=='f'){
      this.currentPage = 0;
    }else if(page=='p'){
      if(this.currentPage>0){
        this.currentPage--;
      }
    }else if(page=='n'){
      //if(this.currentPage<this.applicationData.length){
        this.currentPage++;
      //}
    }else if(page=='l'){
      this.currentPage=this.applicationData.length;
       
    }
    this.getApplicationData();
  }
  pageSizeChange(){
    ////console.log("this.selectedPage",this.selectedPageSize);
    this.paginated = false;
    this.currentPage=0;
    this.getApplicationData();
  }
  ngOnInit(): void {
    this.clientInfo = this.authService.getClientInfo();
    this.selectedSite = sessionStorage.getItem('selectedSite');
    this.route.params.subscribe(params => {
      //console.log('here')
      this.selectedClientId = params['clientId']? decodeURIComponent(params['clientId']) : '';
      this.selectedSiteId = params['siteId']? decodeURIComponent(params['siteId']) : '';
      this.selectedApplicationId = params['applicationId']? decodeURIComponent(params['applicationId']) : '';
        // this._applicationService.getApplications(sele)
    
    
      // this.selectedClientId =this.route.snapshot.params.clientId;
      // this.selectedSiteId =this.route.snapshot.params.siteId;
      // this.selectedApplicationId =this.route.snapshot.params.applicationId;
      //console.log((this.selectedClientId , this.selectedSiteId , this.selectedApplicationId))
      if(!(this.selectedClientId && this.selectedSiteId && this.selectedApplicationId))
        return;

    this._applicationsService.getApplications(this.selectedClientId,this.selectedSiteId).subscribe((res:any)=>{
      res['applications'].forEach(application => {
        if(application['sortKey'].includes(this.selectedApplicationId))
          this.applicationName = application['name'];
      });
    },(httpError:HttpErrorResponse)=>{
      this.dataLoaded = true;
      //this.errorString = err.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
    this.getApplicationData();
    });
  }

  goBack(){
    this.router.navigate(['clients',"client#"+this.selectedClientId,"site#"+this.selectedSiteId]);
   }
   clearOtherFilter(filterColomn, event){
    //  console.error(event);
    if(event.key == 'Enter')
      this.filterTable(filterColomn);
    else  
      this.searchFilters=[];
    this.displayedColumns.forEach(column => {      
      if(column!=filterColomn){
        this.searchRow[column] = '';
        this.search[column] = '';
      }
      });
   }
   clearFilter(){
    this.searchFilters=[];
    this.displayedColumns.forEach(column => {      
      this.searchRow[column] = '';
      this.search[column] = '';
    });
    this.filtered=false;
    this.applicationData = [];
    this.paginated = false;
    this.currentPage=0;
    this.getApplicationData();
   }
  filterTable(filterColomn){
    
    //let columnindex = this.searchFilters.findIndex(element=>element.filterCol == filterColomn);
    let searchQ= this.search[filterColomn];
    // console.error(searchQ)
    if(!searchQ)
    return false;
    this.searchFilters=[];    
    this.searchFilters.push({'filterCol':filterColomn,'filterVal':searchQ});
    
    this.applicationData = [];
    this.filtered=true;
    this.paginated = false;
    this.currentPage=0;
    this.getApplicationData();
    // if(searchQ.trim().length>0){
    //   if(columnindex<0){
    //     this.searchFilters.push({'filterCol':filterColomn,'filterVal':searchQ});
      
    //   }else{
    //     this.searchFilters[columnindex].filterVal = searchQ;
    //   }
    //   this.dataSource = this.applicationData.filter((row:any)=>{
    //     const found = this.searchFilters.every((filter, index) => { 
    //       return row[filter.filterCol].toString().toLowerCase().includes(filter.filterVal.toLowerCase())
    //     })
    //     return found;
    //   });
    //  //console.log("this.searchRow",this.searchRow);
     
    //   this.dataSource.unshift(this.searchRow);
      
    //   this.cdr.detectChanges();
    //   if(columnindex<0){
    //     document.getElementById(filterColomn).focus();
    //   }
    // }else{
    //   if(columnindex>=0){
    //     this.searchFilters.splice(columnindex,1);
    //     if(this.searchFilters && this.searchFilters.length>0){
    //       this.dataSource = this.applicationData.filter((row:any)=>{
    //         const found = this.searchFilters.every((filter, index) => { 
    //           return  row[filter.filterCol].toString().toLowerCase().includes(filter.filterVal.toLowerCase())
    //         })
    //         return found;
    //       });
    //       this.dataSource.unshift(this.searchRow);
    //       this.dataSource.paginator = this.paginator;
    //       this.cdr.detectChanges();
    //     }else{
    //       this.dataSource = this.applicationData;
    //       this.dataSource.paginator = this.paginator;
    //       this.cdr.detectChanges();
    //     }
        
    //     //
    //   }else{
    //     this.dataSource = this.applicationData;
    //     this.dataSource.paginator = this.paginator;
    //     this.cdr.detectChanges();
        
    //   }
      
    // }
  }
  ngOnChanges(changes: SimpleChange) {
    if (changes["dataSource"]) {
      this.dataSource = new MatTableDataSource(this.dataSource);
      setTimeout(() =>{
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    }
  }
  ngAfterViewInit() {
    if(this.dataSource)
      this.dataSource.paginator = this.paginator
}
exportCsv(){
  this.exporter.exportTable('csv',{fileName:'applications_data'})
}
  applyfilter(element){
    return this.searchFilters.forEach((filter)=>{
      if(element[filter.filterCol].toLowerCase().includes(filter.filterVal.toLowerCase())){
       return true;
      }else{
        return false;
      }
    })
  }

  getApplicationData(){
    let filterKey='';
    let filterVal='';
    if(this.searchFilters.length>0){
      filterKey= this.searchFilters[0]['filterCol'];
      filterVal= this.searchFilters[0]['filterVal'];
    }
    this.dataLoaded = false;
    let start = this.currentPage*this.selectedPageSize;
    let end = this.selectedPageSize + start;
    start++;
    // this.applicationData = null;
    this._applicationsService.getApplicationData(this.selectedClientId, this.selectedSiteId, this.selectedApplicationId,start,end,filterKey,filterVal).subscribe(response => {      
      this.applicationData = response['data'];
      if(this.applicationData.length==0){
        this.displayedColumns = [];
      // this.dataSource ? this.dataSource.filteredData=[] : null;
      this.applicationData=[];
        this.dataLoaded = true;
        return;
      }
      
      this.applicationData = [this.applicationData[0],...this.applicationData]
      this.dataSource = new MatTableDataSource<any>(this.applicationData);
      // console.error(this.applicationData, this.dataSource)
      this.cdr.detectChanges();
      this.dataSource.paginator = this.paginator;
      // this.dataSource.paginator = this.paginator;
      if(this.applicationData.length>0){
        this.displayedColumns = Object.keys(this.applicationData[0]);
        this.searchRow = {};
        this.displayedColumns.forEach(column => {
      
          if(filterKey && column==filterKey){
            this.searchRow[column] = filterVal;
            this.search[column] = filterVal;
          }else{
            this.searchRow[column] = '';
            this.search[column] = '';
          }
         
        })
        
      }
      else{
        // console.error('empty data');
        this.displayedColumns = [];
      // this.dataSource ? this.dataSource.filteredData=[] : null;
      this.applicationData=[];
      }
      this.dataLoaded = true;
    }, (httpError:HttpErrorResponse)=>{
      //this.showMessage('Could Not Load Data');
      this.dataLoaded = true;
      this.displayedColumns = [];
      // this.dataSource ? this.dataSource.filteredData=[] : null;
      this.applicationData=[];
      //this.errorString = error.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

  openData(){
    this.dataFileInput.nativeElement.click();
  }
  handleFileInput(event, type: string) {
    //this.readCSV(files,'data');
    let files:FileList = event.target.files;
    this.uploadAppFiles(event, files,'data');
  }
  uploadAppFiles(event,files: FileList, type: string) {
  

    if(files.length > 5){
      this.dataLoaded = true;
      this.authService.updateErrorMessage("Maximum 5 Files Are Allowed");
      return;
    }
    this.dataLoaded = false;
    let uploadCalls = [];
    if (files && files.length > 0) {
     
      var bar = new Promise((resolve, reject) => {
      for (let i = 0; i < files.length; i++) {
        let file: File = files.item(i);
        if(!file.name.split('.')[1].includes('csv'))
      {
        if(files.length-1 == i)
          this.dataLoaded = true;
        event.target.value = null;  
        this.authService.updateErrorMessage('Please upload a valid file');
        break;
      }
      if(file.size / 1000000 >4){
        this.authService.updateErrorMessage('File size cannot exceed 4MB');
        // return;
        break;
      }
        let reader: FileReader = new FileReader();
        reader.readAsText(file);
        try{
        reader.onload = (e) => {
          let csv: string = reader.result as string;
          //console.log('csv', csv)
          csv = "data:@file/csv;base64," + btoa(csv)
          let data = {};
          data[type] = csv;
          let uploadcall = this._applicationsService.updateConfigSchemaOrData(
            this.selectedClientId,
        this.selectedSiteId,
        this.selectedApplicationId,
            data, type);
            uploadCalls.push(uploadcall);
            if (files.length === uploadCalls.length) {resolve(true);
              }
        } }
        catch(e){
          this.dataLoaded = true;
        }       
      }
    }).then(()=>{
      forkJoin(uploadCalls).subscribe((res:any)=>{
        this.getApplicationData();
        this.showMessage('Data upload initiated successfully');
        this.dataLoaded = true;
      }, (httpError:HttpErrorResponse) => {
            
        //this.showMessage('Could not upload file');
        this.dataLoaded = true;
        //this.errorString = error['error']['message'];
        this.authService.updateErrorMessage(httpError['error']['message']);
      })
    })
  }
    
  }

  readCSV(files: any, type: string): void {
    //console.log(files);
    if(files && files.length > 0) {
       let file : File = files.item(0);
       if(files[0].size / 1000000 >4){
        this.authService.updateErrorMessage('File size cannot exceed 4MB');
        return;
      }
         let reader: FileReader = new FileReader();
         reader.readAsText(file);
         this.dataLoaded = false
         try{
         reader.onload = (e) => {
            let csv: string = reader.result as string;
            //console.log('csv',csv)
            csv = "data:@file/csv;base64,"+btoa(csv)
            let data={};
            data[type]= csv;
                  this._applicationsService.updateConfigSchemaOrData(
        this.selectedClientId,
        this.selectedSiteId,
        this.selectedApplicationId,        
        data, 'data' ).
      subscribe(response => {
        //console.log('layout added', response)
        this.getApplicationData();
        this.dataLoaded = true;
      }, (httpError:HttpErrorResponse) => {
        //this.showMessage('Could Not Upload File');
        this.dataLoaded = true;
        //this.errorString = error.error.message;
        this.authService.updateErrorMessage(httpError['error']['message']);
      })
         }
        }
        catch(e){
          this.dataLoaded = true;
        }
      }
  }

  showMessage(message){
    this.snackBar.open(message, 'OK', {
      duration: 5000,
    });
  }
  downloadDataOnEmail(){
    this.dataLoaded = false;
    this._applicationsService.getDataOnEmail(this.selectedClientId,this.selectedSiteId,this.selectedApplicationId).subscribe((res:any)=>{
      //console.log("res",res);
      this.dataLoaded = true;
      this.showMessage("Application data link has been sent on your email");
    }, (httpError:HttpErrorResponse) => {
      //this.showMessage('Could Not Upload File');
      this.dataLoaded = true;
      //this.errorString = error.error.message;
      this.authService.updateErrorMessage(httpError['error']['message']);
    })
  }

}
