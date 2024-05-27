import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../config";
// import { selectToken } from "../slices/auth.slice";

// Define a service using a base URL and expected endpoints
export const productAPI = createApi({
    reducerPath: "productManagement",
    // Tag types are used for caching and invalidation.
    tagTypes: ["ProductList"],
    baseQuery: fetchBaseQuery({
        baseUrl: API_URL,

        // prepareHeaders: (headers, { getState }) => {
        //   const token = selectToken(getState()); // Retrieve token from Redux state using selectToken selector
        //   if (token) {
        //     headers.append("Authorization", `Bearer ${token}`);
        //   }
        //   headers.append("Content-Type", "application/json");
        //   return headers;
        // },

    }),
    // baseQuery: fetchBaseQuery({ baseUrl: CLASS_API_URL }),
    endpoints: (builder) => ({
        // Supply generics for the return type (in this case `FlowerApiResponse`)
        // and the expected query argument. If there is no argument, use `void`
        // for the argument type instead.
        getAllProduct: builder.query({
            query: () => `products`,
            // `providesTags` determines which 'tag' is attached to the
            // cached data returned by the query.
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "ProductList", id }))
                    : [{ type: "ProductList", id: "LIST" }],
        }),
        getProductDetail: builder.query({
            query: (productId) => ({
                url: `products/${productId}`, // Use template literal for security
                method: "GET",
            }),
        }),
        getAllCategories: builder.query({
            query: () => `categories`,
            // `providesTags` determines which 'tag' is attached to the
            // cached data returned by the query.
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "CategoriesList", id }))
                    : [{ type: "CategoriesList", id: "LIST" }],
        }),

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

        // editClass: builder.mutation({
        //   query: (payload) => {
        //     return {
        //       method: "PUT",
        //       url: `viewclass/` + payload.id,
        //       body: payload.body,
        //     };
        //   },
        //   invalidatesTags: (res, err, arg) => [{ type: "ClassList", id: arg.id }],
        // }),
        // deleteClass: builder.mutation({
        //   query: (payload) => {
        //     return {
        //       method: "DELETE",
        //       url: `viewclass/` + payload.id,
        //     };
        //   },
        //   invalidatesTags: (_res, _err, _arg) => [
        //     { type: "ClassList", id: "LIST" },
        //   ],
        // }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
// Hooks are auto-generated by RTK-Query
export const {
    useGetAllProductQuery,
    useGetAllCategoriesQuery,
    useGetProductDetailQuery
    //   useDuplicateClassMutation,
    //   useCreateClassMutation,
    //   useGetClassByIdQuery,
    //   useEditClassMutation,
    //   useDeleteClassMutation,
} = productAPI;
