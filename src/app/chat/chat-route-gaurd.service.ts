import { Injectable } from '@angular/core';
// for route gaurd
import { Router,CanActivate,ActivatedRouteSnapshot } from '@angular/router';
// to get the cookies information to verify the route gaurd
import { Cookie } from 'ng2-cookies/ng2-cookies';
@Injectable({
  providedIn: 'root'
})
// implementing the CanActivate interface
export class ChatRouteGaurdService implements CanActivate {

  constructor(private router: Router) { }
  // interface's method which return true or false,true means yes allowed to access the link of /chat,false means we can't.
  canActivate(route: ActivatedRouteSnapshot): boolean {
    console.log("In route gaurd");
    if(Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') === null){
      this.router.navigate(['/']);
      return false; //not allowed to go to /chat page
    }
    else{
      return true; //allowed to go to /chat page
    }
  }
}
