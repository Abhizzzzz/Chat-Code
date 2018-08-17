import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBoxComponent } from './chat-box/chat-box.component';

import{RouterModule,Router} from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { RemoveSpecialCharPipe } from '../shared/pipe/remove-special-char.pipe';
import { ChatRouteGaurdService } from './chat-route-gaurd.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      // when we access this path first it will go to canActivate i.e ChatRouteGaurdService
      {path:'chat',component:ChatBoxComponent,canActivate:[ChatRouteGaurdService]}
    ]),
    SharedModule
  ],
  declarations: [ChatBoxComponent,RemoveSpecialCharPipe],
  providers: [ChatRouteGaurdService]
})
export class ChatModule { }
