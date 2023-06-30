import { UserType } from "@typing/common";
import baseRtkApi from "..";
import { GetUserByIdParam } from "./typing";

const UserApi = baseRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query<UserType, GetUserByIdParam>({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: ["user"],
    }),

    getUserContact: builder.query({
      query: (params) => ({
        url: "/users/friendList",
        params,
      }),
    }),

    updateUser: builder.mutation({
      query: ({ userId, ...body }) => ({
        method: "POST",
        url: "/users/updateInformation",
        params: { userId },
        body,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export default UserApi;

export const {
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
  useLazyGetUserContactQuery,
} = UserApi;
