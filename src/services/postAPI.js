import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BE_API_LOCAL } from '../config';
import { selectTokens } from '../slices/auth.slice';

export const postAPI = createApi({
    reducerPath: "postManagement",
    tagTypes: ["PostList", "ExchangeList"],
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
        responseHandler: async (response) => {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json();
            } else {
                return { data: await response.text() };
            }
        },
    }),
    endpoints: (builder) => ({
        getAllPost: builder.query({
            query: () => `posts`,
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "PostList", id }))
                    : [{ type: "PostList", id: "LIST" }],
        }),
        getAllPendingPosts: builder.query({
            query: () => 'posts/getallpendingpost',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'PostList', id })),
                        { type: 'PostList', id: 'PENDING_LIST' },
                    ]
                    : [{ type: 'PostList', id: 'PENDING_LIST' }],
        }),

        createPost: builder.mutation({
            query: (body) => ({
                method: "POST",
                url: `posts`,
                body,
            }),
            invalidatesTags: [{ type: "PostList", id: "LIST" }],
        }),
        createExchange: builder.mutation({
            query: (body) => ({
                method: "POST",
                url: `exchanged`,
                body,
            }),
            invalidatesTags: [{ type: "ExchangeList", id: "LIST" }],
        }),
        deletePost: builder.mutation({
            query: (postId) => ({
                method: "DELETE",
                url: `posts/${postId}`,
            }),
            invalidatesTags: [{ type: "PostList", id: "LIST" }],
        }),
        getPostDetail: builder.query({
            query: (postId) => ({
                url: `posts/${postId}`, // Use template literal for security
                method: "GET",
            }),
        }),
        getAllPostByUser: builder.query({
            query: () => `posts/getallbyuserid`,
            // `providesTags` determines which 'tag' is attached to the
            // cached data returned by the query.
            providesTags: (result) =>
                result
                    ? result.map(({ id }) => ({ type: "PostList", id }))
                    : [{ type: "PostList", id: "LIST" }],
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

        createPost: builder.mutation({
            query: (body) => {
                return {
                    method: "POST",
                    url: `posts`,
                    body,
                };
            },
            invalidatesTags: [{ type: "PostList", id: "LIST" }],
        }),

        editPost: builder.mutation({
            query: (payload) => {
                return {
                    method: "PUT",
                    url: `posts/` + payload.id,
                    body: payload.body,
                };
            },
            invalidatesTags: (res, err, arg) => [{ type: "PostList", id: arg.id }],
        }),
        deletePost: builder.mutation({
            query: (payload) => {
                return {
                    method: "DELETE",
                    url: `posts/` + payload,
                };
            },
            invalidatesTags: (_res, _err, _arg) => [
                { type: "PostList", id: "LIST" },
            ],
        }),
        getAllPendingPosts: builder.query({
            query: () => 'posts/getallpendingpost',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'PostList', id })),
                        { type: 'PostList', id: 'PENDING_LIST' },
                    ]
                    : [{ type: 'PostList', id: 'PENDING_LIST' }],
        }),
        approvePost: builder.mutation({
            query: (payload) => ({
                method: 'PUT',
                url: `posts/updatestatuspost/${payload.id}?newStatus=${payload.newStatus}`,
               
            }),
        }),

    }),
});

export const {
    useGetAllPostQuery,
    useDeletePostMutation,
    useCreatePostMutation,
    useGetPostDetailQuery,
    useEditPostMutation,
    useCreateExchangeMutation,
    useGetAllPendingPostsQuery,
    useApprovePostMutation,
    useGetAllPostByUserQuery
    // useGetAllCategoriesQuery,
    // useGetProductDetailQuery
    //   useDuplicateClassMutation,
    //   useCreateClassMutation,
    //   useGetClassByIdQuery,
    //   useEditClassMutation,
    //   useDeleteClassMutation,
} = postAPI;
