import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://form-backend-r4xi.onrender.com/api",
});

export default API;
