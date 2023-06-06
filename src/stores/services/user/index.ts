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
  }),
});

export default UserApi;

export const { useLazyGetUserByIdQuery } = UserApi;
