import axios from "axios";

const api = axios.create({
  baseURL: "https://skillexbackend-5.onrender.com/api",
});

export default api;
