import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';


const routes: Routes = [
   { path: '', component: ResetpasswordComponent },
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResetpasswordRoutingModule { }
