interface BaseType {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationType extends BaseType {
  members: string[];
  lastMessage?: {
    id: string;
    text: string;
    createdAt: Date;
  };
}

export interface MessageType extends BaseType {
  conversationId: string;
  sender: string;
  text: string;
}

export interface UserType extends BaseType {
  email: string;
  accessToken: string;
  username: string;
  avatar?: string;
}
