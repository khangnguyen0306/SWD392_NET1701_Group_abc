// chatAPI.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const chatAPI = createApi({
  reducerPath: 'chatAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }), 
  endpoints: (builder) => ({
    getChatOverviews: builder.query({
      query: () => 'chat/getChatOverviews',
      transformResponse: () => [
        { id: 1, participant: 'John Doe', lastMessage: 'Hey, how are you?' },
        { id: 2, participant: 'Jane Smith', lastMessage: 'Can we meet tomorrow?' },
      ],
    }),
    getMessages: builder.query({
      query: (chatId) => `chat/getMessages/${chatId}`,
      transformResponse: (response, meta, arg) => {
        const messages = {
          1: [
            { sender: 'John Doe', message: 'Hey, how are you?' },
            { sender: 'You', message: 'I am good, thanks!' },
          ],
          2: [
            { sender: 'Jane Smith', message: 'Can we meet tomorrow?' },
            { sender: 'You', message: 'Sure, what time?' },
          ],
        };
        return messages[arg];
      },
    }),
    sendMessage: builder.mutation({
      query: ({ chatId, message }) => ({
        url: `chat/sendMessage`,
        method: 'POST',
        body: { chatId, message },
      }),
    }),
  }),
});

export const { useGetChatOverviewsQuery, useGetMessagesQuery, useSendMessageMutation } = chatAPI;
