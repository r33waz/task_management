import axios from "axios";

console.log(import.meta.env.VITE_SERVER_URL);

const BASE_API = {
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api/v1`,
  timeout: 2000,
  headers: {
    // Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
    "Content-Type": "application/json",
  },
};

const PHOTO_API = {
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "multipart/form-data",
    // Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN}`,
  },
  // withCredentials: true,
};

 const main_url = axios.create(BASE_API);

 const photo_url = axios.create(PHOTO_API);

export { main_url, photo_url };
