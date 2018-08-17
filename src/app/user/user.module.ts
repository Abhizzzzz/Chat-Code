import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import{RouterModule,Router} from '@angular/router';
//Requires for using forms in angular
import {FormsModule} from '@angular/forms';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:'signup',component:SignupComponent}
    ]),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    FormsModule
  ],
  declarations: [LoginComponent, SignupComponent]
})
export class UserModule { }
