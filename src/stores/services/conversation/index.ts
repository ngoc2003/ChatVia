import baseRtkApi from "..";

const ConversationApi = baseRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    createConversation: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/conversations",
        body,
      }),
      invalidatesTags: ["conversation"],
    }),
    getConversationListByUserId: builder.query({
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
