export interface GetMessageListByConversationIdRequest {
  conversationId: string;
  userId: string;
  isPin?: boolean;
}

export interface CreateMessageBody {
  sender: string;
  text: string;
  conversationId: string;
}
