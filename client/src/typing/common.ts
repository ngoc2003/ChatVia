interface BaseType {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum GenderType {
  Male = "Male",
  Female = "Female",
}

export enum ConversationStatus {
  Pending = "pending",
  Accept = "accept",
}
interface DeletedByType {
  userId: string;
  deletedAt: Date;
}

export interface ConversationType extends BaseType {
  members: string[];
  lastMessage?: {
    id: string;
    text: string;
    createdAt: Date;
  };
  deletedBy?: DeletedByType[];
  emoji: string;
  status: ConversationStatus;
  createdBy: string;
  blockedByUser?: string;
}

export interface MessageType extends BaseType {
  conversationId: string;
  sender: string;
  text: string;
  deletedBy?: DeletedByType[];
  isPin: boolean;
}

export interface UserType extends BaseType {
  email: string;
  accessToken: string;
  username: string;
  avatar?: string;
  facebookLink?: string;
  gender?: GenderType;
  location?: string;
  description?: string;
}
