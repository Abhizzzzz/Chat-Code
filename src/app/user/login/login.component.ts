import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import {Cookie} from 'ng2-cookies/ng2-cookies'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email;
  password;

  constructor(public router: Router,private toastr: ToastrService,public service: AppService) {
    console.log("Login called");
   }

  ngOnInit() {
  }
  public sendMessageUsingKeyPress: any = (event: any) => {
    if (event.keyCode === 13) { // 13 is the key code for enter
      this.signinFunction();
    }
  }
  goToSignUp(){
    this.router.navigate(['/signup'])
  }

  signinFunction(){
    if(!this.email){
      this.toastr.warning('Enter email');
    }
    else if(!this.password){
      this.toastr.warning('Enter password');
    }
    else{
      let data = {
        email: this.email,
        password: this.password
      }
      this.service.signInFunction(data).subscribe((apiResponse) =>{
        console.log(apiResponse);
        if(apiResponse.status == 200){
          this.toastr.success('Login successful');
          Cookie.set('authToken',apiResponse.data.authToken);
          Cookie.set('receiverId',apiResponse.data.userDetails.userId);
          Cookie.set('receiverName',apiResponse.data.userDetails.firstName+' '+apiResponse.data.userDetails.lastName);
          this.service.setUserInfoInLocalStorage(apiResponse.data.userDetails);
          this.router.navigate(['/chat']);
        }
        else{
          this.toastr.error(apiResponse.message);
        }
      })
    }
  }

}
