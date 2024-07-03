import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { USER_API } from "../config";
import { BE_API_LOCAL } from "../config";
import { selectTokens } from "../slices/auth.slice";
// import { selectToken } from "../slices/auth.slice";

// Define a service using a base URL and expected endpoints
export const userAPI = createApi({
  reducerPath: "userManagement",
  // Tag types are used for caching and invalidation.
  tagTypes: ["UserList"],
  baseQuery: fetchBaseQuery({
    baseUrl: BE_API_LOCAL,

    prepareHeaders: (headers, { getState }) => {
      const token = selectTokens(getState()); // Retrieve token from Redux state using selectToken selector
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }
      headers.append("Content-Type", "application/json");
      return headers;
    },

  }),
  // baseQuery: fetchBaseQuery({ baseUrl: CLASS_API_URL }),
  endpoints: (builder) => ({
    // Supply generics for the return type (in this case `FlowerApiResponse`)
    // and the expected query argument. If there is no argument, use `void`
    // for the argument type instead.
    getAllUser: builder.query({
      query: () => `users`,
      // `providesTags` determines which 'tag' is attached to the
      // cached data returned by the query.
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "UserList", id }))
          : [{ type: "UserList", id: "LIST" }],
    }),
    getUserProfile: builder.query({
      query: (userId) => ({
        url: `user/${userId}`, // Use template literal for security
        method: "GET",
      }),
    }),

    addUser: builder.mutation({
      query: (body) => {
        return {
          method: "POST",
          url: `users`,
          body: body,
        }
      },
      invalidatesTags: [{ type: " UserList ", id: " LIST " }],
    }),
    editUser: builder.mutation({
      query: (payload) => {
        console.log(payload)
        const newBody = {
          address: payload.body.address,
          userName: payload.fullname,
          // email: payload.email,
          phoneNumber: payload.body.phoneNumber,
          dob: payload.body.DOB,
          // created_by: " string ",
          // modified_by: " string ",
          gender: payload.gender,
          // is_active: payload.Status,
          imgUrl: payload.imgUrl,
        }
        return {
          method: "PUT",
          url: `users/` + payload.id,
          body: newBody,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: " UserList ", id: arg.id }],
    }),
    // getAllCategories: builder.query({
    //     query: () => `categories`,
    //     // `providesTags` determines which 'tag' is attached to the
    //     // cached data returned by the query.
    //     providesTags: (result) =>
    //         result
    //             ? result.map(({ id }) => ({ type: "CategoriesList", id }))
    //             : [{ type: "CategoriesList", id: "LIST" }],
    // }),

    // getClassById: builder.query({
    //   query: (classId) => ({
    //     url: `viewclass/${classId}`, // Use template literal for security
    //     method: "GET",
    //   }),
    //   providesTags: (result) => {
    //     if (Array.isArray(result)) {
    //       // Handle array case (multiple classes)
    //       return result.map(({ id }) => ({ type: "ClassList", id }));
    //     } else if (result && result.id) {
    //       // Handle object case (single class)
    //       return [{ type: "ClassList", id: result.id }];
    //     } else {
    //       // Handle no data case (optional)
    //       return [];
    //     }
    //   },
    // }),

    // duplicateClass: builder.mutation({
    //   query: (body) => {
    //     return {
    //       method: "POST",
    //       url: `viewclass`,
    //       body,
    //     };
    //   },
    //   invalidatesTags: [{ type: "ClassList", id: "LIST" }],
    // }),

    // createClass: builder.mutation({
    //   query: (body) => {
    //     return {
    //       method: "POST",
    //       url: `class/create`,
    //       body,
    //     };
    //   },
    //   invalidatesTags: [{ type: "ClassList", id: "LIST" }],
    // }),

    BanUser: builder.mutation({

      query: (payload) => {
        const status = false;
        return {
          method: "PUT",
          url: `users/` + payload,
          body: { status: status },
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
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
// Hooks are auto-generated by RTK-Query
export const {
  useGetAllUserQuery,
  useGetUserProfileQuery,
  useEditProfileMutation,
  useAddUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useBanUserMutation
  // useGetAllProductQuery,
  // useGetAllCategoriesQuery,
  // useGetProductDetailQuery

} = userAPI;
