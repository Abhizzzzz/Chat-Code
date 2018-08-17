import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ChatModule } from './chat/chat.module';
import { SharedModule } from './shared/shared.module';

import {RouterModule,Router} from '@angular/router';
import { LoginComponent } from './user/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { SocketService } from './socket.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    UserModule,
    ChatModule,
    SharedModule,
    RouterModule.forRoot([
      {path:'login',component:LoginComponent,pathMatch: 'full'},
      {path:'',redirectTo:'login',pathMatch: 'full'},
      {path:'*',component:LoginComponent},
      {path:'**',component:LoginComponent}
    ]),
    HttpClientModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
