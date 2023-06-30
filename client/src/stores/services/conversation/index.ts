import { ConversationType } from "@typing/common";
import baseRtkApi from "..";
import {
  CreateConversationBody,
  GetConversationListByUserIdReqest,
  GetImageParams,
  ImageWithUserInformation,
  UpdateConversationRequest,
} from "./typing";

const ConversationApi = baseRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    createConversation: builder.mutation<
      ConversationType,
      CreateConversationBody
    >({
      query: (body) => ({
        method: "POST",
        url: "/conversations",
        body,
      }),
      invalidatesTags: (result) => [{ type: "conversation", id: result?._id }],
    }),
    getConversationListByUserId: builder.query<
      ConversationType[],
      GetConversationListByUserIdReqest
    >({
      query: ({ userId, query }) => ({
        method: "GET",
        url: `/conversations/${userId}`,
        params: query,
      }),
      providesTags: ["conversation"],
    }),
    deleteConversation: builder.mutation({
      query: ({ conversationId, userId }) => ({
        method: "POST",
        url: `/conversations/delete/${conversationId}`,
        body: { userId },
      }),
      invalidatesTags: (result) => [{ type: "conversation", id: result?._id }],
    }),
    getImage: builder.query<ImageWithUserInformation[], GetImageParams>({
      query: ({ conversationId }) => ({
        method: "GET",
        url: `/conversations/image`,
        params: { conversationId },
      }),
      providesTags: ["conversation", "image"],
    }),
    updateConversation: builder.mutation<void, UpdateConversationRequest>({
      query: ({ conversationId, ...body }) => ({
        method: "POST",
        url: `/conversations/update/${conversationId}`,
        body,
      }),
      invalidatesTags: (_, __, par) => [
        { type: "conversation", id: par.conversationId },
      ],
    }),
    blockConversation: builder.mutation({
      query: ({ conversationId, userId }) => ({
        method: "POST",
        url: `/conversations/block/${conversationId}`,
        body: { userId },
      }),
      invalidatesTags: (_, __, par) => [
        { type: "conversation", id: par.conversationId },
      ],
    }),
    unBlockConversation: builder.mutation({
      query: ({ conversationId }) => ({
        method: "POST",
        url: `/conversations/unblock/${conversationId}`,
      }),
      invalidatesTags: (_, __, par) => [
        { type: "conversation", id: par.conversationId },
      ],
    }),
  }),
});

export default ConversationApi;

export const {
  useGetImageQuery,
  useBlockConversationMutation,
  useUpdateConversationMutation,
  useDeleteConversationMutation,
  useCreateConversationMutation,
  useUnBlockConversationMutation,
  useGetConversationListByUserIdQuery,
  useLazyGetConversationListByUserIdQuery,
} = ConversationApi;
