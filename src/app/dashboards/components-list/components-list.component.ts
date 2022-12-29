import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DashboardsService } from '../dashboards.service'

@Component({
  selector: 'app-components-list',
  templateUrl: './components-list.component.html',
  styleUrls: ['./components-list.component.scss']
})
export class ComponentsListComponent implements OnInit {
  errorString="";
  dataLoaded: boolean = true;
  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dashboardsService: DashboardsService) {
      this.selectedClientId = data['selectedClientId'].split('#')[1];
      // this.selectedSiteId = data['selectedSiteId'].split('#')[1];
      // this.dashboardsService.getComponentsForSite(this.selectedClientId,this.selectedSiteId).subscribe(response=>{
      //   //console.log(response)
        this.components = data['data']['components'];
        //console.log(this.components);
      // })
     }

  selectedClientId: string = '';
  selectedSiteId: string = '';
  components: any;
  ngOnInit(): void {

  }

  deleteComponent(componentId,index){
    this.dataLoaded = false;
    this.dashboardsService.deleteComponent(this.selectedClientId,componentId).subscribe(data=>{
      this.components.splice(index,1);
      this.dataLoaded = true;
    },
    (error: HttpErrorResponse) => {
      this.dataLoaded = true;
    })
  }

  close(): void {
    this.dialogRef.close();
  }

}
