import { ConversationType } from "@typing/common";
import baseRtkApi from "..";
import {
  CreateConversationBody,
  GetConversationListByUserIdReqest,
  GetImageParams,
  ImageWithUserInformation,
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
  }),
});

export default ConversationApi;

export const {
  useGetImageQuery,
  useDeleteConversationMutation,
  useCreateConversationMutation,
  useGetConversationListByUserIdQuery,
  useLazyGetConversationListByUserIdQuery,
} = ConversationApi;
