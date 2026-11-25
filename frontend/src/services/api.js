import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Relative requests use Vite's /api proxy in development.
// In production, serve /api through your reverse proxy or set VITE_API_BASE_URL.
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
