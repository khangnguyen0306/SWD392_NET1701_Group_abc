import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config";
import { selectTokens } from "../slices/auth.slice";
// import { selectToken } from "../slices/auth.slice";

// Define a service using a base URL and expected endpoints
export const productAPI = createApi({
    reducerPath: "productManagement",
    // Tag types are used for caching and invalidation.
    tagTypes: ["ProductList,CategoriesList"],
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
        getAllProduct: builder.query({
            query: () => `product/getallvalid`,
            // `providesTags` determines which 'tag' is attached to the
            // cached data returned by the query.
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "ProductList", id }))
                    : [{ type: "ProductList", id: "LIST" }],
        }),
        getAllCategoriesForCProduct: builder.query({
            query: () => `category/getallcategory`,
            // `providesTags` determines which 'tag' is attached to the
            // cached data returned by the query.
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "CategoriesList", id }))
                    : [{ type: "CategoriesList", id: "LIST" }],
        }),
        getAllSubCategories: builder.query({
            query: (payload) => `subcategory/getsubcategorybycategoryid/${payload}`,
            // `providesTags` determines which 'tag' is attached to the
            // cached data returned by the query.
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "CategoriesList", id }))
                    : [{ type: "CategoriesList", id: "LIST" }],
        }),
        getAllProductForExchange: builder.query({
            query: () => `product/getallforexchangebyuserid`,
            // `providesTags` determines which 'tag' is attached to the
            // cached data returned by the query.
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "ProductList", id }))
                    : [{ type: "ProductList", id: "LIST" }],
        }),
        getProductDetail: builder.query({
            query: (productId) => ({
                url: `product/getproductdetails/${productId}`, // Use template literal for security
                method: "GET",
            }),
        }),
        getAllCategories: builder.query({
            query: () => `category/getallcategorywithsubcategory`,
            // `providesTags` determines which 'tag' is attached to the
            // cached data returned by the query.
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "CategoriesList", id }))
                    : [{ type: "CategoriesList", id: "LIST" }],
        }),
        getAllProductByUserId: builder.query({
            query: () => `product/getproductbyuserid`,
            // `providesTags` determines which 'tag' is attached to the
            // cached data returned by the query.
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "ProductList", id }))
                    : [{ type: "ProductList", id: "LIST" }],
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

        createProduct: builder.mutation({
          query: (body) => {
            return {
              method: "POST",
              url: `product/addproduct`,
              body,
            };
          },
          invalidatesTags: [{ type: "ProductList", id: "LIST" }],
        }),
        createProductForExchange: builder.mutation({
          query: (body) => {
            return {
              method: "POST",
              url: `product/addproductforexchange`,
              body,
            };
          },
          invalidatesTags: [{ type: "ProductList", id: "LIST" }],
        }),

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
        deleteProduct: builder.mutation({
          query: (payload) => {
            return {
              method: "PUT",
              url: `product/delete/` + payload,
            };
          },
          invalidatesTags: (_res, _err, _arg) => [
            { type: "ProductList", id: "LIST" },
          ],
        }),
    }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
// Hooks are auto-generated by RTK-Query
export const {
    useGetAllProductQuery,
    useGetAllCategoriesQuery,
    useGetProductDetailQuery,
    useGetAllProductForExchangeQuery,
    useGetAllCategoriesForCProductQuery,
    useGetAllSubCategoriesQuery,
    useCreateProductMutation,
    useGetAllProductByUserIdQuery,
    useDeleteProductMutation,
    useCreateProductForExchangeMutation
    //   useDuplicateClassMutation,
    //   useCreateClassMutation,
    //   useGetClassByIdQuery,
    //   useEditClassMutation,
    //   useDeleteClassMutation,
} = productAPI;
