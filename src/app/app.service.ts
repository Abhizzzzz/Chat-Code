import { Injectable } from '@angular/core';
import {Cookie} from 'ng2-cookies/ng2-cookies'; 
//Importing HttpClient and HttpErrorResponse
import {HttpClient,HttpErrorResponse, HttpParams} from '@angular/common/http';

//Importing observables related code
import { Observable } from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  private url = 'https://chatapi.edwisor.com/api/v1';

  constructor(public http: HttpClient) { 
    console.log("Service called");
  }

  public setUserInfoInLocalStorage = (data) =>{
    localStorage.setItem('userInfo',JSON.stringify(data));
  }

  public getUserInfoFromLocalStorage = () =>{
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  public signUpFunction(data): Observable<any>{
    const params = new HttpParams()
    .set('firstName',data.firstName)
    .set('lastName',data.lastName)
    .set('mobile',data.mobile)
    .set('email',data.email)
    .set('password',data.password)
    .set('apiKey',data.apiKey);

    let response = this.http.post(`${this.url}/users/signup`,params);
    return response;

  }

  public signInFunction(data): Observable<any>{
    const params = new HttpParams()
    .set('email',data.email)
    .set('password',data.password);

    let response = this.http.post(`${this.url}/users/login`,params);
    return response;
  }

  // for logout
  public logout():Observable<any>{
    const params = new HttpParams().set('authToken',Cookie.get('authToken'))
    return this.http.post(`${this.url}/users/logout`,params);
  }

  //general exception handler for http request
  private handleError(err:HttpErrorResponse){
    console.log("Handle error http calls");
    console.log(err.message);
    return Observable.throw(err.message);
  }

}
