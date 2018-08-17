import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstCharComponent } from './first-char/first-char.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { FormsModule } from '../../../node_modules/@angular/forms';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FirstCharComponent, UserDetailsComponent],
  exports: [FirstCharComponent,UserDetailsComponent,CommonModule,FormsModule]
})
export class SharedModule { }
