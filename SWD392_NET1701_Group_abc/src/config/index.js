const publicRuntimeConfig = {
  API_URL: import.meta.env.VITE_API_URL,
  USER_API: import.meta.env.VITE_USER_MOCK_API_URL,
  BE_API_LOCAL: import.meta.env.VITE_BE_API,
  CLIENT_ID_PAYPAL: import.meta.env.CLIENT_ID_PAYPAL,

};

export const { API_URL, USER_API, BE_API_LOCAL,CLIENT_ID_PAYPAL} = publicRuntimeConfig;
export default publicRuntimeConfig;
