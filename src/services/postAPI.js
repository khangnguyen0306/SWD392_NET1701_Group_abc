import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BE_API_LOCAL } from '../config';
import { selectTokens } from '../slices/auth.slice';

export const postAPI = createApi({
    reducerPath: "postManagement",
    tagTypes: ["PostList", "ExchangeList", "ReportList", "CommentList"],
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
        getPostComment: builder.query({
            query: (postId) => ({
                url: `comment/getcommentbypost/${postId}`, // Use template literal for security
                method: "GET",
            }),
        }),
        getCommentById: builder.query({
            query: (payload) => ({
                url: `/comment/getcommentbyid${payload}`, // Use template literal for security
                method: "GET",
            }),
        }),
        createComment: builder.mutation({
            query: (payload) => {
                return {
                    method: "POST",
                    url: `comment?postId=${payload.id}`,
                    body: payload.body,
                };
            },
            invalidatesTags: [{ type: "CommentList", id: "LIST" }],
        }),
        editComment: builder.mutation({
            query: (payload) => {
                return {
                    method: "PUT",
                    url: `comment/` + payload.id,
                    body: payload.body,
                };
            },
            invalidatesTags: (res, err, arg) => [{ type: "CommentList", id: arg.id }],
        }),
        deleteComment: builder.mutation({
            query: (payload) => ({
                method: 'DELETE',
                url: `comment/` + payload,

            }),
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
        getReport: builder.query({
            query: () => 'report/getallreport',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'ReportList', id })),
                        { type: 'ReportList', id: 'PENDING_LIST' },
                    ]
                    : [{ type: 'ReportList', id: 'PENDING_LIST' }],
        }),
        createReport: builder.mutation({
            query: (payload) => {
                return {
                    method: "POST",
                    url: `report/addreport`,
                    body: { postId: payload.id, description: payload.body },
                };
            },
            invalidatesTags: [{ type: "ReportList", id: "LIST" }],
        }),

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
        deletePostStaff: builder.mutation({
            query: (payload) => ({
                method: 'PUT',
                url: `posts/updatestatuspost/${payload.id}?newStatus=${payload.newStatus}`,

            }),
        }),
        deleteReportStaff: builder.mutation({
            query: (payload) => ({
                method: 'PUT',
                url: `report/deletereport/${payload}`,

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
    useGetAllPostByUserQuery,
    useCreateReportMutation,
    useGetReportQuery,
    useDeletePostStaffMutation,
    useDeleteReportStaffMutation,
    useGetPostCommentQuery,
    useCreateCommentMutation,
    useGetCommentByIdQuery,
    useEditCommentMutation,
    useDeleteCommentMutation
    // useGetAllCategoriesQuery,
    // useGetProductDetailQuery
    //   useDuplicateClassMutation,
    //   useCreateClassMutation,
    //   useGetClassByIdQuery,
    //   useEditClassMutation,
    //   useDeleteClassMutation,
} = postAPI;
