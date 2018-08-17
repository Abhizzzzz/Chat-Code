import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { SocketService } from '../../socket.service';
import { AppService } from '../../app.service';
import { Cookie } from '../../../../node_modules/ng2-cookies/ng2-cookies';
import { Router } from '../../../../node_modules/@angular/router';
import { ToastrService } from '../../../../node_modules/ngx-toastr';
import { ChatMessageInterface } from './ChatMessageInterface';
//As we are using route-gaurd
// import { CheckUserInterface } from '../../CheckUserInterface';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.css'],
  providers: [SocketService]
})
//As we are using route-gaurd we removed the interface we created and commented down the methods
export class ChatBoxComponent implements OnInit{
  @ViewChild('scrollMe',{read:ElementRef})
  // declare a variable scrollMe of ElementRef
  public scrollMe: ElementRef;
  authToken: any;
  userInfo: any;
  receiverId: any;
  receiverName: any;
  userList: any = [];
  unreadUserList: any = [];
  unreadUserListButOffline: any = [];
  userListButNotUnread: any = [];
  userListButNotUnreadFlag : boolean;
  count: any;
  count1: any;
  repeat: any;
  repeat1: any;
  unreadUserListButOfflineFlag : boolean;
  disconnectedSocket: boolean;
  messageText: any;
  messageList: any = [];
  scrollToChatTop: boolean = false;
  pageValue: any = 1;
  loadingPreviousChat: boolean = false;
  constructor(public socketService: SocketService, public appService: AppService, public router: Router, private toastr: ToastrService) {
    console.log("Chat-Box is called");
  }

  ngOnInit() {
    this.authToken = Cookie.get('authToken');
    this.userInfo = this.appService.getUserInfoFromLocalStorage();
    this.receiverId = Cookie.get('receiverId');
    this.receiverName = Cookie.get('receiverName');
    console.log(this.receiverName);
    if(this.receiverId && this.receiverName != null || this.receiverId && this.receiverName != undefined || this.receiverId && this.receiverName != ''){
      this.userSelectedToChat(this.receiverId,this.receiverName);
    }
    //As we are using route-gaurd
    // this.checkStatus();
    this.verifyUserConfirmation();
    // this.getOnlineUserList();
    this.getMessageFromAUser();
    this.unreadUsers();
  }
  //As we are using route-gaurd
  // public checkStatus = () => {
  //   if (this.authToken === undefined || this.authToken === '' || this.authToken === null) {
  //     this.router.navigate(['/']);
  //     return false;
  //   }
  //   else {
  //     return true;
  //   }
  // }
  public verifyUserConfirmation = () => {
    this.socketService.verifyUser().subscribe(
      (data) => {
        this.disconnectedSocket = false;
        this.socketService.setUser(this.authToken);
        this.getOnlineUserList();
      })

  }
  public getOnlineUserList = () => {
    this.socketService.onLineUserList().subscribe(
      (data) => {
      console.log(data);
      this.unreadUsers();
      this.userList = [];
      for (let x in data) {
        let temp = { 'userId': x, 'name': data[x], 'read': 0, 'chatting': false }
        this.userList.push(temp);
      }
      
      this.unreadUserListButOffline = []; // initalized to avoid duplicate data
      // as we are getting the online userList from events and unreadUserList from rest api.Rest api response comes first as they are faster than events,that's why we are writing the logic here after getting the events response.
      // for unread messages but offline(i.e not in the online list)
      for(let x of this.unreadUserList){
        
        this.unreadUserListButOfflineFlag = false;
        for(let y of this.userList){
          // checking whether the unread message user is there in online list user,if present setting flag and count to true and 0
          if(x.userId == y.userId){
            this.unreadUserListButOfflineFlag = true;
            this.count = 0;
            console.log(x.name);
            this.count++;
            break;
            
          }
        }
        // now excluding the common user from the unreadUserList
        if(!this.unreadUserListButOfflineFlag && this.count != 0){
          // for first entry to initialize the array as it is not initialized
          if(this.unreadUserListButOffline.length == 0){
          console.log(x.name);
          this.unreadUserListButOffline.push(x);
          }
          // this is for not allowing duplicate values to go in unreadUserListButOffline array-
          //  as we are using events it keeps up updating every record again and again
          else{
            console.log(x.name);
            for(let i of this.unreadUserListButOffline){
              console.log(i);
              console.log(x);
              this.repeat = 0;
              // if we found the same userId we are setting repeat flag
              if(x.userId === i.userId){
                console.log(x.name);
                this.repeat++;
                break;
              }
            }
            // only if the userId is not repeated we are pushing it in the array.
            if(this.repeat == 0){
              console.log(x.name);
              this.unreadUserListButOffline.push(x);
            }
          }
        }
        
      }
      console.log(this.userList);
      console.log(this.unreadUserListButOffline);


      
      this.userListButNotUnread = []; // initalized to avoid duplicate data
      // online user list expect in unread user list,same as above only first for loop array in second and second in first
      // same logic only array interchanged
      for(let x of this.userList){
        this.userListButNotUnreadFlag = false;
        for(let y of this.unreadUserList){
          if(x.userId == y.userId){
            this.userListButNotUnreadFlag = true;
            this.count1 = 0;
            console.log(x.name);
            this.count1++;
            break;
            
          }
        }

        if(!this.userListButNotUnreadFlag && this.count1 != 0){
          
          if(this.userListButNotUnread.length == 0){
          console.log(x.name);
          this.userListButNotUnread.push(x);
          }
          
          else{
            console.log(x.name);
            for(let i of this.userListButNotUnread){
              console.log(i);
              console.log(x);
              this.repeat1 = 0;
              
              if(x.userId === i.userId){
                console.log(x.name);
                this.repeat1++;
                break;
              }
            }
            
            if(this.repeat1 == 0){
              console.log(x.name);
              this.userListButNotUnread.push(x);
            }
          }
        }

      }
      
    });
  }

