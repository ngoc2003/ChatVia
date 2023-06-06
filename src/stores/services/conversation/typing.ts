export interface CreateConversationBody {
  senderId: string;
  receiverEmail: string;
}

export interface GetConversationListByUserIdReqest {
  userId: string;
}
