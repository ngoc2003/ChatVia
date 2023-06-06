import baseRtkApi from "..";

const MessageApi = baseRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessageListByConversationId: builder.query({
      query: ({ conversationId }) => ({
        url: `/messages/${conversationId}`,
      }),
      providesTags: ["message"],
    }),
    createMessage: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: "/messages",
        body,
      }),
      invalidatesTags: (result) => [{ type: "message", id: result?._id }],
    }),
  }),
});

export default MessageApi;

export const {
  useCreateMessageMutation,
  useLazyGetMessageListByConversationIdQuery,
} = MessageApi;
