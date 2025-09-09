import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

// Request interceptor → her istek öncesi token ekle
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMatches = () => API.get("/matches/bracket");
export const voteMatch = (matchId, blogId) => API.post("/matches/vote", { matchId, blogId });
export const createBlog = (formData) => API.post("/blogs", formData);
export const getBlogs = () => API.get("/blogs");
export const getTopBlogs = () => API.get("/blogs/top");
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

export default API;