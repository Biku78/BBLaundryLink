import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api/',
  }),
  endpoints: (builder) => ({
    getHealth: builder.query({
      query: () => 'health',
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

export const { useGetHealthQuery, useLoginMutation } = api
