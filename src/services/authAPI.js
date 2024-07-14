import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config";
///change APi URL 


export const authApi = createApi({
    reducerPath: "authManagement",
    // baseQuery: fetchBaseQuery({baseUrl:"https://localhost:7293/api/"}),                
    baseQuery: fetchBaseQuery({ baseUrl: BE_API_LOCAL }),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: ({ email, password }) => ({
                url: `auth/login`,
                method: "POST",
                body: { email, password },
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
            Gender: body.Gender,
            ImgURL:"https://static.vecteezy.com/system/resources/previews/024/983/914/original/simple-user-default-icon-free-png.png"
          }
          return {
            method: "POST",
            url: `auth/register`,
            body: users,
          }
        },
        invalidatesTags: [{ type: " UserList ", id: " LIST " }],
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
        sendResetEmail: builder.mutation({
          query: (email) => ({
              url: `auth/forgot-password`,
              method: "PUT",
              body: { email },
          }),
        }),
    }),
});

export const {
    useLoginUserMutation,
    useRegisterUserMutation,
    useSendResetEmailMutation,
    //   useChangePasswordByEmailMutation,
    //   useVerifyMailMutation,
    //   useVerifyOtpMutation,
    //   useRefreshTokenMutation,
} = authApi;
