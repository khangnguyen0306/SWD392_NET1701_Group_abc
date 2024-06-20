import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BE_API_LOCAL } from '../config';
import { selectTokens } from '../slices/auth.slice';

export const postAPI = createApi({
  reducerPath: 'postManagement',
  tagTypes: ['PostList'],
  baseQuery: fetchBaseQuery({
    baseUrl: BE_API_LOCAL,
    prepareHeaders: (headers, { getState }) => {
      const token = selectTokens(getState());
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
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
    getAllPosts: builder.query({
      query: () => 'posts',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'PostList', id })),
              { type: 'PostList', id: 'LIST' },
            ]
          : [{ type: 'PostList', id: 'LIST' }],
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
        method: 'POST',
        url: 'posts',
        body,
      }),
      invalidatesTags: [{ type: 'PostList', id: 'LIST' }],
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        method: 'DELETE',
        url: `posts/${postId}`,
      }),
      invalidatesTags: [{ type: 'PostList', id: 'LIST' }],
    }),
    getPostDetail: builder.query({
      query: (postId) => ({
        url: `posts/${postId}`,
        method: 'GET',
      }),
    }),
    approvePost: builder.mutation({
      query: (postId) => ({
        method: 'PUT',
        url: `posts/updatestatuspost/${postId}`,
        body: { status: 'approved' },
      }),
      invalidatesTags: [{ type: 'PostList', id: 'PENDING_LIST' }],
    }),
    editPost: builder.mutation({
      query: ({ id, body }) => ({
        method: 'PUT',
        url: `posts/${id}`,
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'PostList', id }],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetAllPendingPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useGetPostDetailQuery,
  useApprovePostMutation,
  useEditPostMutation,
} = postAPI;
