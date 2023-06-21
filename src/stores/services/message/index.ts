import { MessageType } from "@typing/common";
import baseRtkApi from "..";
import {
  CreateMessageBody,
  GetMessageListByConversationIdRequest,
} from "./typing";

const MessageApi = baseRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessageListByConversationId: builder.query<
      MessageType[],
      GetMessageListByConversationIdRequest
    >({
      query: ({ conversationId, userId }) => ({
        url: `/messages/${conversationId}`,
        params: { userId },
      }),
      providesTags: ["message"],
    }),
    createMessage: builder.mutation<MessageType, CreateMessageBody>({
      query: (body) => ({
        method: "POST",
        url: "/messages",
        body,
      }),
      invalidatesTags: (result) => [{ type: "message", id: result?._id }],
    }),
    deleteMessage: builder.mutation({
      query: ({ messageId, userId }) => ({
        method: "POST",
        url: `/messages/delete/${messageId}`,
        body: { userId },
      }),
      invalidatesTags: (result) => [{ type: "message", id: result?._id }],
    }),
  }),
});

export default MessageApi;

export const {
  useCreateMessageMutation,
  useLazyGetMessageListByConversationIdQuery,
  useDeleteMessageMutation,
} = MessageApi;
