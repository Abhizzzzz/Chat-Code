import { Injectable } from '@angular/core';
//Importing HttpClient and HttpErrorResponse
import {HttpClient,HttpErrorResponse, HttpParams} from '@angular/common/http';

//Importing observables related code
import { Observable } from "rxjs";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/throw';
// io as socket.io-client
import * as io from 'socket.io-client';
import { Cookie } from '../../node_modules/ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private url = 'https://chatapi.edwisor.com'; //server url
  private socket;

  constructor(public http: HttpClient) {
    //connection is being created
    //handshaking
    this.socket = io(this.url);
   }
  //  events to be listened we use on method
   public verifyUser = () =>{
    let listen = Observable.create((observer) =>{
      // it is listening to verifyUser event,this is a pattern to communicate through sockets to a event
      // when this event happens verifyUser we are getting the data and pushing it through next(data)
      this.socket.on('verifyUser',(data) =>{
        // we are pushing the data to the event
        console.log("Received data from verifyUser event")
        observer.next(data);
      });
    });
    return listen;
   }
   public onLineUserList = () =>{
    //  automatically runs this method when online-user-list is updated(as listeners have callback functions) as we are tracking live events using sockets
    let listen = Observable.create((observer) =>{
      // it is listening to online-user-list event,this is a pattern to communicate through sockets to a event
      // when this event happens online-user-list we are getting the userList and pushing it through next(userList)
      this.socket.on('online-user-list',(userList) =>{
        console.log("Received userList from online-user-list event")
        observer.next(userList);
      });
    });
    return listen;
   }
   public disconnectedSocket = () =>{
    let listen = Observable.create((observer) =>{
      // it is listening to disconnect event,this is a pattern to communicate through sockets to a event
      this.socket.on('disconnect',() =>{
        console.log("Disconnected called")
        observer.next();
      });
    });
    return listen;
   }
  //  events to be emitted we use emit method
  // while emitting we don't need observable
  public setUser = (authToken) =>{
    this.socket.emit('set-user',authToken);
  }
  // emitting event
  public markChatAsSeen = (userDetails) =>{
    this.socket.emit('mark-chat-as-seen',userDetails);
  }
  public getChat(senderId,receiverId,skip) :Observable<any>{
    return this.http.get(`${this.url}/api/v1/chat/get/for/user?senderId=${senderId}&receiverId=${receiverId}&skip=${skip}&authToken=${Cookie.get('authToken')}`)
    .do(data=>console.log("Data received")) // this is optional,it helps us to understand data is received
    .catch(this.handleError); // this is optional,if error occurs it goes to errorHandler message we created i.e handleError()

  }

  public getUserListOfUnseenChat(senderId) :Observable<any>{
    return this.http.get(`${this.url}/api/v1/chat/unseen/user/list?userId=${senderId}&authToken=${Cookie.get('authToken')}`)
    .do(data=>console.log("Data received")) // this is optional,it helps us to understand data is received
    .catch(this.handleError); // this is optional,if error occurs it goes to errorHandler message we created i.e handleError()
  }
  // This event ("userId") has to be listened to identify an individual chat message that has been received.
  public chatByUserId: any = (userId) =>{
    let listen = Observable.create(
      observer =>{
        this.socket.on(userId,data =>{
          observer.next(data);
        });
      }
    );
    return listen;
  }
  // This event ("chat-msg") has to be emitted to identify an individual chat message that has been send.
  public sendChatMessage = (chatMessageObject) =>{
    this.socket.emit('chat-msg',chatMessageObject);
  }
  // exit socket
  public exitSocket:any = () =>{
    // to disconect the socket to remove user from online
    this.socket.disconnect();
  }
  // logout is in appService

  //general exception handler for http request
  private handleError(err:HttpErrorResponse){
    console.log("Handle error http calls");
    console.log(err.message);
    return Observable.throw(err.message);
  }

}
