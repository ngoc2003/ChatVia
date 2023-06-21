export interface GetMessageListByConversationIdRequest {
  conversationId: string;
  userId: string;
}

export interface CreateMessageBody {
  sender: string;
  text: string;
  conversationId: string;
}
