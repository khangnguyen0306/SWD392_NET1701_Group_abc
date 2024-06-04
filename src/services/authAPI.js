import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config";
///change APi URL 


export const authApi = createApi({
    reducerPath: "authManagement",
    // baseQuery: fetchBaseQuery({baseUrl:"https://localhost:7293/api/"}),                        //chua fix
    baseQuery: fetchBaseQuery({ baseUrl: BE_API_LOCAL }),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: ({ username, password }) => ({
                url: `auth/login`,
                method: "POST",
                body: { username, password },
            }),
        }),
        
    registerUser: builder.mutation({
        query: (body) => {
          const users = {
            address: body.address,
            password: body.password,
            username: body.username,
            email: body.email,
            phoneNumber: body.phoneNumber,
            dob: body.dob,
            // retype_password: body.retypePassword,
            // role_id: body.UserType,
            // created_by: "string",
            // modified_by: "string",
            // gender: body.gender
          }
          return {
            method: "POST",
            url: `auth/register`,
            body: users,
          }
        },
        // invalidatesTags: [{ type: " UserList ", id: " LIST " }],
      }),
  
        // verifyOtp: builder.mutation({
        //   query: ({ email, otpCode }) => {
        //     return {
        //       method: "POST",
        //       url: `forgotPassword/verifyOtp/${email}`,
        //       body: { otp: otpCode },
        //     };
        //   },
        // }),
        // verifyMail: builder.mutation({
        //   query: ({ email }) => {
        //     return {
        //       method: "POST",
        //       url: `forgotPassword/verifyMail/${email}`,
        //       // body: { password: newPassword, retypePassword: newPassword },
        //     };
        //   },
        // }),
        // changePasswordByEmail: builder.mutation({
        //   query: ({ email, newPassword }) => {
        //     return {
        //       method: "POST",
        //       url: `forgotPassword/changePassword/${email}`,
        //       body: { password: newPassword, retypePassword: newPassword },
        //     };
        //   },
        // }),
        // refreshToken: builder.mutation({
        //   query: ({ refreshToken }) => ({
        //     url: `users/refresh-token`,
        //     method: "POST",
        //     body: { refreshToken: refreshToken }, // pass the refresh token in the body
        //   }),
        // }),
    }),
});

export const {
    useLoginUserMutation,
    useRegisterUserMutation
    //   useChangePasswordByEmailMutation,
    //   useVerifyMailMutation,
    //   useVerifyOtpMutation,
    //   useRefreshTokenMutation,
} = authApi;
