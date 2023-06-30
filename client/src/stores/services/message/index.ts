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
      query: ({ conversationId, ...params }) => ({
        url: `/messages/${conversationId}`,
        params,
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
    pinMessage: builder.mutation({
      query: ({ messageId }) => ({
        method: "POST",
        url: `/messages/pin/${messageId}`,
      }),
      invalidatesTags: (_, __, par) => [
        { type: "message", id: par?.messageId },
      ],
    }),
    unPinMessage: builder.mutation({
      query: ({ messageId }) => ({
        method: "POST",
        url: `/messages/unpin/${messageId}`,
      }),
      invalidatesTags: (_, __, par) => [
        { type: "message", id: par?.messageId },
      ],
    }),
  }),
});

export default MessageApi;

export const {
  usePinMessageMutation,
  useUnPinMessageMutation,
  useCreateMessageMutation,
  useLazyGetMessageListByConversationIdQuery,
  useGetMessageListByConversationIdQuery,
  useDeleteMessageMutation,
} = MessageApi;
