import baseRtkApi from "..";

const UserApi = baseRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query({
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
