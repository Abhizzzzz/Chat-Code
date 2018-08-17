import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppService } from '../../app.service';
import {ActivatedRoute,Router} from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  firstName: any;
  lastName: any;
  mobile: any;
  email: any;
  password: any;
  apiKey: any;

  constructor(private toastr: ToastrService,public service: AppService,public router: Router) {
    console.log("Signup called");
   }

  ngOnInit() {
  }

  goToSignIn() {
    this.router.navigate(['/']);
  }

  signupFunction() {
    if(!this.firstName){
      this.toastr.warning('Enter first name');
    }
    else if(!this.lastName){
      this.toastr.warning('Enter last name');
    }
    else if(!this.mobile){
      this.toastr.warning('Enter mobile');
    }
    else if(!this.email){
      this.toastr.warning('Enter email');
    }
    else if(!this.password){
      this.toastr.warning('Enter password');
    }
    else if(!this.apiKey){
      this.toastr.warning('Enter api key');
    }
    else{
      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        mobile: this.mobile,
        email: this.email,
        password: this.password,
        apiKey: this.apiKey
      }

      this.service.signUpFunction(data).subscribe((apiResponse) =>{
        console.log(apiResponse);
        if(apiResponse.status == 200){
          this.toastr.success('Signup successful');
          setTimeout(() =>{
            this.goToSignIn();
          },2000)
        }
        else{
          this.toastr.error(apiResponse.message);
        }
      })
     
    }
  }

}
