import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE == "development"
      ? "http://localhost:8000/api"
      : "/api",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true, // This is important for sending cookies with requests
});
