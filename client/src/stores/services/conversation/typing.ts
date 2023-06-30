import { ConversationStatus } from "@typing/common";

export interface CreateConversationBody {
  senderId: string;
  receiverEmail: string;
}

export interface GetConversationListByUserIdReqest {
  userId: string;
  query: {
    searchValue?: string;
    status?: ConversationStatus;
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

export interface UpdateConversationRequest {
  conversationId: string;
  emoji?: string;
  status?: ConversationStatus;
}
