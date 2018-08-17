// definition of the interface 
export interface ChatMessageInterface {
    chatId?: string, //optional
    message: string,
    createdOn: Date,
    receiverId: string,
    receiverName:string,
    senderId: string,
    senderName: string
    
}