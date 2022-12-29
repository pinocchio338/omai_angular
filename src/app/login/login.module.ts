import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LoginRoutingModule } from './login-routing.module'
import { MaterialmoduleModule } from '../materialmodule/materialmodule.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module'
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MaterialmoduleModule,
    LoginRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  // bootstrap: [LoginComponent]
})
export class LoginModule { }
