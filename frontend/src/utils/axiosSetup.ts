import axios from "axios";

// NOTE: Here, we create an axios instance with the django's base URL, so we only have to type in the django's base URL just once
const axiosClient = axios.create({
  baseURL: "http://localhost:8000",
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  withCredentials: true,
});

// NOTE: This is used in the 'countryState.tsx' to send a fetch request to the backend
export const backendURL = "http://localhost:8000";

export default axiosClient;
