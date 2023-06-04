import baseRtkApi from '..';
import { AuthResponse } from '../../../typing/auth';
import { GetUserHeader } from '../typing';

export const requestApi = baseRtkApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<AuthResponse, GetUserHeader>({
      query: (headers) => ({
        url: 'auth/me',
        method: 'POST',
        headers,
      }),
      providesTags: ['user'],
    }),
  }),
});

export default requestApi;

export const { useGetUserQuery, useLazyGetUserQuery } = requestApi;
