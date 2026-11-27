import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    getHealth: builder.query({
      query: () => 'health',
    }),
    register: builder.mutation({
      query: (details) => ({ url: 'register', method: 'POST', body: details }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
})

export const { useGetHealthQuery, useLoginMutation, useRegisterMutation } = api
