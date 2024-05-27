const publicRuntimeConfig = {
  API_URL: import.meta.env.VITE_API_URL,
  USER_API: import.meta.env.USER_MOCK_API_URL
  // create fake token here
};

export const { API_URL,USER_API } = publicRuntimeConfig;
export default publicRuntimeConfig;
