import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().app.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Campaign', 'Pledge', 'Admin', 'Config', 'AdminProfile'],
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: () => '/campaigns',
      providesTags: ['Campaign']
    }),
    createPledge: builder.mutation({
      query: (data) => ({
        url: '/pledges/create',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Pledge', 'Admin']
    }),
    initDonation: builder.mutation({
      query: (data) => ({
        url: '/pledges/donate/init',
        method: 'POST',
        body: data
      })
    }),
    completePledge: builder.mutation({
      query: (data) => ({
        url: '/pledges/complete',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Pledge', 'Admin']
    }),
    verifyCertificate: builder.query({
      query: (certId) => `/pledges/verify/${certId}`
    }),
    
    // Admin Auth
    adminLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      })
    }),

    // Protected Admin Routes
    getAdminStats: builder.query({
      query: () => '/admin/stats',
      providesTags: ['Admin']
    }),
    getAdminPledges: builder.query({
      query: () => ({
        url: '/admin/pledges',
        method: 'GET',
      }),
      providesTags: ['Pledge']
    }),
    
    // Config Endpoints
    getConfig: builder.query({
      query: () => ({
        url: '/config',
        method: 'GET',
      }),
      providesTags: ['Config']
    }),
    updateConfig: builder.mutation({
      query: (data) => ({
        url: '/admin/config',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Config']
    }),

    // Admin Profile
    getAdminProfile: builder.query({
      query: () => '/admin/profile',
      providesTags: ['AdminProfile']
    }),
    updateAdminProfile: builder.mutation({
      query: (data) => ({
        url: '/admin/profile',
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['AdminProfile']
    }),
  })
});

export const {
  useGetCampaignsQuery,
  useCreatePledgeMutation,
  useInitDonationMutation,
  useCompletePledgeMutation,
  useVerifyCertificateQuery,
  useAdminLoginMutation,
  useGetAdminStatsQuery,
  useGetAdminPledgesQuery,
  useGetConfigQuery,
  useUpdateConfigMutation,
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation
} = apiSlice;
