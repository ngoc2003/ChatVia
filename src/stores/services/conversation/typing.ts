export interface CreateConversationBody {
  senderId: string;
  receiverEmail: string;
}

export interface GetConversationListByUserIdReqest {
  userId: string;
  query: {
    searchValue: string;
  };
}

export interface ImageWithUserInformation {
  _id: string;
  text: string;
  conversationId: string;
  createdAt: Date;
  senderInfo: {
    _id: string;
    username: string;
  };
}

export interface GetImageParams {
  conversationId: string;
}
