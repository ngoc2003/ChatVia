import { ConversationType } from "@typing/common";
import baseRtkApi from "..";
import {
  CreateConversationBody,
  GetConversationListByUserIdReqest,
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
      invalidatesTags: ["conversation"],
    }),
    getConversationListByUserId: builder.query<
      ConversationType[],
      GetConversationListByUserIdReqest
    >({
      query: ({ userId }) => ({
        method: "GET",
        url: `/conversations/${userId}`,
      }),
      providesTags: ["conversation"],
    }),
  }),
});

export default ConversationApi;

export const {
  useCreateConversationMutation,
  useGetConversationListByUserIdQuery,
  useLazyGetConversationListByUserIdQuery,
} = ConversationApi;
