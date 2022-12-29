import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


@Component({
  selector: 'app-draft-modal-box',
  templateUrl: './draft-modal-box.component.html',
  styleUrls: ['./draft-modal-box.component.scss']
})
export class DraftModalBoxComponent implements OnInit {
  dialogRef: any;

  

  constructor(private router: Router, private route: ActivatedRoute,  public dialog: MatDialog  ) { }

  ngOnInit(): void {
  }




  closeDialogbox(){

    this.dialog.closeAll()
  }


  goToHome(){
    
    this.dialog.closeAll()
    this.router.navigate(['clients']);
    localStorage.removeItem("draft_clientId")
    localStorage.removeItem("client_Id")
    
  }

}
