export interface GetMessageListByConversationIdRequest {
  conversationId: string;
}

export interface CreateMessageBody {
  sender: string;
  text: string;
  conversationId: string;
}
