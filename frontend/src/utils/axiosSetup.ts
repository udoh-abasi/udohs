import axios from "axios";

// NOTE: Here, we create an axios instance with the django's base URL, so we only have to type in the django's base URL just once
const axiosClient = axios.create({
  baseURL: "http://localhost:8000",
  // baseURL: "https://16.171.33.147",
  // baseURL: "https://udohsplatforms.udohabasi.com",
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  withCredentials: true,
});

// Add a request interceptor to log headers. I added this to see if csrf token is sent with my request

// axiosClient.interceptors.request.use(
//   (config) => {
//     console.log("Request Headers:", config.headers);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default axiosClient;
