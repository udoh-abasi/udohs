import axios from "axios";

// NOTE: This is used in the 'countryState.tsx' to send a fetch request to the backend
export const backendURL = "https://udohs-backend.vercel.app";

// The URL where the profile images can be gotten from
export const profilePictureURL = `${backendURL}/image/profileImages`;

// The URL where the product images can be gotten from
export const productImagesURL = `${backendURL}/image/productPhotos`;

// NOTE: Here, we create an axios instance with the django's base URL, so we only have to type in the django's base URL just once
const axiosClient = axios.create({
  baseURL: backendURL,
  xsrfCookieName: "csrftoken",
  xsrfHeaderName: "X-CSRFToken",
  withCredentials: true,
});

export default axiosClient;