  // sending message on pressing enter key
  public sendMessageUsingKeyPress: any = (event: any) => {
    if (event.keyCode === 13) { // 13 is the key code for enter
      this.sendMessage();
    }
  }
  // when we send message
  public sendMessage: any = () => {
    if (this.messageText) {
      let chatMessageObject: ChatMessageInterface = {
        senderName: this.userInfo.firstName + ' ' + this.userInfo.lastName,
        senderId: this.userInfo.userId,
        receiverName: Cookie.get('receiverName'),
        receiverId: Cookie.get('receiverId'),
        message: this.messageText,
        createdOn: new Date()
      }
      console.log(chatMessageObject);
      this.socketService.sendChatMessage(chatMessageObject);
      this.pushToChatWindow(chatMessageObject);
    }
    else {
      this.toastr.warning('Text message cannot be empty');
    }
  }

  public pushToChatWindow = (data) => {
    this.messageText = '';
    this.messageList.push(data);
    this.scrollToChatTop = false;
  }
  // when we receives a message
  public getMessageFromAUser: any = () =>{
    this.socketService.chatByUserId(this.userInfo.userId).subscribe(
      data =>{
        // method is not being called manually as it is event.
        this.getOnlineUserList();
        (this.receiverId == data.senderId)?this.messageList.push(data):'';
        this.toastr.success(`${data.senderName} says ${data.message}`);
        this.scrollToChatTop = false;
      }
    );
    
  }
// setting user as active for UI purpose
  public userSelectedToChat = (id,name) =>{
    // map functions goes one by one(user) through the array(userList).This functionality can be acheived by for of as well.
    this.userList.map(
      user =>{
        if(user.userId == id){
          user.chatting = true;
          // so when we click on the unread message user,the new unreadUsers comes up(refreshes)
          // this.unreadUsers();
          user.read = 1;
        }
        else{
          user.chatting = false;
        }
      }
    );
    Cookie.set('receiverId',id);
    Cookie.set('receiverName',name);
    this.receiverId = id;
    this.receiverName = name;
    this.messageList = [];
    this. pageValue = 0;
    let chatObject = {
      userId: this.userInfo.userId,
      senderId: id
    }
    this.socketService.markChatAsSeen(chatObject);
    this.getPreviousChatWithUser();
  }
  // pagination api to get the chats
  public getPreviousChatWithUser = () =>{
    // if messageList has something add into previousData else an empty array [].
    let previousData = (this.messageList.length > 0 ? this.messageList.slice(): []);
    this.socketService.getChat(this.userInfo.userId,this.receiverId,this.pageValue * 10).subscribe(
      data =>{
        if(data.status == 200){
          this.messageList = data.data.concat(previousData);
        }
        else{
          this.messageList = previousData;
          this.toastr.warning('No messages available');
        }
      }
    )
  }
  // loading earlier chats when clicked on load earlier chats button
  public loadEarlierPageOfChat : any = () =>{
    this.loadingPreviousChat = true;
    this.pageValue++;
    this.scrollToChatTop = true;
    this.getPreviousChatWithUser();
  }
  // to logout
  public logout:any = () =>{
    this.appService.logout().subscribe(
      data =>{
        if(data.status === 200){
          console.log("logout called");
          // deleting cookies
          Cookie.delete('authToken');
          Cookie.delete('receiverId');
          Cookie.delete('receiverName');
          // disconnecting the socket
          this.socketService.exitSocket();
          this.router.navigate(['/']);
        }
        else{
          this.toastr.error(data.message);
        }
      },
      error =>{
        this.toastr.error("Some error occured");
      }
    )
  }
  // unread user list
  public unreadUsers() {
    this.socketService.getUserListOfUnseenChat(this.userInfo.userId).subscribe(
      
      data => {
        console.log(data.error);
        if (data.status === 200) {
          this.unreadUserList = [];
          for (let x of data.data) {
            console.log(x.firstName);
            // read = 1,unread = 2,don't know = 0
            let temp = { name: x.firstName+' '+x.lastName,userId: x.userId, 'read': 2, 'chatting': false}
            this.unreadUserList.push(temp);
          }
          console.log(this.unreadUserList);
        }
        else{
          console.log("No data");
        }
        error =>{
          console.log("Error");
        }
      }
    );
    
  }
  // for handling the event from child component
  showUserName = (name: string) =>{
    this.toastr.success("You are chatting with "+name);
  }

}
