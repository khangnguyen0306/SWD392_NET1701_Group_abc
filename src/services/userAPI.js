import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config";
import { selectTokens } from "../slices/auth.slice";

export const userAPI = createApi({
  reducerPath: "userManagement",
  tagTypes: ["UserList"],
  baseQuery: fetchBaseQuery({
    baseUrl: BE_API_LOCAL,
    prepareHeaders: (headers, { getState }) => {
      const token = selectTokens(getState());
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }
      headers.append("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllUser: builder.query({
      query: () => `users`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "UserList", id }))
          : [{ type: "UserList", id: "LIST" }],
    }),
    getUserProfile: builder.query({
      query: (userId) => ({
        url: `users/${userId}`, // Ensure this matches your backend's endpoint
        method: "GET",
      }),
    }),
    addUser: builder.mutation({
      query: (body) => ({
        method: "POST",
        url: `users`,
        body,
      }),
      invalidatesTags: [{ type: "UserList", id: "LIST" }],
    }),
    editUser: builder.mutation({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `users/${id}`,
        body: {
          address: body.address,
          phoneNumber: body.phoneNumber,
          dob: body.DOB,
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "UserList", id }],
    }),
    BanUser: builder.mutation({
      query: (id) => ({
        method: "PUT",
        url: `users/${id}`,
        body: { status: false },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "UserList", id }],
    }),
    editProfile: builder.mutation({
      query: ({ id, body }) => ({
        method: "PUT",
        url: `users/${id}`,
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "UserList", id }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `users/${id}`,
      }),
      invalidatesTags: [{ type: "UserList", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetUserProfileQuery,
  useAddUserMutation,
  useEditUserMutation,
  useEditProfileMutation,
  useDeleteUserMutation,
  useBanUserMutation,
} = userAPI;
