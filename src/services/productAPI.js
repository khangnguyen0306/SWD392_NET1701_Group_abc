import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BE_API_LOCAL } from "../config";
import { selectTokens } from "../slices/auth.slice";
// import { selectToken } from "../slices/auth.slice";

// Define a service using a base URL and expected endpoints
export const productAPI = createApi({
  reducerPath: "productManagement",
  // Tag types are used for caching and invalidation.
  tagTypes: ["ProductList,CategoriesList,ProductExchangeList", "SubcategoryList"],
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

    getSubCategoryById: builder.query({
      query: (subCId) => ({
        url: `subcategory/getsubcategorybyid/${subCId}`, // Use template literal for security
        method: "GET",
      }),
    }),

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
      invalidatesTags: [{ type: "ProductExchangeList", id: "LIST" }],
    }),
    createSubcategory: builder.mutation({
      query: (body) => {
        return {
          method: "POST",
          url: `subcategory/addsubcategory`,
          body,
        };
      },
      invalidatesTags: [{ type: "SubcategoryList", id: "LIST" }],
    }),

    editSubcategory: builder.mutation({
      query: (payload) => {
        return {
          method: "PUT",
          url: `subcategory/updatesubcategory/` + payload.id,
          body: payload.body,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: "SubcategoryList", id: arg.id }],
    }),
    deleteSubcategory: builder.mutation({
      query: (payload) => {
        return {
          method: "PUT",
          url: `subcategory/deletesubcategory/` + payload,
        };
      },
      invalidatesTags: (_res, _err, _arg) => [
        { type: "SubcategoryList", id: "LIST" },
      ],
    }),

    editProduct: builder.mutation({
      query: (payload) => {
        return {
          method: "PUT",
          url: `product/updateproduct/` + payload.id,
          body: payload.body,
        };
      },
      invalidatesTags: (res, err, arg) => [{ type: "ProductList", id: arg.id }],
    }),
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
  useCreateProductForExchangeMutation,
  useEditProductMutation,
  useCreateSubcategoryMutation,
  useEditSubcategoryMutation,
  useDeleteSubcategoryMutation,
  useGetSubCategoryByIdQuery
  //   useDuplicateClassMutation,
  //   useCreateClassMutation,
  //   useGetClassByIdQuery,
  //   useEditClassMutation,
  //   useDeleteClassMutation,
} = productAPI;
