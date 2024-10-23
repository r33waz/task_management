import axios from "axios";


const getRefreshToken = () => localStorage.getItem('refreshToken');

const BASE_API = {
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api/v1`,
  timeout: 2000,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getRefreshToken()}`,
  },
};

const PHOTO_API = {
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer ${getRefreshToken()}`,
  },
};

const main_url = axios.create(BASE_API);
const photo_url = axios.create(PHOTO_API);

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  try {
    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/refresh-token`, {
      token: refreshToken,
    });

    localStorage.setItem("accessToken", response.data.accessToken);
    return response.data.accessToken;
  } catch (error) {
    console.error("Refresh token is expired or invalid:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/"; 
    throw error; 
  }
};

main_url.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; 

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        return main_url(originalRequest); 
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

photo_url.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return photo_url(originalRequest); 
      } catch (refreshError) {
        console.error("Failed to refresh token:", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { main_url, photo_url };
