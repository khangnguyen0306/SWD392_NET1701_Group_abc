import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config";
import { selectTokens } from "../slices/auth.slice";

export const userAPI = createApi({
  reducerPath: "userManagement",
  tagTypes: ["UserList", "TransactionList"],
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
        url: `user/${userId}`, 
        method: "GET",
      }),
    }),
    getUserProfileForOther: builder.query({
      query: (userId) => ({
        url: `users/getuserprofile/${userId}`,
        method: "GET",
      }),
    }),
    addUser: builder.mutation({
      query: (body) => {
        const newBody = {
          address: body.address,
          username: body.userName,
          email: body.email,
          phoneNumber: body.phoneNumber,
          dob: body.dob,
          roleId: body.roleId,
          gender: body.gender,
          status: body.status,
          imgUrl: "https://static.vecteezy.com/system/resources/previews/024/983/914/original/simple-user-default-icon-free-png.png",
        }
        return {
          method: "POST",
          url: `auth/admin-create-account`,
          body: newBody,
        }
      },
      invalidatesTags: [{ type: "UserList", id: "LIST" }],
    }),
    editUser: builder.mutation({
      query: (payload) => {
        const newBody = {
          address: payload.body.address,
          userName: payload.body.fullname,
          phoneNumber: payload.body.phoneNumber,
          dob: payload.body.dob,
          gender: payload.body.gender,
          imgUrl: payload.body.imgUrl,
        }
        return {
          method: "PUT",
          url: `users/` + payload.id,
          body: newBody,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: "UserList", id: arg.id }],
    }),
    editProfile: builder.mutation({
      query: (payload) => {
        return {
          method: "PUT",
          url: `users/` + payload.id,
          body: payload.body,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: "UserList", id: arg.id }],
    }),
    updatePassword: builder.mutation({
      query: ({ userId, newPassword, oldPassword }) => {
          return {
              url: `users/updatepassword`,
              method: "PUT",
              body: { userId, newPassword, oldPassword },
          };
      },
  }),
  
    deleteUser: builder.mutation({
      query: (payload) => {
        return {
          method: "DELETE",
          url: `users/` + payload,
        };
      },
      invalidatesTags: (_res, _err, _arg) => [
        { type: "UserList", id: "LIST" },
      ],
    }),
    getAllTransaction: builder.query({
      query: () => `order/getallorder`,
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "TransactionList", id }))
          : [{ type: "TransactionList", id: "LIST" }],
    }),
    BanUser: builder.mutation({
      query: (payload) => {
        const reason = payload.reason;
        return {
          method: "PUT",
          url: `bannedaccount/banuser/${payload.id}?reason=${reason}`,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: "UserList", id: arg.id }],
    }),
    UnBanUser: builder.mutation({
      query: (payload) => {
        return {
          method: "PUT",
          url: `bannedaccount/unbanuser/${payload}`,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: "UserList", id: arg.id }],
    }),
  }),
});

export const {
  useGetAllUserQuery,
  useGetUserProfileQuery,
  useEditProfileMutation,
  useAddUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useBanUserMutation,
  useUnBanUserMutation,
  useGetUserProfileForOtherQuery,
  useGetAllTransactionQuery,
  useUpdatePasswordMutation
} = userAPI;
